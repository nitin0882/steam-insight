import { formatGameForDisplay, getTrendingGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    try {
        console.log(`Fetching trending games with limit: ${limit}`)

        const games = await getTrendingGames(limit)
        const formattedGames = games.map(formatGameForDisplay)

        console.log(`Successfully fetched ${formattedGames.length} trending games`)

        return NextResponse.json({
            success: true,
            data: formattedGames,
            count: formattedGames.length,
        })
    } catch (error) {
        console.error("Error in trending games API:", error)
        console.error("Error stack:", error instanceof Error ? error.stack : error)

        // Return fallback data instead of error to prevent frontend crashes
        try {
            const fallbackGames = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
                id: 1091500 + i, // Starting from Cyberpunk 2077
                name: `Trending Game ${i + 1}`,
                image: `https://cdn.akamai.steamstatic.com/steam/apps/${1091500 + i}/header.jpg`,
                rating: 4.2 + (i % 4) * 0.1,
                reviewCount: 5000 + i * 200,
                price: i % 3 === 0 ? "Free to Play" : `$${Math.max(9.99, 29.99 - i * 2)}`,
                tags: ["Action", "Adventure", "RPG"],
                releaseDate: "2024-01-01",
                description: "A trending Steam game with cutting-edge gameplay.",
                screenshots: [],
                movies: [],
                developers: ["Trending Developer"],
                publishers: ["Trending Publisher"]
            }))

            console.log(`Returning ${fallbackGames.length} fallback trending games`)

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
                id: 1091500,
                name: "Cyberpunk 2077",
                image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
                rating: 4.2,
                reviewCount: 100000,
                price: "$29.99",
                tags: ["Action", "RPG"],
                releaseDate: "2020-12-10",
                description: "A popular RPG game on Steam.",
                screenshots: [],
                movies: [],
                developers: ["CD PROJEKT RED"],
                publishers: ["CD PROJEKT RED"]
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