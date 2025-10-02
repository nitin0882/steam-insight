import { generateReviewId } from "@/lib/review-id-utils"
import { getGameReviews, SteamReview } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Enhanced review interface with unique ID
export interface ReviewWithId extends SteamReview {
    unique_id: string
    game: {
        appid: number
        name: string
        header_image: string
        genres: Array<{
            id: string
            description: string
        }>
    }
    quality_score: number
    helpfulness_ratio: number
}

// Parse review ID to extract components
function parseReviewId(reviewId: string): { hash: string; gameId: number } | null {
    const match = reviewId.match(/^rv_(\d+)_([a-f0-9]{12})$/)
    if (!match) {
        return null
    }
    return {
        gameId: parseInt(match[1], 10),
        hash: match[2]
    }
}

// Algorithm to calculate review quality score (same as in best reviews)
function calculateReviewQualityScore(review: SteamReview): number {
    let score = 0

    // Base score for being a review
    score += 10

    // Length bonus (longer reviews tend to be more helpful)
    const reviewLength = review.review.length
    if (reviewLength > 500) score += 30
    else if (reviewLength > 200) score += 20
    else if (reviewLength > 100) score += 10
    else if (reviewLength < 50) score -= 5

    // Helpfulness ratio
    const totalVotes = review.votes_up + (review.votes_funny || 0)
    const helpfulnessRatio = totalVotes > 0 ? review.votes_up / totalVotes : 0
    score += helpfulnessRatio * 25

    // Bonus for high vote counts
    if (review.votes_up > 100) score += 20
    else if (review.votes_up > 50) score += 15
    else if (review.votes_up > 20) score += 10
    else if (review.votes_up > 10) score += 5

    // Author credibility
    if (review.author.num_reviews > 20) score += 10
    else if (review.author.num_reviews > 10) score += 5

    // Playtime credibility
    const hoursPlayed = review.author.playtime_at_review / 60
    if (hoursPlayed > 100) score += 15
    else if (hoursPlayed > 50) score += 10
    else if (hoursPlayed > 20) score += 5
    else if (hoursPlayed < 2) score -= 10

    // Recent activity bonus
    if (review.author.playtime_last_two_weeks > 0) score += 5

    // Steam purchase verification
    if (review.steam_purchase) score += 10

    // Review awards bonus
    if (review.review_awards && review.review_awards.length > 0) {
        const totalAwardVotes = review.review_awards.reduce((sum, award) => sum + award.votes, 0)
        score += Math.min(totalAwardVotes * 2, 20)
    }

    return Math.max(0, score)
}

// Find a specific review by searching through games and matching the ID
async function findReviewById(reviewId: string): Promise<ReviewWithId | null> {
    const parsedId = parseReviewId(reviewId)
    if (!parsedId) {
        return null
    }

    const { gameId } = parsedId

    try {

        // First, get the game details
        const { getGameDetails } = await import("@/lib/steam-api")
        const game = await getGameDetails(gameId)

        if (!game) {
            return null
        }

        // Get reviews from this specific game
        const reviewData = await getGameReviews(gameId, "*", "all", "all")

        if (reviewData.reviews && reviewData.reviews.length > 0) {
            // Filter out fallback reviews
            const realReviews = reviewData.reviews.filter(review =>
                !review.recommendationid.includes('fallback')
            )

            // Check each review to see if it matches our ID
            for (const review of realReviews) {
                const generatedId = generateReviewId(review, gameId)

                if (generatedId === reviewId) {

                    // Calculate quality metrics
                    const qualityScore = calculateReviewQualityScore(review)
                    const helpfulnessRatio = review.votes_up > 0
                        ? review.votes_up / (review.votes_up + (review.votes_funny || 0))
                        : 0

                    return {
                        ...review,
                        unique_id: reviewId,
                        game: {
                            appid: game.appid,
                            name: game.name,
                            header_image: game.header_image || "",
                            genres: game.genres || []
                        },
                        quality_score: qualityScore,
                        helpfulness_ratio: helpfulnessRatio
                    }
                }
            }
        }

        return null

    } catch (error) {
        console.error("Error finding review by ID:", error)
        return null
    }
}

// GET /api/reviews/[id] - Get a specific review by unique ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const reviewId = params.id

        if (!reviewId) {
            return NextResponse.json(
                { error: "Review ID is required" },
                { status: 400 }
            )
        }

        const review = await findReviewById(reviewId)

        if (!review) {
            return NextResponse.json(
                {
                    error: "Review not found",
                    message: "The specified review could not be found. It may have been removed or the ID is invalid."
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            review,
            message: "Review found successfully"
        })

    } catch (error) {
        console.error("Review lookup API error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch review",
                message: "An error occurred while fetching the review. Please try again later."
            },
            { status: 500 }
        )
    }
}

// Export the generateReviewId function for use in other parts of the app
export { generateReviewId }

