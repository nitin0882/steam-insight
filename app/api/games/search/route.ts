import { formatGameForDisplay, searchGames } from "@/lib/steam-api"
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
    const formattedGames = games.map(formatGameForDisplay)

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
