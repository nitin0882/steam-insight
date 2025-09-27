import { generateReviewId } from "@/lib/review-id-utils"
import { getGameDetails, getGameReviews, SteamReview } from "@/lib/steam-api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Enhanced review interface with unique ID
export interface GameReview extends SteamReview {
  unique_id: string
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor") || "*"
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)
    const reviewType = (searchParams.get("type") as "all" | "positive" | "negative") || "all"
    const purchaseType = (searchParams.get("purchase") as "all" | "steam" | "non_steam_purchase") || "all"
    const sortBy = searchParams.get("sort") || "helpful" // helpful, recent, funny, quality

    const appId = Number.parseInt(params.id)
    if (isNaN(appId)) {
      return NextResponse.json({ success: false, error: "Invalid game ID" }, { status: 400 })
    }

    console.log(`Fetching reviews for game ${appId} with cursor: ${cursor}, limit: ${limit}, sort: ${sortBy}`)

    // Get game details first to verify the game exists
    const gameDetails = await getGameDetails(appId)
    if (!gameDetails) {
      return NextResponse.json({
        success: false,
        error: "Game not found",
        data: []
      }, { status: 404 })
    }

    // Get reviews from Steam API
    const reviewData = await getGameReviews(appId, cursor, reviewType, purchaseType)

    if (!reviewData.reviews || reviewData.reviews.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        cursor: "",
        summary: reviewData.query_summary || {
          num_reviews: 0,
          review_score: 0,
          review_score_desc: "No Reviews"
        },
        game: {
          appid: gameDetails.appid,
          name: gameDetails.name,
          header_image: gameDetails.header_image
        },
        total: 0
      })
    }

    // Filter out fallback reviews and add unique IDs
    const realReviews = reviewData.reviews
      .filter(review => !review.recommendationid.includes('fallback'))
      .map(review => {
        const qualityScore = calculateReviewQualityScore(review)
        const helpfulnessRatio = review.votes_up > 0
          ? review.votes_up / (review.votes_up + (review.votes_funny || 0))
          : 0

        return {
          ...review,
          unique_id: generateReviewId(review, appId),
          quality_score: qualityScore,
          helpfulness_ratio: helpfulnessRatio
        } as GameReview
      })

    // Sort reviews based on the requested sort type
    let sortedReviews = realReviews
    switch (sortBy) {
      case "recent":
        sortedReviews = realReviews.sort((a, b) => b.timestamp_created - a.timestamp_created)
        break
      case "funny":
        sortedReviews = realReviews.sort((a, b) => (b.votes_funny || 0) - (a.votes_funny || 0))
        break
      case "quality":
        sortedReviews = realReviews.sort((a, b) => b.quality_score - a.quality_score)
        break
      case "helpful":
      default:
        sortedReviews = realReviews.sort((a, b) => b.votes_up - a.votes_up)
        break
    }

    // Limit the results
    const limitedReviews = sortedReviews.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedReviews,
      cursor: reviewData.cursor,
      summary: reviewData.query_summary,
      game: {
        appid: gameDetails.appid,
        name: gameDetails.name,
        header_image: gameDetails.header_image,
        genres: gameDetails.genres || []
      },
      sort: sortBy,
      total: limitedReviews.length
    })

  } catch (error) {
    console.error("Error in game reviews API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch game reviews",
        data: [],
      },
      { status: 500 }
    )
  }
}
