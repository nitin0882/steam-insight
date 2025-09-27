import { formatGameForDisplay, getGameDetails, getGameReviews } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const gameId = Number.parseInt(params.id)

        if (isNaN(gameId)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid game ID",
                    data: null,
                },
                { status: 400 },
            )
        }

        const [gameData, reviewData] = await Promise.all([
            getGameDetails(gameId),
            getGameReviews(gameId, "*", "all", "all").catch(err => {
                console.warn(`Failed to fetch reviews for game ${gameId}:`, err.message)
                return null
            })
        ])

        if (!gameData) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Game not found",
                    data: null,
                },
                { status: 404 },
            )
        }

        type FormattedGame = Record<string, unknown> & {
            reviewBreakdown?: {
                totalReviews: number
                positiveReviews: number
                negativeReviews: number
                positivePercentage: number
                negativePercentage: number
                reviewScore: number
                reviewScoreDesc: string
            }
        }

        const formattedGame = formatGameForDisplay(gameData) as FormattedGame

        // Add review breakdown data if available
        if (reviewData?.query_summary) {
            const summary = reviewData.query_summary
            const totalReviews = summary.total_reviews || 0
            const positiveReviews = summary.total_positive || 0
            const negativeReviews = summary.total_negative || 0

            formattedGame.reviewBreakdown = {
                totalReviews,
                positiveReviews,
                negativeReviews,
                positivePercentage: totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0,
                negativePercentage: totalReviews > 0 ? Math.round((negativeReviews / totalReviews) * 100) : 0,
                reviewScore: summary.review_score || 0,
                reviewScoreDesc: summary.review_score_desc || "No reviews"
            }
        }

        return NextResponse.json({
            success: true,
            data: formattedGame,
        })
    } catch (error) {
        console.error("Error in game details API:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch game details",
                data: null,
            },
            { status: 500 },
        )
    }
}