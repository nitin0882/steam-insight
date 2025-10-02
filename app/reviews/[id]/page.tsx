import { generateReviewId, parseReviewId } from "@/lib/review-id-utils"
import { getGameDetails, getGameReviews, SteamReview } from "@/lib/steam-api"
import { stripBBCode } from "@/lib/utils"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import ReviewPageClient from "./ReviewPageClient"

// Enhanced review interface with unique ID
interface ReviewWithId extends SteamReview {
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

// Cache for review lookups to avoid duplicate API calls
const reviewCache = new Map<string, { data: ReviewWithId | null; timestamp: number }>()
const REVIEW_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Find a specific review by searching through games and matching the ID
async function findReviewById(reviewId: string): Promise<ReviewWithId | null> {
    // Check cache first
    const cached = reviewCache.get(reviewId)
    if (cached && Date.now() - cached.timestamp < REVIEW_CACHE_DURATION) {
        return cached.data
    }

    const parsedId = parseReviewId(reviewId)
    if (!parsedId) {
        reviewCache.set(reviewId, { data: null, timestamp: Date.now() })
        return null
    }

    const { gameId } = parsedId

    try {
        // First, get the game details
        const game = await getGameDetails(gameId)

        if (!game) {
            reviewCache.set(reviewId, { data: null, timestamp: Date.now() })
            return null
        }

        // Get reviews from this specific game, fetching multiple pages if needed
        let allReviews: SteamReview[] = []
        let cursor = "*"
        const maxPages = 10 // Allow more pages since we're fetching 100 per page

        for (let page = 0; page < maxPages; page++) {
            const reviewData = await getGameReviews(gameId, cursor, "all", "all")

            if (reviewData.reviews && reviewData.reviews.length > 0) {
                // Filter out fallback reviews
                const realReviews = reviewData.reviews.filter(review =>
                    !review.recommendationid.includes('fallback')
                )
                allReviews = allReviews.concat(realReviews)

                // Check each review to see if it matches our ID
                for (const review of realReviews) {
                    const generatedId = generateReviewId(review, gameId)

                    if (generatedId === reviewId) {
                        // Calculate quality metrics
                        const qualityScore = calculateReviewQualityScore(review)
                        const helpfulnessRatio = review.votes_up > 0
                            ? review.votes_up / (review.votes_up + (review.votes_funny || 0))
                            : 0

                        const result = {
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

                        reviewCache.set(reviewId, { data: result, timestamp: Date.now() })
                        return result
                    }
                }

                // Check if we have a next cursor
                if (reviewData.cursor && reviewData.cursor !== cursor && reviewData.cursor !== "") {
                    cursor = reviewData.cursor
                } else {
                    // No more pages
                    break
                }
            } else {
                // No reviews in this batch
                break
            }
        }

        reviewCache.set(reviewId, { data: null, timestamp: Date.now() })
        return null

    } catch (error) {
        console.error("Error finding review by ID:", error)
        reviewCache.set(reviewId, { data: null, timestamp: Date.now() })
        return null
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const reviewId = params.id

    try {
        const review = await findReviewById(reviewId)

        if (!review) {
            return {
                title: "Review Not Found | SteamInsight",
                description: "The requested Steam review could not be found.",
            }
        }

        const authorName = review.author.personaname || "Steam User"
        const gameName = review.game.name
        const reviewSnippet = review.review.length > 150
            ? stripBBCode(review.review.substring(0, 150)) + "..."
            : stripBBCode(review.review)

        return {
            title: `${authorName}'s Review of ${gameName} | SteamInsight`,
            description: reviewSnippet,
            openGraph: {
                title: `${authorName}'s Review of ${gameName}`,
                description: reviewSnippet,
                type: "article",
                images: [
                    {
                        url: review.game.header_image || "/placeholder.jpg",
                        width: 1200,
                        height: 630,
                        alt: `${gameName} game header`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${authorName}'s Review of ${gameName}`,
                description: reviewSnippet,
                images: [review.game.header_image || "/placeholder.jpg"],
            },
        }
    } catch (error) {
        console.error("Error generating metadata:", error)
        return {
            title: "Steam Review | SteamInsight",
            description: "Read authentic Steam game reviews on SteamInsight.",
        }
    }
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
    const reviewId = params.id

    try {
        const review = await findReviewById(reviewId)

        if (!review) {
            notFound()
        }

        return <ReviewPageClient initialReview={review} reviewId={reviewId} />
    } catch (error) {
        console.error("Error loading review page:", error)
        notFound()
    }
}