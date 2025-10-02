"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StyledText } from "@/components/ui/styled-text"
import { useUserReviews } from "@/hooks/use-user-reviews"
import { AlertCircle, ArrowLeft, Award, Clock, ExternalLink, Star, ThumbsUp, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface UserReviewsClientProps {
    steamId: string
    page: number
}

export default function UserReviewsClient({ steamId, page }: UserReviewsClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const { reviews, isLoading, error, hasMore, total } = useUserReviews(steamId, 24, page)

    // Custom loadMore that updates the URL
    const loadMore = () => {
        if (hasMore) {
            const nextPage = page + 1
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set("page", nextPage.toString())
            router.push(`?${newSearchParams.toString()}`)
        }
    }

    // Get user info from the first review (all reviews should have the same author)
    const userInfo = reviews.length > 0 ? reviews[0].author : null

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
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load User Reviews</h3>
                        <p className="text-muted-foreground mb-4">
                            {error}
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/reviews">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Reviews
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                        >
                            <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                <User className="mr-2 h-4 w-4" />
                                User Reviews
                            </div>
                        </MotionEffect>

                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                            delay={0.15}
                        >
                            <div className="mb-6 flex flex-col items-center gap-4">
                                {userInfo?.avatar && (
                                    <Avatar className="w-20 h-20">
                                        <Image
                                            width={80}
                                            height={80}
                                            src={userInfo.avatar}
                                            alt={userInfo.personaname || "Steam User"}
                                            className="w-full h-full object-cover"
                                        />
                                    </Avatar>
                                )}
                                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                    <span className="text-balance">
                                        {userInfo?.personaname || "Steam User"}
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                        Reviews
                                    </span>
                                </h1>
                            </div>
                        </MotionEffect>

                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                            delay={0.3}
                        >
                            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
                                All reviews written by Steam user <code className="text-sm bg-muted px-2 py-1 rounded">{steamId}</code>
                                {userInfo?.profileurl && (
                                    <span className="block mt-2">
                                        <a
                                            href={userInfo.profileurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline inline-flex items-center"
                                        >
                                            View Steam Profile <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </span>
                                )}
                                <span className="block mt-2 text-sm text-muted-foreground/80">
                                    Note: Due to Steam API limitations, some reviews may not be displayed here.
                                    Check the user&apos;s Steam profile for their complete review history.
                                </span>
                            </p>
                        </MotionEffect>

                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                            delay={0.45}
                        >
                            <div className="flex flex-wrap justify-center gap-4">
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <ThumbsUp className="h-4 w-4 mr-2 text-primary" />
                                    {total} Reviews Found
                                </Badge>
                                {userInfo?.num_games_owned && (
                                    <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                        <Star className="h-4 w-4 mr-2 text-primary" />
                                        {userInfo.num_games_owned} Games Owned
                                    </Badge>
                                )}
                                {userInfo?.loccountrycode && (
                                    <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                        <User className="h-4 w-4 mr-2 text-primary" />
                                        {userInfo.loccountrycode}
                                    </Badge>
                                )}
                            </div>
                        </MotionEffect>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="container mx-auto px-4 py-8">
                <MotionEffect
                    slide={{ direction: 'up' }}
                    fade
                    zoom
                    inView
                >
                    <div className="mb-8">
                        <Button asChild variant="ghost" className="mb-4">
                            <Link href="/reviews" className="flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Reviews
                            </Link>
                        </Button>
                    </div>
                </MotionEffect>

                {/* Reviews Grid */}
                <MotionEffect
                    slide={{ direction: 'up' }}
                    fade
                    zoom
                    inView
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {isLoading && reviews.length === 0
                            ? // Initial loading skeletons
                            Array.from({ length: 6 }).map((_, i) => (
                                <MotionEffect
                                    key={`skeleton-${i}`}
                                    slide={{ direction: 'up' }}
                                    fade
                                    zoom
                                    inView
                                    delay={i * 0.1}
                                >
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
                                </MotionEffect>
                            ))
                            : // Actual reviews with smooth loading animations
                            reviews.map((review, index) => (
                                <MotionEffect
                                    key={`${review.game.appid}-${review.recommendationid}`}
                                    slide={{ direction: 'up' }}
                                    fade
                                    zoom
                                    inView
                                    delay={0.1 + index * 0.05}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                >
                                    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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

                        {/* Loading more reviews animation */}
                        {isLoading && reviews.length > 0 && (
                            <>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <MotionEffect
                                        key={`loading-${i}`}
                                        slide={{ direction: 'up' }}
                                        fade={{ initialOpacity: 0, opacity: 0.7 }}
                                        zoom={{ initialScale: 0.8, scale: 1 }}
                                        inView
                                        delay={i * 0.1}
                                        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                                    >
                                        <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm animate-pulse">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                                                    <div className="flex-1">
                                                        <div className="h-4 w-32 bg-muted rounded mb-2 animate-pulse" />
                                                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                    </div>
                                                    <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-16 rounded bg-muted animate-pulse" />
                                                    <div className="flex-1">
                                                        <div className="h-5 w-48 bg-muted rounded mb-1 animate-pulse" />
                                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                                    </div>
                                                </div>
                                                <div className="h-20 w-full bg-muted rounded animate-pulse" />
                                                <div className="flex items-center justify-between">
                                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                                    <div className="flex gap-2">
                                                        <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                                                        <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </MotionEffect>
                                ))}
                            </>
                        )}
                    </div>
                </MotionEffect>

                {/* Load More */}
                {!isLoading && hasMore && (
                    <div className="text-center mt-12">
                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                        >
                            <Button variant="outline" size="lg" className="px-8 bg-transparent hover:bg-primary/10" onClick={loadMore}>
                                Load More Reviews
                            </Button>
                        </MotionEffect>
                    </div>
                )}

                {/* Loading more indicator */}
                {isLoading && reviews.length > 0 && (
                    <div className="text-center mt-12">
                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                        >
                            <div className="flex items-center justify-center gap-3 text-muted-foreground">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                                <span>Loading more reviews...</span>
                            </div>
                        </MotionEffect>
                    </div>
                )}

                {/* No reviews found */}
                {!isLoading && reviews.length === 0 && !error && (
                    <div className="text-center py-16">
                        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Reviews Found</h3>
                        <p className="text-muted-foreground mb-4">
                            This user hasn&apos;t written any reviews yet, or their reviews are not publicly visible.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/reviews">
                                Browse All Reviews
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    )
}