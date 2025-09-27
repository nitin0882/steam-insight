import { generateReviewId } from "@/lib/review-id-utils"
import { getGameReviews, getPopularGames, SteamReview } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Enhanced review interface with game context and unique ID
export interface BestReview extends SteamReview {
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

// Algorithm to calculate review quality score
function calculateReviewQualityScore(review: SteamReview): number {
    let score = 0

    // Base score for being a review
    score += 10

    // Length bonus (longer reviews tend to be more helpful)
    const reviewLength = review.review.length
    if (reviewLength > 500) score += 30
    else if (reviewLength > 200) score += 20
    else if (reviewLength > 100) score += 10
    else if (reviewLength < 50) score -= 5 // Penalty for very short reviews

    // Helpfulness ratio (votes_up / total_votes)
    const totalVotes = review.votes_up + (review.votes_funny || 0)
    const helpfulnessRatio = totalVotes > 0 ? review.votes_up / totalVotes : 0
    score += helpfulnessRatio * 25

    // Bonus for high vote counts (popular reviews)
    if (review.votes_up > 100) score += 20
    else if (review.votes_up > 50) score += 15
    else if (review.votes_up > 20) score += 10
    else if (review.votes_up > 10) score += 5

    // Author credibility (experienced reviewers)
    if (review.author.num_reviews > 20) score += 10
    else if (review.author.num_reviews > 10) score += 5

    // Playtime credibility (substantial play time at review)
    const hoursPlayed = review.author.playtime_at_review / 60
    if (hoursPlayed > 100) score += 15
    else if (hoursPlayed > 50) score += 10
    else if (hoursPlayed > 20) score += 5
    else if (hoursPlayed < 2) score -= 10 // Penalty for very low playtime

    // Recent activity bonus (author still playing)
    if (review.author.playtime_last_two_weeks > 0) score += 5

    // Steam purchase verification
    if (review.steam_purchase) score += 10

    // Review awards bonus
    if (review.review_awards && review.review_awards.length > 0) {
        const totalAwardVotes = review.review_awards.reduce((sum, award) => sum + award.votes, 0)
        score += Math.min(totalAwardVotes * 2, 20) // Cap at 20 points
    }

    // Recency factor (newer reviews get slight bonus)
    const reviewAge = (Date.now() / 1000) - review.timestamp_created
    const daysOld = reviewAge / (24 * 60 * 60)
    if (daysOld < 30) score += 5
    else if (daysOld < 90) score += 3
    else if (daysOld > 365) score -= 2

    // Content quality heuristics
    const text = review.review.toLowerCase()

    // Bonus for detailed reviews
    if (text.includes('graphics') || text.includes('gameplay') || text.includes('story')) score += 5
    if (text.includes('pros') && text.includes('cons')) score += 10
    if (text.includes('recommend') || text.includes('worth')) score += 3

    // Penalty for low-effort content
    if (text.includes('10/10') || text.includes('100%') || text === text.toUpperCase()) score -= 5
    if (reviewLength < 100 && (text.includes('good game') || text.includes('bad game'))) score -= 10

    // Balanced review bonus (mentions both positives and negatives)
    const hasPositive = text.includes('good') || text.includes('great') || text.includes('amazing') || text.includes('love')
    const hasNegative = text.includes('bad') || text.includes('terrible') || text.includes('awful') || text.includes('hate') || text.includes('but') || text.includes('however')
    if (hasPositive && hasNegative) score += 8

    return Math.max(0, score) // Ensure non-negative score
}

// Get diverse, high-quality reviews from popular games
async function getBestReviews(limit: number = 20): Promise<BestReview[]> {
    try {
        console.log(`Fetching best reviews with limit: ${limit}`)

        // Get popular games to source reviews from
        const games = await getPopularGames(30) // Get more games for better review diversity
        console.log(`Got ${games.length} popular games for review sourcing`)

        if (games.length === 0) {
            console.warn("No games available for reviews")
            return []
        }

        const allReviews: BestReview[] = []
        const maxReviewsPerGame = Math.max(2, Math.floor(limit / games.length * 2)) // Get more than needed for filtering

        // Fetch reviews from each game with error handling
        for (let i = 0; i < Math.min(games.length, 15); i++) { // Limit to 15 games to avoid timeout
            const game = games[i]

            try {
                console.log(`Fetching reviews for game: ${game.name} (${game.appid})`)

                // Try different configurations to get real reviews
                let reviewData

                // First try: All purchases, all review types
                reviewData = await getGameReviews(
                    game.appid,
                    "*", // Start from beginning
                    "all", // All review types
                    "all" // All purchase types (not just Steam)
                )

                // If no reviews, try just positive reviews
                if (!reviewData.reviews || reviewData.reviews.length === 0) {
                    console.log(`No reviews found for ${game.name}, trying positive reviews only`)
                    reviewData = await getGameReviews(
                        game.appid,
                        "*",
                        "positive",
                        "all"
                    )
                }

                if (reviewData.reviews && reviewData.reviews.length > 0) {
                    // Filter out any fallback reviews (they have "fallback" in recommendationid)
                    const realReviews = reviewData.reviews.filter(review =>
                        !review.recommendationid.includes('fallback')
                    )

                    console.log(`Found ${realReviews.length} real reviews out of ${reviewData.reviews.length} total for ${game.name}`)

                    if (realReviews.length > 0) {
                        // Process and score reviews using real reviews only
                        const scoredReviews = realReviews
                            .map(review => {
                                const qualityScore = calculateReviewQualityScore(review)
                                const helpfulnessRatio = review.votes_up > 0
                                    ? review.votes_up / (review.votes_up + (review.votes_funny || 0))
                                    : 0

                                return {
                                    ...review,
                                    unique_id: generateReviewId(review, game.appid),
                                    game: {
                                        appid: game.appid,
                                        name: game.name,
                                        header_image: game.header_image || "",
                                        genres: game.genres || []
                                    },
                                    quality_score: qualityScore,
                                    helpfulness_ratio: helpfulnessRatio
                                } as BestReview
                            })
                            .filter(review => {
                                // Filter out low-quality reviews
                                return review.quality_score > 25 && // Minimum quality threshold
                                    review.review.length > 50 && // Minimum length
                                    review.votes_up > 2 && // Some community validation
                                    review.author.playtime_at_review > 60 // At least 1 hour played
                            })
                            .sort((a, b) => b.quality_score - a.quality_score)
                            .slice(0, maxReviewsPerGame)

                        allReviews.push(...scoredReviews)
                        console.log(`Added ${scoredReviews.length} quality reviews from ${game.name}`)
                    }
                } else {
                    console.log(`No reviews found for ${game.name}`)
                }

                // Small delay to be respectful to API
                if (i < games.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            } catch (error) {
                console.error(`Failed to fetch reviews for game ${game.name}:`, error)
                continue
            }
        }

        // Sort all reviews by quality score and ensure diversity
        const sortedReviews = allReviews.sort((a, b) => b.quality_score - a.quality_score)

        // Ensure genre diversity in final selection
        const finalReviews: BestReview[] = []
        const gamesSeen = new Set<number>()
        const genresSeen = new Set<string>()

        for (const review of sortedReviews) {
            // Skip if we already have multiple reviews from this game
            const gameReviewCount = finalReviews.filter(r => r.game.appid === review.game.appid).length
            if (gameReviewCount >= 2) continue

            // Prefer reviews from games with different genres
            const reviewGenres = review.game.genres.map(g => g.description)
            const hasNewGenre = reviewGenres.some(genre => !genresSeen.has(genre))

            if (finalReviews.length < limit) {
                finalReviews.push(review)
                gamesSeen.add(review.game.appid)
                reviewGenres.forEach(genre => genresSeen.add(genre))
            } else if (hasNewGenre && finalReviews.length < limit * 1.5) {
                // Allow some overflow for genre diversity
                finalReviews.push(review)
                gamesSeen.add(review.game.appid)
                reviewGenres.forEach(genre => genresSeen.add(genre))
            }

            if (finalReviews.length >= limit) break
        }

        console.log(`Returning ${finalReviews.length} best reviews from ${gamesSeen.size} games`)
        return finalReviews.slice(0, limit)

    } catch (error) {
        console.error("Error fetching best reviews:", error)
        return []
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50) // Cap at 50

        console.log(`Best reviews API called with limit: ${limit}`)

        const reviews = await getBestReviews(limit)

        if (reviews.length === 0) {
            return NextResponse.json(
                {
                    error: "No reviews available",
                    reviews: [],
                    message: "Unable to fetch reviews at this time. Please try again later."
                },
                { status: 503 }
            )
        }

        return NextResponse.json({
            reviews,
            total: reviews.length,
            message: `Found ${reviews.length} high-quality reviews`
        })

    } catch (error) {
        console.error("Best reviews API error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch reviews",
                reviews: [],
                message: "An error occurred while fetching reviews. Please try again later."
            },
            { status: 500 }
        )
    }
}