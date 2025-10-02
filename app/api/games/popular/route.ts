import { formatGameForDisplay, getGameReviews, getPopularGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {

    const games = await getPopularGames(limit)

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
    console.error("Error in popular games API:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : error)

    // Return fallback data instead of error to prevent frontend crashes
    try {
      const fallbackGames = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
        id: 730 + i,
        name: `Popular Game ${i + 1}`,
        image: `https://cdn.akamai.steamstatic.com/steam/apps/${730 + i}/header.jpg`,
        rating: 4.0 + (i % 5) * 0.1,
        reviewCount: 1000 + i * 100,
        price: i % 3 === 0 ? "Free to Play" : `$${Math.max(9.99, 39.99 - i * 2)}`,
        tags: ["Action", "Multiplayer"],
        releaseDate: "2023-01-01",
        description: "A popular Steam game with engaging gameplay.",
        screenshots: [],
        movies: [],
        developers: ["Game Developer"],
        publishers: ["Game Publisher"]
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
        id: 730,
        name: "Counter-Strike 2",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
        rating: 4.5,
        reviewCount: 2000000,
        price: "Free to Play",
        tags: ["Action", "FPS", "Multiplayer"],
        releaseDate: "2023-09-27",
        description: "The world's most popular FPS game.",
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
