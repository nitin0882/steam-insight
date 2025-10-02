"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StyledText } from "@/components/ui/styled-text"
import { ArrowLeft, Award, Check, Clock, ExternalLink, Share2, Star, ThumbsUp, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ReviewWithId {
    unique_id: string
    recommendationid: string
    author: {
        steamid: string
        num_games_owned: number
        num_reviews: number
        playtime_forever: number
        playtime_last_two_weeks: number
        playtime_at_review: number
        last_played: number
        personaname?: string
        avatar?: string
        avatarmedium?: string
        avatarfull?: string
        profileurl?: string
        realname?: string
        countrycode?: string
    }
    language: string
    review: string
    timestamp_created: number
    timestamp_updated: number
    voted_up: boolean
    votes_up: number
    votes_funny: number
    weighted_vote_score: string
    comment_count: number
    steam_purchase: boolean
    received_for_free: boolean
    written_during_early_access: boolean
    review_awards?: Array<{
        award_type: number
        votes: number
        description: string
    }>
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

interface ReviewPageClientProps {
    initialReview: ReviewWithId
    reviewId: string
}

export default function ReviewPageClient({ initialReview, reviewId }: ReviewPageClientProps) {
    const review = initialReview
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)

    const formatPlaytime = (minutes: number) => {
        const hours = Math.round(minutes / 60)
        if (hours < 1) return "< 1 hour"
        if (hours >= 1000) return `${Math.round(hours / 100) / 10}k hours`
        return `${hours.toLocaleString()} hours`
    }

    const formatReviewDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getQualityLabel = (score: number) => {
        if (score >= 80) return "Excellent"
        if (score >= 60) return "Great"
        if (score >= 40) return "Good"
        return "Fair"
    }

    const getQualityBadgeColor = (score: number) => {
        if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
        if (score >= 60) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        if (score >= 40) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }

    const handleShare = async () => {
        try {
            // Always copy to clipboard
            await navigator.clipboard.writeText(window.location.href)
            setCopiedToClipboard(true)

            // Reset the copied state after 2 seconds
            setTimeout(() => setCopiedToClipboard(false), 2000)
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            // Fallback to navigator.share if clipboard fails
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Review of ${review?.game.name}`,
                        text: `Check out this Steam review of ${review?.game.name}`,
                        url: window.location.href
                    })
                } catch (shareError) {
                    console.error('Failed to share:', shareError)
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <MotionEffect
                    slide={{
                        direction: 'up',
                    }}
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

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">Steam Review</h1>
                                <p className="text-muted-foreground">
                                    Review ID: <code className="text-sm bg-muted px-2 py-1 rounded">{reviewId}</code>
                                </p>
                            </div>

                            <Button onClick={handleShare} variant="outline" size="sm">
                                {copiedToClipboard ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Share
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </MotionEffect>

                {/* Review Card */}
                <MotionEffect
                    slide={{
                        direction: 'up',
                    }}
                    fade
                    zoom
                    inView
                    delay={0.1}
                >
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                {/* Author Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <Avatar className="w-16 h-16 flex-shrink-0">
                                        {review.author.avatar ? (
                                            <Image
                                                width={64}
                                                height={64}
                                                src={review.author.avatar}
                                                alt={review.author.personaname || "Steam User"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <User className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {review.author.steamid ? (
                                                <Link
                                                    href={`/reviews/user/${review.author.steamid}`}
                                                    className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
                                                >
                                                    {review.author.personaname || "Steam User"}
                                                </Link>
                                            ) : (
                                                <h3 className="text-xl font-semibold text-foreground">
                                                    {review.author.personaname || "Steam User"}
                                                </h3>
                                            )}
                                            {review.steam_purchase && (
                                                <Badge variant="secondary">Verified Purchase</Badge>
                                            )}
                                            {review.author.countrycode && (
                                                <Badge variant="outline" className="text-xs">
                                                    {review.author.countrycode}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatPlaytime(review.author.playtime_forever)} total</span>
                                            </div>
                                            <div>
                                                <span>{formatPlaytime(review.author.playtime_at_review)} at review</span>
                                            </div>
                                            <div>
                                                <span>{review.author.num_reviews} reviews</span>
                                            </div>
                                            <div>
                                                <span>{review.author.num_games_owned} games owned</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quality and Recommendation */}
                                <div className="flex lg:flex-col items-center lg:items-end gap-3">
                                    <Badge
                                        variant="outline"
                                        className={`text-sm ${getQualityBadgeColor(review.quality_score)}`}
                                    >
                                        {getQualityLabel(review.quality_score)} Quality
                                    </Badge>

                                    <div className={`flex items-center gap-2 text-lg font-semibold ${review.voted_up ? "text-green-500" : "text-red-500"
                                        }`}>
                                        {review.voted_up ? (
                                            <ThumbsUp className="w-5 h-5" />
                                        ) : (
                                            <ThumbsUp className="w-5 h-5 rotate-180" />
                                        )}
                                        <span>{review.voted_up ? "Recommended" : "Not Recommended"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Game Info */}
                            <Link
                                href={`/game/${review.game.appid}`}
                                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                                <Image
                                    width={80}
                                    height={80}
                                    src={review.game.header_image || "/placeholder.svg"}
                                    alt={review.game.name}
                                    className="w-20 h-20 object-cover rounded"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=80&width=80&text=" + encodeURIComponent(review.game.name)
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {review.game.name}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {review.game.genres.slice(0, 4).map((genre) => (
                                            <Badge key={genre.id} variant="secondary" className="text-xs">
                                                {genre.description}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        View Game Details <ExternalLink className="w-3 h-3 inline ml-1" />
                                    </p>
                                </div>
                            </Link>

                            {/* Review Date */}
                            <div className="text-sm text-muted-foreground">
                                <span>Reviewed on {formatReviewDate(review.timestamp_created)}</span>
                                {review.timestamp_updated !== review.timestamp_created && (
                                    <span className="ml-2">(Updated {formatReviewDate(review.timestamp_updated)})</span>
                                )}
                            </div>

                            {/* Review Content */}
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <StyledText variant="review" className="text-base leading-relaxed">
                                    {review.review}
                                </StyledText>
                            </div>

                            {/* Review Awards */}
                            {review.review_awards && review.review_awards.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium text-foreground mb-2">Community Awards</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {review.review_awards.map((award, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                <Award className="w-3 h-3" />
                                                <span>{award.description}</span>
                                                <span className="text-muted-foreground">({award.votes})</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Stats and Actions */}
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
                            </div>
                        </CardContent>
                    </Card>
                </MotionEffect>

                {/* Related Actions */}
                <MotionEffect
                    slide={{
                        direction: 'up',
                    }}
                    fade
                    zoom
                    inView
                    delay={0.2}
                >
                    <div className="max-w-4xl mx-auto mt-8 text-center">
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild variant="outline">
                                <Link href={`/game/${review.game.appid}`}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Game
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/reviews">
                                    Browse All Reviews
                                </Link>
                            </Button>
                        </div>
                    </div>
                </MotionEffect>
            </div>
        </div>
    )
}