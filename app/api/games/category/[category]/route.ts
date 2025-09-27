import { formatGameForDisplay, getGamesByGenre } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

// Mapping from category names to Steam genre IDs
const categoryToGenreMapping: Record<string, string> = {
    "action": "1", // Action
    "rpg": "3", // RPG
    "strategy": "2", // Strategy
    "indie": "23", // Indie
    "adventure": "25", // Adventure
    "simulation": "28", // Simulation
    "racing": "9", // Racing
    "sports": "18", // Sports
    "puzzle": "4", // Casual (often includes puzzles)
    "horror": "21", // Adventure (horror is often under adventure)
    "multiplayer": "29", // Massively Multiplayer
    "arcade": "4", // Casual (arcade style games)
}

export async function GET(
    request: NextRequest,
    { params }: { params: { category: string } }
) {
    try {
        const category = decodeURIComponent(params.category).toLowerCase()
        const { searchParams } = new URL(request.url)
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50) // Max 50 games

        // Check if category is valid
        const genreId = categoryToGenreMapping[category]
        if (!genreId) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid category: ${category}`,
                    data: [],
                    count: 0
                },
                { status: 400 }
            )
        }

        console.log(`Fetching games for category: ${category} (genre ID: ${genreId}) with limit: ${limit}`)

        // Get games by genre
        const steamGames = await getGamesByGenre(genreId, limit * 2) // Get more games for better filtering

        // Format games for display
        const formattedGames = steamGames
            .map(formatGameForDisplay)
            .filter(game => game.id && game.id !== 0) // Filter out invalid games
            .slice(0, limit) // Limit the results

        console.log(`Successfully fetched ${formattedGames.length} games for category: ${category}`)

        return NextResponse.json({
            success: true,
            data: formattedGames,
            count: formattedGames.length,
            category: category,
            genreId: genreId
        })

    } catch (error) {
        console.error("Error fetching games by category:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch games by category",
                data: [],
                count: 0
            },
            { status: 500 }
        )
    }
}