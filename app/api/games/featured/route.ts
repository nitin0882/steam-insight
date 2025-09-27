import { formatGameForDisplay, getPopularGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || "popular"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // For now, we'll use popular games for all categories
    // In a real implementation, you'd have different logic for each category
    const games = await getPopularGames(limit)
    const formattedGames = games.map(formatGameForDisplay)

    return NextResponse.json({
      success: true,
      data: formattedGames,
      count: formattedGames.length,
      category,
    })
  } catch (error) {
    console.error("Error in featured games API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch featured games",
        data: [],
      },
      { status: 500 },
    )
  }
}
