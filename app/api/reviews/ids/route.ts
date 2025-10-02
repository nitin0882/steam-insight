import { generateReviewId, parseReviewId } from "@/lib/review-id-utils"
import { getGameReviews, getPopularGames } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export interface ReviewIdMapping {
    unique_id: string
    game_id: number
    game_name: string
    steam_recommendation_id: string
    author_steam_id: string
    timestamp_created: number
    quality_score: number
    voted_up: boolean
    votes_up: number
}

// GET /api/reviews/ids - Get a list of available review IDs with metadata
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200)
        const gameId = searchParams.get("game_id")
        const includeMetadata = searchParams.get("metadata") === "true"

        const reviewMappings: ReviewIdMapping[] = []

        if (gameId) {
            // Get reviews for a specific game
            const appId = parseInt(gameId)
            if (isNaN(appId)) {
                return NextResponse.json(
                    { error: "Invalid game ID" },
                    { status: 400 }
                )
            }

            const reviewData = await getGameReviews(appId, "*", "all", "all")
            if (reviewData.reviews && reviewData.reviews.length > 0) {
                const realReviews = reviewData.reviews.filter(review =>
                    !review.recommendationid.includes('fallback')
                )

                for (const review of realReviews.slice(0, limit)) {
                    const uniqueId = generateReviewId(review, appId)
                    reviewMappings.push({
                        unique_id: uniqueId,
                        game_id: appId,
                        game_name: "Game " + appId, // Would need game details to get real name
                        steam_recommendation_id: review.recommendationid,
                        author_steam_id: review.author.steamid,
                        timestamp_created: review.timestamp_created,
                        quality_score: calculateQualityScore(review),
                        voted_up: review.voted_up,
                        votes_up: review.votes_up
                    })
                }
            }
        } else {
            // Get reviews from popular games
            const games = await getPopularGames(20)
            let reviewCount = 0

            for (const game of games) {
                if (reviewCount >= limit) break

                try {
                    const reviewData = await getGameReviews(game.appid, "*", "all", "all")
                    if (reviewData.reviews && reviewData.reviews.length > 0) {
                        const realReviews = reviewData.reviews.filter(review =>
                            !review.recommendationid.includes('fallback')
                        )

                        const gameReviewLimit = Math.min(
                            realReviews.length,
                            Math.ceil((limit - reviewCount) / Math.max(1, games.length - games.indexOf(game)))
                        )

                        for (const review of realReviews.slice(0, gameReviewLimit)) {
                            const uniqueId = generateReviewId(review, game.appid)
                            reviewMappings.push({
                                unique_id: uniqueId,
                                game_id: game.appid,
                                game_name: game.name,
                                steam_recommendation_id: review.recommendationid,
                                author_steam_id: review.author.steamid,
                                timestamp_created: review.timestamp_created,
                                quality_score: calculateQualityScore(review),
                                voted_up: review.voted_up,
                                votes_up: review.votes_up
                            })
                            reviewCount++

                            if (reviewCount >= limit) break
                        }
                    }

                    // Small delay to be respectful to API
                    await new Promise(resolve => setTimeout(resolve, 100))
                } catch (error) {
                    console.error(`Error fetching reviews for game ${game.name}:`, error)
                    continue
                }
            }
        }

        // Sort by quality score
        reviewMappings.sort((a, b) => b.quality_score - a.quality_score)

        if (includeMetadata) {
            return NextResponse.json({
                review_ids: reviewMappings,
                total: reviewMappings.length,
                message: `Found ${reviewMappings.length} review IDs`
            })
        } else {
            // Return just the IDs
            return NextResponse.json({
                review_ids: reviewMappings.map(r => r.unique_id),
                total: reviewMappings.length,
                message: `Found ${reviewMappings.length} review IDs`
            })
        }

    } catch (error) {
        console.error("Review IDs API error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch review IDs",
                message: "An error occurred while fetching review IDs. Please try again later."
            },
            { status: 500 }
        )
    }
}

// POST /api/reviews/ids - Validate or generate review IDs
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { review_ids, action = "validate" } = body

        if (!Array.isArray(review_ids)) {
            return NextResponse.json(
                { error: "review_ids must be an array" },
                { status: 400 }
            )
        }

        if (action === "validate") {
            // Validate review ID format
            const validationResults = review_ids.map(id => ({
                review_id: id,
                is_valid: parseReviewId(id) !== null,
                format_valid: typeof id === 'string' && id.startsWith('rv_') && id.match(/^rv_\d+_[a-f0-9]{12}$/) !== null
            }))

            return NextResponse.json({
                validations: validationResults,
                valid_count: validationResults.filter(r => r.is_valid).length,
                total: validationResults.length
            })
        }

        return NextResponse.json(
            { error: "Invalid action. Supported actions: validate" },
            { status: 400 }
        )

    } catch (error) {
        console.error("Review IDs POST API error:", error)
        return NextResponse.json(
            {
                error: "Failed to process review IDs",
                message: "An error occurred while processing review IDs. Please try again later."
            },
            { status: 500 }
        )
    }
}

// Simple quality score calculation
interface ReviewAuthor {
    steamid?: string
    num_reviews?: number
    playtime_at_review?: number
}

interface Review {
    review?: string
    votes_up?: number
    author?: ReviewAuthor
    steam_purchase?: boolean
}

function calculateQualityScore(review: Review): number {
    let score = 10 // Base score

    // Length bonus
    const length = review.review?.length ?? 0
    if (length > 500) score += 30
    else if (length > 200) score += 20
    else if (length > 100) score += 10

    // Vote bonus
    const votesUp = review.votes_up ?? 0
    if (votesUp > 50) score += 20
    else if (votesUp > 20) score += 15
    else if (votesUp > 10) score += 10
    else if (votesUp > 5) score += 5

    // Author credibility
    const authorNum = review.author?.num_reviews ?? 0
    if (authorNum > 10) score += 10
    const authorPlaytime = review.author?.playtime_at_review ?? 0
    if (authorPlaytime > 3600) score += 10 // 1+ hours

    // Steam purchase
    if (review.steam_purchase) score += 10

    return Math.max(0, score)
}