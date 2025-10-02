"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StyledText } from "@/components/ui/styled-text"
import { Clock, ExternalLink, MessageSquare, Star, ThumbsUp, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface GameReviewsProps {
  gameId: number
}

interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    playtime: number
    reviewCount: number
    profileUrl?: string
    countryCode?: string
    gamesOwned?: number
  }
  rating: number
  title: string
  content: string
  helpful: number
  funny: number
  timestamp: string
  recommended: boolean
  verified: boolean
  earlyAccess: boolean
  awards?: Array<{
    award_type: number
    votes: number
    description: string
  }>
  unique_id?: string
}

interface SteamReview {
  recommendationid?: string
  author?: {
    personaname?: string
    avatarmedium?: string
    avatar?: string
    playtime_forever?: number
    num_reviews?: number
    profileurl?: string
    countrycode?: string
    num_games_owned?: number
    steamid?: string
  }
  voted_up?: boolean
  review?: string
  votes_up?: number
  votes_funny?: number
  timestamp_created?: number
  steam_purchase?: boolean
  written_during_early_access?: boolean
  review_awards?: Array<{
    award_type: number
    votes: number
    description: string
  }>
  unique_id?: string
}



export function GameReviews({ gameId }: GameReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [sortBy, setSortBy] = useState("helpful")
  const [filterBy, setFilterBy] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  interface ReviewSummary {
    total_positive?: number
    total_negative?: number
    total_reviews?: number
    review_score?: number
  }

  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null)
  const [cursor, setCursor] = useState<string>("*")
  const [hasMore, setHasMore] = useState(true)

  const formatPlaytime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`
    return `${hours.toFixed(1)} hours`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredReviews = reviews.filter((review) => {
    if (filterBy === "positive") return review.recommended
    if (filterBy === "negative") return !review.recommended
    if (filterBy === "verified") return review.verified
    return true
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful - a.helpful
      case "recent":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  // Reset pagination when filters change
  useEffect(() => {
    setCursor("*")
    setHasMore(true)
  }, [sortBy, filterBy])

  // Fetch reviews on component mount or when filters change
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/games/${gameId}/reviews?cursor=*&limit=20&type=${filterBy === 'positive' ? 'positive' : filterBy === 'negative' ? 'negative' : 'all'}&sort=${sortBy}`)
        const data = await response.json()

        if (data.success && data.data) {
          // Store the review summary for statistics
          setReviewSummary(data.summary)

          // Transform Steam reviews to our Review interface
          const transformedReviews: Review[] = data.data.map((steamReview: SteamReview, index: number) => ({
            id: steamReview.recommendationid || `review-${index}`,
            author: {
              name: steamReview.author?.personaname || `User ${steamReview.author?.steamid?.slice(-6) || Math.random().toString(36).substr(2, 6)}`,
              avatar: steamReview.author?.avatarmedium || steamReview.author?.avatar || "/placeholder-user.jpg",
              playtime: Math.round((steamReview.author?.playtime_forever || 0) / 60), // Convert minutes to hours
              reviewCount: steamReview.author?.num_reviews || 1,
              profileUrl: steamReview.author?.profileurl,
              countryCode: steamReview.author?.countrycode,
              gamesOwned: steamReview.author?.num_games_owned || 0,
            },
            rating: steamReview.voted_up ? 5 : 2, // Convert boolean to 5-star rating
            title: steamReview.voted_up ? "Recommended" : "Not Recommended",
            content: steamReview.review || "No review text available",
            helpful: steamReview.votes_up || 0,
            funny: steamReview.votes_funny || 0,
            timestamp: steamReview.timestamp_created ? new Date(steamReview.timestamp_created * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            recommended: steamReview.voted_up || false,
            verified: steamReview.steam_purchase || false,
            earlyAccess: steamReview.written_during_early_access || false,
            awards: steamReview.review_awards || [],
            unique_id: steamReview.unique_id,
          }))

          setReviews(transformedReviews)
          setCursor(data.cursor || "")
          setHasMore(data.cursor && data.cursor !== "*" && data.data.length > 0)
        } else {
          setReviews([])
          setError(data.error || "No reviews available")
          setHasMore(false)
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
        setReviews([])
        setError("Failed to load reviews")
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchReviews()
    }
  }, [gameId, sortBy, filterBy])

  // Load more reviews function
  const loadMoreReviews = async () => {
    if (!hasMore || loadingMore) return

    try {
      setLoadingMore(true)
      const response = await fetch(`/api/games/${gameId}/reviews?cursor=${cursor}&limit=20&type=${filterBy === 'positive' ? 'positive' : filterBy === 'negative' ? 'negative' : 'all'}&sort=${sortBy}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Transform new Steam reviews to our Review interface
        const newTransformedReviews: Review[] = data.data.map((steamReview: SteamReview, index: number) => ({
          id: steamReview.recommendationid || `review-${reviews.length + index}`,
          author: {
            name: steamReview.author?.personaname || `User ${steamReview.author?.steamid?.slice(-6) || Math.random().toString(36).substr(2, 6)}`,
            avatar: steamReview.author?.avatarmedium || steamReview.author?.avatar || "/placeholder-user.jpg",
            playtime: Math.round((steamReview.author?.playtime_forever || 0) / 60), // Convert minutes to hours
            reviewCount: steamReview.author?.num_reviews || 1,
            profileUrl: steamReview.author?.profileurl,
            countryCode: steamReview.author?.countrycode,
            gamesOwned: steamReview.author?.num_games_owned || 0,
          },
          rating: steamReview.voted_up ? 5 : 2, // Convert boolean to 5-star rating
          title: steamReview.voted_up ? "Recommended" : "Not Recommended",
          content: steamReview.review || "No review text available",
          helpful: steamReview.votes_up || 0,
          funny: steamReview.votes_funny || 0,
          timestamp: steamReview.timestamp_created ? new Date(steamReview.timestamp_created * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          recommended: steamReview.voted_up || false,
          verified: steamReview.steam_purchase || false,
          earlyAccess: steamReview.written_during_early_access || false,
          awards: steamReview.review_awards || [],
          unique_id: steamReview.unique_id,
        }))

        // Append new reviews to existing ones
        setReviews(prev => [...prev, ...newTransformedReviews])
        setCursor(data.cursor || "")
        setHasMore(data.cursor && data.cursor !== "*" && data.data.length > 0)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error("Failed to load more reviews:", err)
      setError("Failed to load more reviews")
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <MotionEffect
          slide={{
            direction: 'up',
          }}
          fade
          zoom
          inView
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Player Reviews</h2>

            {/* Review Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="positive">Positive Only</SelectItem>
                  <SelectItem value="negative">Negative Only</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1" />

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {sortedReviews.length} of {reviews.length} reviews
                {hasMore && <span> • More available</span>}
              </div>
            </div>

            {/* Review Summary */}
            {/* Show notice when using fallback data */}
            {reviews.length > 0 && reviews[0]?.id?.includes('fallback') && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Demo Reviews</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Steam&apos;s review API is temporarily unavailable. Showing sample reviews for demonstration purposes.
                </p>
              </div>
            )}

            {reviewSummary && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {reviewSummary.review_score ? (reviewSummary.review_score / 2).toFixed(1) :
                          (reviews.length > 0
                            ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                            : "N/A"
                          )
                        }
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avgRating = reviewSummary.review_score ? reviewSummary.review_score / 2 :
                            (reviews.length > 0
                              ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                              : 0
                            )
                          return (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= avgRating ? "text-yellow-500 fill-current" : "text-muted-foreground"}`}
                            />
                          )
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">Steam Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">
                        {reviewSummary.total_positive && reviewSummary.total_reviews
                          ? Math.round((reviewSummary.total_positive / reviewSummary.total_reviews) * 100)
                          : reviews.length > 0
                            ? Math.round((reviews.filter(r => r.recommended).length / reviews.length) * 100)
                            : 0
                        }%
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="text-sm text-muted-foreground">Recommended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {reviewSummary.total_reviews?.toLocaleString() || reviews.length.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </MotionEffect>

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-9 w-48 mb-4" />
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-48" />
                  <div className="flex-1"></div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Review Cards Skeleton */}
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Skeleton key={star} className="h-4 w-4" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>

                    {/* Review Footer */}
                    <Separator className="my-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-6">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-lg text-red-500">Error loading reviews</div>
              <div className="text-sm text-muted-foreground mt-2">{error}</div>
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-muted-foreground">No reviews found</div>
            </div>
          ) : null}

          {!loading && sortedReviews.map((review, index) => (
            <MotionEffect
              key={review.id}
              slide={{
                direction: 'up',
              }}
              fade
              zoom
              inView
              delay={0.1 * index}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={review.author.avatar || "/placeholder.svg"} referrerPolicy="no-referrer" />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {review.author.profileUrl ? (
                            <a
                              href={review.author.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              {review.author.name}
                            </a>
                          ) : (
                            <h4 className="font-semibold text-foreground">{review.author.name}</h4>
                          )}
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                          {review.earlyAccess && (
                            <Badge variant="outline" className="text-xs">
                              Early Access
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatPlaytime(review.author.playtime)} played</span>
                          </div>
                          <div>{review.author.reviewCount} reviews</div>
                          {review.author.gamesOwned && review.author.gamesOwned > 0 && (
                            <div>{review.author.gamesOwned} games owned</div>
                          )}
                          {review.author.countryCode && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs">🌍</span>
                              <span>{review.author.countryCode}</span>
                            </div>
                          )}
                          <div>{formatDate(review.timestamp)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 sm:text-right">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
                              }`}
                          />
                        ))}
                      </div>
                      <div className={`text-sm font-medium whitespace-nowrap ${review.recommended ? "text-green-500" : "text-red-500"}`}>
                        {review.recommended ? "Recommended" : "Not Recommended"}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-foreground mb-2">{review.title}</h5>
                    <StyledText
                      variant="review"
                      className="leading-relaxed"
                      maxLength={400}
                      expandable={true}
                    >
                      {review.content}
                    </StyledText>
                  </div>

                  {/* Review Awards */}
                  {review.awards && review.awards.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Awards:</span>
                        {review.awards.map((award, index) => (
                          <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                            <span>{award.description}</span>
                            <span className="text-muted-foreground">({award.votes})</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Review Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 text-sm">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span>{review.helpful} helpful</span>
                      </div>
                      {review.funny > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <span>😄</span>
                          <span>{review.funny} funny</span>
                        </div>
                      )}
                      {review.unique_id && (
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2">
                          <Link href={`/reviews/${review.unique_id}`}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionEffect>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          {hasMore ? (
            <Button
              variant="outline"
              size="lg"
              disabled={loadingMore}
              onClick={loadMoreReviews}
            >
              {loadingMore ? "Loading..." : "Load More Reviews"}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              No more reviews to load
            </div>
          )}
        </div>
      </div>
    </section>
  )
}