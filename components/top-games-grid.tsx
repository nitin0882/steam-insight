"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTopRatedGames } from "@/hooks/use-top-rated-games"
import { Award, ExternalLink, Eye, Star, TrendingUp, Trophy, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function TopGamesGrid() {
    const { games, isLoading, error } = useTopRatedGames()
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

    const handleImageError = (gameId: number) => {
        setImageErrors(prev => ({ ...prev, [gameId]: true }))
    }

    const formatRating = (rating: number | null) => {
        if (rating === null) return "Not Released Yet"
        return rating > 0 ? rating.toFixed(1) : "N/A"
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden bg-card/50 border-border/50">
                        <Skeleton className="w-full h-48" />
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-3" />
                            <div className="flex gap-2 mb-3">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Games</h3>
                    <p className="text-muted-foreground">
                        {error instanceof Error ? error.message : String(error)}
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (!games || games.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="p-6 bg-card/50 border border-border/50 rounded-lg max-w-md mx-auto">
                    <h3 className="text-lg font-semibold mb-2">No Games Found</h3>
                    <p className="text-muted-foreground">No top-rated games are available at the moment.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Featured Top Game */}
            {games[0] && (
                <MotionEffect
                    slide={{ direction: 'up' }}
                    fade
                    zoom
                    inView
                >
                    <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:shadow-lg transition-all duration-300">
                        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                            <div className="relative aspect-video rounded-xl overflow-hidden">
                                <Image
                                    src={imageErrors[games[0].id] ? "/placeholder.jpg" : games[0].image}
                                    alt={games[0].name}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    onError={() => handleImageError(games[0].id)}
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
                                        <Trophy className="h-4 w-4 mr-1" />
                                        #1 Top Rated
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-3 text-foreground">
                                        {games[0].name}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                        {games[0].description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="font-semibold">{formatRating(games[0].rating)}</span>
                                        <span className="text-xs text-muted-foreground">Rating</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">{games[0].reviewCount}</span>
                                        <span className="text-xs text-muted-foreground">Reviews</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                        <Award className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-medium">Award Winner</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button asChild className="bg-primary hover:bg-primary/90">
                                        <Link href={`/game/${games[0].id}`}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a
                                            href={`https://store.steampowered.com/app/${games[0].id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Steam Store
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </MotionEffect>
            )}

            {/* Top Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.slice(1).map((game, index) => (
                    <MotionEffect
                        key={game.id}
                        slide={{ direction: 'up' }}
                        fade
                        zoom
                        inView
                        delay={index * 0.05}
                    >
                        <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] flex flex-col h-96">
                            <div className="relative overflow-hidden h-48 flex-shrink-0">
                                <Image
                                    src={imageErrors[game.id] ? "/placeholder.jpg" : game.image}
                                    alt={game.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={() => handleImageError(game.id)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-3 left-3">
                                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs font-medium border border-border/50">
                                        #{index + 2}
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-4 flex-1">
                                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {game.name}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                    {game.description}
                                </p>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-primary text-primary" />
                                        <span className="text-sm font-medium text-foreground">{formatRating(game.rating)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-primary" />
                                        <span className="text-sm text-foreground">{game.reviewCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-primary" />
                                        <span className="text-xs text-muted-foreground">Top Rated</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {game.tags.slice(0, 2).map((tag, tagIndex) => (
                                        <Badge key={tagIndex} variant="outline" className="text-xs border-border/50">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <div className="flex gap-2 w-full">
                                    <Button asChild size="sm" className="flex-1">
                                        <Link href={`/game/${game.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" asChild>
                                        <a
                                            href={`https://store.steampowered.com/app/${game.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </MotionEffect>
                ))}
            </div>
        </div>
    )
}