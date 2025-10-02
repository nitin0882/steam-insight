import { formatGameForDisplay, getGameReviews, searchGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: "Search query is required",
        data: [],
      })
    }

    const games = await searchGames(query, limit)

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
      query,
    })
  } catch (error) {
    console.error("Error in search games API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search games",
        data: [],
      },
      { status: 500 },
    )
  }
}
