import { formatGameForDisplay, getGameReviews, getTrendingGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50)

    try {
        const games = await getTrendingGames(limit)

        if (!games || games.length === 0) {
            console.warn("No trending games returned from algorithm")
            return NextResponse.json({
                success: false,
                error: "No trending games found",
                data: [],
                count: 0
            })
        }

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
            source: "steam-trending-algorithm",
            algorithm: "popularity + recency + metacritic + discounts"
        })
    } catch (error) {
        console.error("Error in trending games API:", error)
        console.error("Error stack:", error instanceof Error ? error.stack : error)

        return NextResponse.json({
            success: false,
            error: "Failed to fetch trending games",
            data: [],
            count: 0,
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}