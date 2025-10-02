"use client"
import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StyledText } from "@/components/ui/styled-text"
import { useBestReviews } from "@/hooks/use-best-reviews"
import { AlertCircle, Award, Clock, ExternalLink, Star, ThumbsUp, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ReviewsGrid() {
    const { reviews, isLoading, error, refetch, total } = useBestReviews(24)

    const formatError = (err: unknown): string => {
        if (err instanceof Error) return err.message
        return String(err)
    }

    const formatPlaytime = (minutes: number) => {
        const hours = Math.round(minutes / 60)
        if (hours < 1) return "< 1 hour"
        if (hours >= 1000) return `${Math.round(hours / 100) / 10}k hours`
        return `${hours.toLocaleString()} hours`
    }

    const formatReviewDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffDays < 1) return "Today"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
        return `${Math.floor(diffDays / 365)} years ago`
    }

    const truncateReview = (text: string, maxLength: number = 300) => {
        if (text.length <= maxLength) return text
        const truncated = text.substring(0, maxLength)
        const lastSpace = truncated.lastIndexOf(' ')
        return truncated.substring(0, lastSpace) + "..."
    }

    const getQualityBadgeColor = (score: number) => {
        if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
        if (score >= 60) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        if (score >= 40) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }

    const getQualityLabel = (score: number) => {
        if (score >= 80) return "Excellent"
        if (score >= 60) return "Great"
        if (score >= 40) return "Good"
        return "Fair"
    }

    if (error) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Reviews</h3>
                        <p className="text-muted-foreground mb-4">
                            {error ? formatError(error) : "Something went wrong while fetching reviews."}
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">


                {/* Reviews Grid */}
                <MotionEffect
                    slide={{
                        direction: 'up',
                    }}
                    fade
                    zoom
                    inView
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {isLoading
                            ? // Loading skeletons
                            Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden border-border/50 bg-card/50">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-32 mb-2" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-16 h-16 rounded" />
                                            <div className="flex-1">
                                                <Skeleton className="h-5 w-48 mb-1" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-20 w-full" />
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-6 w-12" />
                                                <Skeleton className="h-6 w-12" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                            : // Actual reviews
                            reviews.map((review, index) => (
                                <MotionEffect
                                    key={`${review.game.appid}-${review.recommendationid}`}
                                    slide={{
                                        direction: 'up',
                                    }}
                                    fade
                                    zoom
                                    inView
                                    delay={0.1 + index * 0.05}
                                >
                                    <Card
                                        className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Avatar className="w-12 h-12 flex-shrink-0">
                                                        {review.author.avatar ? (
                                                            <Image
                                                                width={48}
                                                                height={48}
                                                                src={review.author.avatar}
                                                                alt={review.author.personaname || "Steam User"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                                <User className="w-6 h-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-sm text-foreground">
                                                                {review.author.personaname || "Steam User"}
                                                            </h4>
                                                            {review.steam_purchase && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Verified
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{formatPlaytime(review.author.playtime_forever)} played</span>
                                                            </div>
                                                            <span>{review.author.num_reviews} reviews</span>
                                                            {review.author.num_games_owned && review.author.num_games_owned > 0 && (
                                                                <span>{review.author.num_games_owned} games owned</span>
                                                            )}
                                                            <span>{formatReviewDate(review.timestamp_created)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={getQualityBadgeColor(review.quality_score)}
                                                    >
                                                        {getQualityLabel(review.quality_score)}
                                                    </Badge>
                                                    <div className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap ${review.voted_up ? "text-green-500" : "text-red-500"}`}>
                                                        {review.voted_up ? (
                                                            <ThumbsUp className="w-4 h-4" />
                                                        ) : (
                                                            <ThumbsUp className="w-4 h-4 rotate-180" />
                                                        )}
                                                        <span className="hidden sm:inline">
                                                            {review.voted_up ? "Recommended" : "Not Recommended"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Game Info */}
                                            <Link href={`/game/${review.game.appid}`} className="flex items-center gap-3 group/game hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors">
                                                <Image
                                                    width={64}
                                                    height={64}
                                                    src={review.game.header_image || "/placeholder.svg"}
                                                    alt={review.game.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.src = "/placeholder.svg?height=64&width=64&text=" + encodeURIComponent(review.game.name)
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-medium text-foreground group-hover/game:text-primary transition-colors truncate">
                                                        {review.game.name}
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {review.game.genres.slice(0, 3).map((genre) => (
                                                            <Badge key={genre.id} variant="secondary" className="text-xs">
                                                                {genre.description}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Review Content */}
                                            <div className="space-y-2">
                                                <StyledText
                                                    variant="review"
                                                    className="text-sm leading-relaxed"
                                                    maxLength={300}
                                                    expandable={true}
                                                >
                                                    {review.review}
                                                </StyledText>


                                            </div>

                                            {/* Review Awards */}
                                            {review.review_awards && review.review_awards.length > 0 && (
                                                <div className="mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs text-muted-foreground">Awards:</span>
                                                        {review.review_awards.slice(0, 3).map((award, awardIndex) => (
                                                            <Badge key={awardIndex} variant="secondary" className="text-xs flex items-center gap-1">
                                                                <Award className="w-3 h-3" />
                                                                <span className="text-muted-foreground">({award.votes})</span>
                                                            </Badge>
                                                        ))}
                                                        {review.review_awards.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{review.review_awards.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Review Actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <ThumbsUp className="w-4 h-4 text-green-500" />
                                                        <span>{review.votes_up} helpful</span>
                                                    </div>
                                                    {review.votes_funny > 0 && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <span>😄</span>
                                                            <span>{review.votes_funny} funny</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                        <span>{Math.round(parseFloat(review.weighted_vote_score) * 100)} score</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-start sm:self-auto">
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
                </MotionEffect>

                {/* Load More */}
                {!isLoading && reviews.length > 0 && (
                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={() => refetch()}>
                            Refresh Reviews
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}