import { formatGameForDisplay, getRelatedGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const gameId = Number.parseInt(params.id)
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "4")

    if (!gameId || isNaN(gameId)) {
        return NextResponse.json({
            success: false,
            error: "Invalid game ID",
        }, { status: 400 })
    }

    try {
        console.log(`Fetching related games for game ${gameId} with limit: ${limit}`)

        const games = await getRelatedGames(gameId, limit)
        const formattedGames = games.map(formatGameForDisplay)

        console.log(`Successfully fetched ${formattedGames.length} related games for game ${gameId}`)

        return NextResponse.json({
            success: true,
            data: formattedGames,
            count: formattedGames.length,
        })
    } catch (error) {
        console.error(`Error in related games API for game ${gameId}:`, error)
        console.error("Error stack:", error instanceof Error ? error.stack : error)

        // Return fallback data instead of error to prevent frontend crashes
        try {
            const fallbackGames = Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
                id: 570 + i,
                name: `Related Game ${i + 1}`,
                image: `https://cdn.akamai.steamstatic.com/steam/apps/${570 + i}/header.jpg`,
                rating: 4.0 + (i % 5) * 0.1,
                reviewCount: 1000 + i * 100,
                price: i % 3 === 0 ? "Free to Play" : `$${Math.max(9.99, 39.99 - i * 2)}`,
                tags: ["Action", "Adventure"],
                releaseDate: "2023-01-01",
                description: "A game similar to what you're viewing.",
                screenshots: [],
                movies: [],
                developers: ["Game Developer"],
                publishers: ["Game Publisher"]
            }))

            console.log(`Returning ${fallbackGames.length} fallback related games for game ${gameId}`)

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
                id: 570,
                name: "Dota 2",
                image: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
                rating: 4.2,
                reviewCount: 2000000,
                price: "Free to Play",
                tags: ["Action", "Strategy", "Multiplayer"],
                releaseDate: "2013-07-09",
                description: "A popular MOBA game.",
                screenshots: [],
                movies: [],
                developers: ["Valve"],
                publishers: ["Valve"]
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