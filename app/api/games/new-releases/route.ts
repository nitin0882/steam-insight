import { formatGameForDisplay, getGameReviews, getNewReleases } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    try {

        const games = await getNewReleases(limit)

        // Fetch review data for each game to get consistent ratings
        const gamesWithReviews = await Promise.all(
            games.map(async (game) => {
                try {
                    const reviewData = await getGameReviews(game.appid, "*", "all", "all").catch(() => null)
                    return { game, reviewData }
                } catch (error) {
                    console.warn(`Failed to fetch reviews for game ${game.appid}:`, error)
                    return { game, reviewData: null }
                }
            })
        )

        const formattedGames = gamesWithReviews.map(({ game, reviewData }) => {
            const formatted = formatGameForDisplay(game)

            // Override rating with Steam review score if available for consistency
            if (reviewData?.query_summary?.review_score && reviewData.query_summary.review_score > 0) {
                formatted.rating = reviewData.query_summary.review_score / 2 // Convert 10-point scale to 5-star scale
            }

            return formatted
        })

        return NextResponse.json({
            success: true,
            data: formattedGames,
            count: formattedGames.length,
        })
    } catch (error) {
        console.error("Error in new releases API:", error)
        console.error("Error stack:", error instanceof Error ? error.stack : error)

        // Return fallback data instead of error to prevent frontend crashes
        try {
            const fallbackGames = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
                id: 3000000 + i,
                name: `New Release Game ${i + 1}`,
                image: `https://cdn.akamai.steamstatic.com/steam/apps/${3000000 + i}/header.jpg`,
                rating: 4.0 + (i % 3) * 0.2,
                reviewCount: 100 + i * 50,
                price: i % 2 === 0 ? "Free to Play" : `$${19.99 + i * 5}`,
                tags: ["Action", "Adventure", "Indie"],
                releaseDate: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Recent dates
                description: "A recently released game with fresh gameplay and modern features.",
                screenshots: [],
                movies: [],
                developers: ["New Developer"],
                publishers: ["New Publisher"]
            }))

            return NextResponse.json({
                success: true,
                data: fallbackGames,
                count: fallbackGames.length,
                fallback: true,
                message: "Using fallback data due to Steam API issues"
            })
        } catch (fallbackError) {
            console.error("Fallback data creation failed:", fallbackError)

            // Last resort - return minimal but valid data
            const minimalGames = [{
                id: 3000000,
                name: "Recent Game",
                image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
                rating: 4.0,
                reviewCount: 1000,
                price: "$19.99",
                tags: ["Action"],
                releaseDate: new Date().toISOString().split('T')[0],
                description: "A recently released game.",
                screenshots: [],
                movies: [],
                developers: ["Developer"],
                publishers: ["Publisher"]
            }]

            return NextResponse.json({
                success: true,
                data: minimalGames,
                count: minimalGames.length,
                fallback: true,
                message: "Using minimal fallback data"
            })
        }
    }
}
