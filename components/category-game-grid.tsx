"use client"
import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { useGamesByCategory, useSearchInCategory } from "@/hooks/use-steam-games"
import { ExternalLink, Search, Star, TrendingUp, Users, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

interface Game {
    id: number
    name: string
    type?: string
    image: string
    rating: number | null
    reviewCount: number
    price: string
    tags: string[]
    releaseDate: string
    description: string
    movies?: Array<{
        id: number
        name: string
        thumbnail: string
        webm?: {
            480: string
            max: string
        }
        mp4?: {
            480: string
            max: string
        }
        highlight?: boolean
    }>
}

interface CategoryGameGridProps {
    category: string
}

export function CategoryGameGrid({ category }: CategoryGameGridProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchMode, setIsSearchMode] = useState(false)
    const previousGameCountRef = useRef(0)
    const [animatingNewGames, setAnimatingNewGames] = useState(false)
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    // Main category games with pagination support
    const { games: categoryGames, isLoading: categoryLoading, isLoadingMore, isRefreshing, error: categoryError, hasMore, loadMore, refetch: refetchCategory } = useGamesByCategory(category, 20)

    // Search within category
    const { games: searchGames, isLoading: searchLoading, error: searchError } = useSearchInCategory(category, debouncedSearchQuery, 20)

    // Determine which data to show
    const games = useMemo(() => {
        if (isSearchMode && debouncedSearchQuery.trim()) {
            return searchGames
        }
        return categoryGames
    }, [isSearchMode, debouncedSearchQuery, searchGames, categoryGames])

    const isLoading = useMemo(() => {
        if (isSearchMode && debouncedSearchQuery.trim()) {
            return searchLoading
        }
        return categoryLoading || isRefreshing
    }, [isSearchMode, debouncedSearchQuery, searchLoading, categoryLoading, isRefreshing])

    const error = useMemo(() => {
        if (isSearchMode && debouncedSearchQuery.trim()) {
            return searchError
        }
        return categoryError
    }, [isSearchMode, debouncedSearchQuery, searchError, categoryError])

    // Update search mode based on query
    useEffect(() => {
        setIsSearchMode(debouncedSearchQuery.trim().length > 0)
    }, [debouncedSearchQuery])

    // Track when new games are loaded for animation
    useEffect(() => {
        const prevCount = previousGameCountRef.current
        if (games.length > prevCount && prevCount > 0) {
            setAnimatingNewGames(true)
            const timer = setTimeout(() => setAnimatingNewGames(false), 1000)
            return () => clearTimeout(timer)
        }
        previousGameCountRef.current = games.length
    }, [games])

    const handleClearSearch = () => {
        setSearchQuery("")
        setIsSearchMode(false)
    }

    const handleLoadMore = () => {
        if (hasMore && !isLoadingMore) {
            loadMore()
        }
    }

    const formatRating = (rating: number | null) => {
        if (rating === null) return "Not Released Yet"
        return rating > 0 ? rating.toFixed(1) : "N/A"
    }

    // Featured Game Component with video hover functionality
    const FeaturedGame = ({ game }: { game: Game }) => {
        const [isVideoPlaying, setIsVideoPlaying] = useState(false)
        const videoRef = useRef<HTMLVideoElement>(null)

        // Get the best video URL (prefer MP4 over WebM, prefer max quality)
        const getVideoUrl = () => {
            if (!game.movies || game.movies.length === 0) return null

            // Find the first highlight video or just the first video
            const video = game.movies.find(m => m.highlight) || game.movies[0]
            if (!video) return null

            // Prefer MP4 over WebM, and max quality over 480p
            return video.mp4?.max || video.mp4?.['480'] || video.webm?.max || video.webm?.['480']
        }

        const videoUrl = getVideoUrl()

        const handleMouseEnter = () => {
            if (videoUrl && videoRef.current) {
                setIsVideoPlaying(true)
                videoRef.current.play().catch(() => {
                    // Autoplay might be blocked, that's okay
                    setIsVideoPlaying(false)
                })
            }
        }

        const handleMouseLeave = () => {
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
                setIsVideoPlaying(false)
            }
        }

        const formatReviewCount = (count: number) => {
            if (count >= 1000000) {
                return `${(count / 1000000).toFixed(1)}M`
            }
            if (count >= 1000) {
                return `${(count / 1000).toFixed(1)}k`
            }
            return count.toString()
        }

        return (
            <MotionEffect
                slide={{ direction: 'up' }}
                fade
                zoom
                inView={false}
                delay={0.2}
            >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 p-6 mb-12 hover:shadow-lg transition-all duration-300">
                    <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                        <div className="relative aspect-video rounded-xl overflow-hidden group"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}>
                            <Image
                                width={480}
                                height={270}
                                src={game.image || "/placeholder.svg"}
                                alt={game.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onLoad={() => { }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=270&width=480&text=" + encodeURIComponent(game.name)
                                }}
                                loading="eager"
                                priority
                            />

                            {/* Video overlay */}
                            {videoUrl && (
                                <video
                                    ref={videoRef}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                                    src={videoUrl}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    onError={() => setIsVideoPlaying(false)}
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-3 text-foreground">
                                    {game.name}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                    {game.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span className="font-semibold">{formatRating(game.rating)}</span>
                                    <span className="text-xs text-muted-foreground">Rating</span>
                                </div>
                                <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">{formatReviewCount(game.reviewCount)}</span>
                                    <span className="text-xs text-muted-foreground">Reviews</span>
                                </div>
                                <div className="flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg border border-border/50">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button asChild className="bg-primary hover:bg-primary/90">
                                    <Link href={`/game/${game.id}`}>
                                        View Reviews
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a
                                        href={`https://store.steampowered.com/app/${game.id}`}
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
        )
    }

    // GameCard component with video hover functionality
    const GameCard = ({ game, index, isSearchMode }: { game: Game; index: number; isSearchMode: boolean }) => {
        const [isVideoPlaying, setIsVideoPlaying] = useState(false)
        const videoRef = useRef<HTMLVideoElement>(null)
        const [isImageLoaded, setIsImageLoaded] = useState(false)

        const isFeatured = index === 0 && !isSearchMode
        const displayIndex = isFeatured ? index + 1 : index
        const isNewGame = animatingNewGames && index >= previousGameCountRef.current

        // Get the best video URL (prefer MP4 over WebM, prefer max quality)
        const getVideoUrl = () => {
            if (!game.movies || game.movies.length === 0) return null

            // Find the first highlight video or just the first video
            const video = game.movies.find(m => m.highlight) || game.movies[0]
            if (!video) return null

            // Prefer MP4 over WebM, and max quality over 480p
            return video.mp4?.max || video.mp4?.['480'] || video.webm?.max || video.webm?.['480']
        }

        const videoUrl = getVideoUrl()

        const handleMouseEnter = () => {
            if (videoUrl && videoRef.current) {
                setIsVideoPlaying(true)
                videoRef.current.play().catch(() => {
                    // Autoplay might be blocked, that's okay
                    setIsVideoPlaying(false)
                })
            }
        }

        const handleMouseLeave = () => {
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
                setIsVideoPlaying(false)
            }
        }

        const handleImageLoad = () => {
            setIsImageLoaded(true)
        }

        const formatReviewCount = (count: number) => {
            if (count >= 1000000) {
                return `${(count / 1000000).toFixed(1)}M`
            }
            if (count >= 1000) {
                return `${(count / 1000).toFixed(1)}k`
            }
            return count.toString()
        }

        return (
            <MotionEffect
                slide={{
                    direction: isNewGame ? 'up' : 'up',
                    offset: isNewGame ? 50 : 100
                }}
                fade
                zoom={isNewGame ? { initialScale: 0.8, scale: 1 } : true}
                inView={false}
                delay={isNewGame ? 0.05 + (index - previousGameCountRef.current) * 0.1 : 0.1 + displayIndex * 0.03}
                transition={isNewGame ? { type: 'spring', stiffness: 300, damping: 25 } : { type: 'spring', stiffness: 200, damping: 20 }}
            >
                <Link href={`/game/${game.id}`} className="block">
                    <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] flex flex-col h-96 cursor-pointer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        <div className="relative overflow-hidden h-48 flex-shrink-0">
                            {/* Image skeleton that shows until image loads */}
                            {!isImageLoaded && (
                                <div className="absolute inset-0 z-10">
                                    <Skeleton className="w-full h-48 bg-muted/30 animate-pulse" />
                                </div>
                            )}

                            {/* Image with reveal animation */}
                            <div className={`transition-all duration-500 ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                                <Image
                                    width={384}
                                    height={192}
                                    src={game.image || "/placeholder.svg"}
                                    alt={game.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onLoad={() => handleImageLoad()}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=192&width=384&text=" + encodeURIComponent(game.name)
                                        handleImageLoad() // Mark as loaded even on error
                                    }}
                                    loading={displayIndex < 6 ? "eager" : "lazy"} // Eager load first 6 images
                                    priority={displayIndex < 3} // High priority for first 3 images
                                />
                            </div>

                            {/* Video overlay */}
                            {videoUrl && (
                                <video
                                    ref={videoRef}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
                                    src={videoUrl}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    onError={() => setIsVideoPlaying(false)}
                                />
                            )}

                            <div className="absolute top-3 right-3 z-20">
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                    {game.price}
                                </Badge>
                            </div>

                        </div>

                        <CardContent className="p-4 flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {game.name}
                                </h3>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                    <span className="text-sm font-medium text-foreground">{formatRating(game.rating)}</span>
                                </div>
                                {game.reviewCount > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-primary" />
                                        <span className="text-sm text-foreground">{formatReviewCount(game.reviewCount)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {game.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs border-border/50">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                            <div className="flex gap-2 w-full">
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/game/${game.id}`}>
                                        View Reviews
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
                </Link>
            </MotionEffect>
        )
    }

    if (error) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X className="w-6 h-6 text-destructive" />
                                </div>
                                <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Games</h3>
                                <p className="text-muted-foreground">
                                    {error ? (error instanceof Error ? error.message : String(error)) : "Something went wrong while fetching games."}
                                </p>
                            </div>
                            <Button onClick={refetchCategory} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Section with Hero Styling */}
                <MotionEffect
                    slide={{ direction: 'up' }}
                    fade
                    zoom
                    inView={false}
                    delay={0.1}
                >
                    <div className="relative mb-12">
                        {/* Background elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl" />
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] rounded-2xl" />

                        <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-lg">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    {isSearchMode ? 'Search Results' : 'Explore Games'}
                                </h2>
                                <p className="text-muted-foreground">
                                    {isSearchMode
                                        ? `Find specific games within the ${category} category`
                                        : `Discover amazing ${category} games curated for you`
                                    }
                                </p>
                            </div>

                            <div className="relative max-w-2xl mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={`Search ${category} games...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-12 py-4 text-lg bg-background/80 backdrop-blur-sm border-border/50 focus:bg-background/90 transition-all duration-300 rounded-xl"
                                    />
                                    {searchQuery && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted/50 rounded-full"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {isSearchMode && (
                                    <p className="text-sm text-muted-foreground mt-3 text-center">
                                        {searchQuery.trim() ? `Searching for "${searchQuery}" in ${category} games...` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </MotionEffect>

                {/* Results Info */}
                {!isLoading && games.length > 0 && (
                    <MotionEffect
                        slide={{ direction: 'up' }}
                        fade
                        zoom
                        inView={false}
                        delay={0.15}
                    >
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
                                <Badge variant="secondary" className="px-3 py-1">
                                    {games.length} Games
                                </Badge>
                                <span className="text-muted-foreground text-sm">
                                    {isSearchMode && searchQuery.trim()
                                        ? `Found in ${category} category`
                                        : `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`
                                    }
                                </span>
                            </div>
                        </div>
                    </MotionEffect>
                )}

                {/* Featured Game Section */}
                {!isLoading && games.length > 0 && games[0] && !isSearchMode && (
                    <FeaturedGame game={games[0]} />
                )}

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading
                        ? // Enhanced Loading skeletons with motion effects
                        Array.from({ length: 12 }).map((_, i) => (
                            <MotionEffect
                                key={i}
                                slide={{
                                    direction: 'up',
                                }}
                                fade
                                zoom
                                inView={false}
                                delay={0.1 + i * 0.03}
                            >
                                <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                                    <div className="relative">
                                        <Skeleton className="w-full h-48" />
                                        <div className="absolute top-3 right-3">
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-6 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-4 w-2/3 mb-3" />
                                        <div className="flex items-center gap-4 mb-3">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="flex gap-1 mb-3">
                                            <Skeleton className="h-6 w-12" />
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-6 w-14" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Skeleton className="h-10 w-full" />
                                    </CardFooter>
                                </Card>
                            </MotionEffect>
                        ))
                        : // Actual games with enhanced styling
                        games.filter((game: Game) => game.id && game.id !== 0).map((game: Game, index: number) => (
                            <GameCard key={game.id} game={game} index={index} isSearchMode={isSearchMode} />
                        ))}
                </div>

                {/* Load More */}
                {!isLoading && games.length > 0 && (
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView={false}
                        delay={0.3}
                    >
                        <div className="text-center mt-12 space-y-4">
                            {hasMore ? (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 bg-transparent hover:bg-card/50 backdrop-blur-sm border-border/50"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                            Loading More Games...
                                        </>
                                    ) : (
                                        'Load More Games'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 bg-transparent hover:bg-card/50 backdrop-blur-sm border-border/50"
                                    onClick={refetchCategory}
                                >
                                    Refresh Games
                                </Button>
                            )}

                            <p className="text-sm text-muted-foreground">
                                {hasMore
                                    ? `Showing ${games.length} games. More available in this category.`
                                    : `Showing all ${games.length} games in this category.`
                                }
                            </p>
                        </div>
                    </MotionEffect>
                )}

                {/* No games found */}
                {!isLoading && games.length === 0 && !isRefreshing && (
                    <MotionEffect
                        slide={{ direction: 'up' }}
                        fade
                        zoom
                        inView={false}
                        delay={0.2}
                    >
                        <div className="text-center py-16">
                            <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl max-w-md mx-auto">
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {isSearchMode ? 'No search results' : 'No games found'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {isSearchMode
                                            ? `We couldn't find any ${category} games matching "${searchQuery}". Try a different search term.`
                                            : `We couldn't find any ${category} games at the moment. Try refreshing or check back later.`
                                        }
                                    </p>
                                </div>
                                {isSearchMode && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={handleClearSearch}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        </div>
                    </MotionEffect>
                )}
            </div>
        </section>
    )
}