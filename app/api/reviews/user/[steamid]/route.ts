import { generateReviewId } from "@/lib/review-id-utils"
import { getGameDetails, getGameReviews, getOwnedGames, getUserSummaries, SteamReview } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Cache for user reviews
const userReviewsCache = new Map<string, { reviews: UserReview[], timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Enhanced review interface with game context and unique ID
export interface UserReview extends SteamReview {
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

// Algorithm to calculate review quality score (same as best reviews)
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

// Get all reviews by a specific Steam user
async function getUserReviews(steamId: string, limit: number = 20, page: number = 1): Promise<{ reviews: UserReview[], hasMore: boolean, totalFound: number }> {
    const cacheKey = `user-reviews-${steamId}`
    const cached = userReviewsCache.get(cacheKey)
    let allUserReviews: UserReview[] = []

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        allUserReviews = cached.reviews
    } else {
        // Fetch all reviews
        try {
            console.log(`[API] Starting review search for user ${steamId}`)

            // Strategy 1: Get user's owned games and search reviews there
            try {
                const ownedGames = await getOwnedGames(steamId, true)

                if (ownedGames && ownedGames.games && ownedGames.games.length > 0) {
                    console.log(`[API] User owns ${ownedGames.games.length} games, checking for reviews...`)

                    // Sort games by playtime (most played first) - these are most likely to have reviews
                    const sortedGames = ownedGames.games.sort((a: { playtime_forever: number }, b: { playtime_forever: number }) => b.playtime_forever - a.playtime_forever)

                    // Search through TOP owned games to collect user reviews
                    // Prioritize recently played games to find more recent reviews first
                    const maxGamesToSearch = Math.min(sortedGames.length, 50) // Check up to 50 owned games
                    const gamesToSearch = sortedGames.slice(0, maxGamesToSearch)

                    console.log(`[API] Checking reviews in top ${gamesToSearch.length} most played games`)

                    for (let i = 0; i < gamesToSearch.length; i++) {
                        const game = gamesToSearch[i]

                        try {
                            const reviewData = await getGameReviews(
                                game.appid,
                                "*", // Get all reviews for each game
                                "all",
                                "all"
                            )

                            if (reviewData.reviews && reviewData.reviews.length > 0) {
                                const realReviews = reviewData.reviews.filter((review: SteamReview) =>
                                    !review.recommendationid.includes('fallback')
                                )

                                const userGameReviews = realReviews.filter((review: SteamReview) =>
                                    review.author.steamid === steamId
                                )

                                if (userGameReviews.length > 0) {
                                    // Get game details for better context
                                    const gameDetails = await getGameDetails(game.appid)

                                    const processedReviews = userGameReviews.map((review: SteamReview) => {
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
                                                header_image: gameDetails?.header_image || gameDetails?.screenshots?.[0]?.path_thumbnail || "",
                                                genres: gameDetails?.genres || []
                                            },
                                            quality_score: qualityScore,
                                            helpfulness_ratio: helpfulnessRatio
                                        } as UserReview
                                    })

                                    allUserReviews.push(...processedReviews)
                                    console.log(`[API] Found ${processedReviews.length} reviews for game: ${game.name} (total so far: ${allUserReviews.length})`)
                                }
                            }

                            // Rate limiting - faster for better performance
                            if (i < gamesToSearch.length - 1) {
                                await new Promise(resolve => setTimeout(resolve, 50)) // Reduced from 100ms
                            }
                        } catch (error) {
                            console.error(`[API] Failed to fetch reviews for owned game ${game.name}:`, error)
                            continue
                        }
                    }
                } else {
                    console.warn(`[API] No owned games found for user ${steamId}`)
                }
            } catch (error) {
                console.warn(`[API] Failed to get owned games for user ${steamId}:`, error)
            }

            // Sort by timestamp (newest first)
            allUserReviews.sort((a, b) => b.timestamp_created - a.timestamp_created)
            const totalReviewsFound = allUserReviews.length
            console.log(`[API] Total reviews collected for user ${steamId}: ${totalReviewsFound}`)

            // Try to enhance user profile data if API key is available
            if (allUserReviews.length > 0) {
                try {
                    const steamIds = [steamId]
                    const userSummaries = await getUserSummaries(steamIds)
                    const userSummary = userSummaries.get(steamId)

                    if (userSummary) {
                        console.log(`[API] Enhanced user profile data for ${steamId}: ${userSummary.nickname}`)
                        // Enhance all reviews with user profile data
                        allUserReviews.forEach(review => {
                            review.author.personaname = userSummary.nickname
                            review.author.avatar = userSummary.avatar.small
                            review.author.avatarmedium = userSummary.avatar.medium
                            review.author.avatarfull = userSummary.avatar.large
                            review.author.profileurl = userSummary.url
                            review.author.realname = userSummary.realName
                            review.author.loccountrycode = userSummary.countryCode
                        })
                    } else {
                        console.warn(`[API] No user summary found for ${steamId} - Steam API key may be missing`)
                    }
                } catch (error) {
                    console.warn("[API] Failed to enhance user profile data:", error)
                }
            }

            // Cache the results
            userReviewsCache.set(cacheKey, { reviews: allUserReviews, timestamp: Date.now() })
        } catch (error) {
            console.error("[API] Error fetching user reviews:", error)
            return { reviews: [], hasMore: false, totalFound: 0 }
        }
    }

    // Apply pagination
    const totalFound = allUserReviews.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = allUserReviews.slice(startIndex, endIndex)
    const hasMore = endIndex < totalFound

    console.log(`[API] Returning ${paginatedReviews.length} reviews (page ${page}, total: ${totalFound})`)

    return {
        reviews: paginatedReviews,
        hasMore,
        totalFound
    }
}

export async function GET(request: NextRequest, { params }: { params: { steamid: string } }) {
    try {
        const steamId = params.steamid
        const { searchParams } = request.nextUrl
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50) // Cap at 50
        const page = parseInt(searchParams.get("page") || "1")

        if (!steamId) {
            return NextResponse.json(
                {
                    error: "Steam ID is required",
                    reviews: [],
                    message: "Please provide a valid Steam ID."
                },
                { status: 400 }
            )
        }

        const { reviews, hasMore, totalFound } = await getUserReviews(steamId, limit, page)

        // API node checker - validate response
        console.log(`[API] User ${steamId} - Found ${totalFound} total reviews, returning ${reviews.length} reviews for page ${page}, hasMore: ${hasMore}`)

        if (totalFound === 0) {
            console.warn(`[API] No reviews found for user ${steamId}`)
        }

        return NextResponse.json({
            reviews,
            total: totalFound,
            hasMore,
            message: `Found ${totalFound} reviews by user ${steamId}`
        })

    } catch (error) {
        console.error("User reviews API error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch user reviews",
                reviews: [],
                message: "An error occurred while fetching user reviews. Please try again later."
            },
            { status: 500 }
        )
    }
}