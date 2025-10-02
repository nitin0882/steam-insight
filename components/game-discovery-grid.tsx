"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNewReleaseGames } from "@/hooks/use-new-release-games"
import { usePopularGames } from "@/hooks/use-popular-games"
import { useTopRatedGames } from "@/hooks/use-top-rated-games"
import { useTrendingGames } from "@/hooks/use-trending-games"
import { AlertCircle, Calendar, ExternalLink, Filter, Grid, List, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useMemo, useRef, useState } from "react"

interface Game {
  id: number
  name: string
  type?: string  // Add type field
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

type SortOption = "name" | "rating" | "reviews" | "release" | "price"
type ViewMode = "grid" | "list"
type CategoryType = "popular" | "trending" | "new-releases" | "top-rated"

export function GameDiscoveryGrid() {
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return "list"
    }
    return "grid"
  })
  const [activeCategory, setActiveCategory] = useState<CategoryType>("popular")
  const [currentLimit, setCurrentLimit] = useState(24)
  const headerRef = useRef<HTMLDivElement>(null)

  // Use specific hooks and endpoints for each category
  const popularResult = usePopularGames(currentLimit) // This calls /api/games/popular
  const trendingResult = useTrendingGames(currentLimit) // This calls /api/games/trending
  const newReleasesResult = useNewReleaseGames(currentLimit) // This calls /api/games/new-releases
  const topRatedResult = useTopRatedGames(currentLimit) // This calls /api/games/top-rated

  // Select the appropriate result based on active category
  const currentResult = useMemo(() => {
    switch (activeCategory) {
      case "trending":
        return trendingResult
      case "new-releases":
        return newReleasesResult
      case "top-rated":
        return topRatedResult
      default:
        return popularResult
    }
  }, [activeCategory, popularResult, trendingResult, newReleasesResult, topRatedResult])

  const { games, isLoading, error, refetch } = currentResult

  // Handle load more functionality
  const handleLoadMore = useCallback(() => {
    setCurrentLimit(prev => prev + 24)
    // Smooth scroll to the header after loading more games
    setTimeout(() => {
      headerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }, 100) // Small delay to ensure DOM updates
  }, [])

  // Handle category change with reset
  const handleCategoryChange = useCallback((newCategory: CategoryType) => {
    setActiveCategory(newCategory)
    setCurrentLimit(24)
    setFilterTag("all")
    setSortBy("rating")
  }, [])

  // Get unique tags from games
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    games.forEach((game) => {
      game.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [games])

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filtered = games

    // Filter by tag
    if (filterTag !== "all") {
      filtered = filtered.filter((game) => game.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase())))
    }

    // Sort games
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          // For hardware/tools, sort by name instead of rating
          if (a.type === 'hardware' || a.type === 'tool' || a.type === 'application' ||
            b.type === 'hardware' || b.type === 'tool' || b.type === 'application') {
            return a.name.localeCompare(b.name)
          }
          const aRating = a.rating ?? 0
          const bRating = b.rating ?? 0
          return bRating - aRating
        case "reviews":
          return b.reviewCount - a.reviewCount
        case "release":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case "price":
          const priceA = Number.parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0
          const priceB = Number.parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0
          return priceA - priceB
        default:
          return 0
      }
    })

    return sorted
  }, [games, sortBy, filterTag])

  const formatRating = (rating: number | null) => {
    return rating && rating > 0 ? rating.toFixed(1) : "N/A"
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

  const GameCard = ({ game, isListView = false }: { game: Game; isListView?: boolean }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Safety check: Don't render if game.id is missing or invalid
    if (!game.id || game.id === 0) {
      console.warn('Game card rendered with invalid ID:', game)
      return null
    }

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

    return (
      <Link href={`/game/${game.id}`} className="block">
        <Card
          className={`group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 ${isListView ? "flex flex-row h-40" : "flex flex-col h-96"
            }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`relative overflow-hidden ${isListView ? "w-48 flex-shrink-0 h-full" : "h-48 flex-shrink-0"}`}>
            <Image
              width={isListView ? 192 : 384}
              height={192}
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=192&width=384&text=" + encodeURIComponent(game.name)
              }}
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

            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {game.price}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className={`p-4 ${isListView ? "flex-1" : "flex-1"}`}>
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 max-w-full ${isListView ? "text-base" : "text-lg"
                  }`}
              >
                {game.name}
              </h3>
            </div>

            <p className={`text-sm text-muted-foreground mb-3 max-w-full ${isListView ? "line-clamp-1" : "line-clamp-2"}`}>
              {game.description}
            </p>

            <div className="flex items-center gap-3 mb-3">
              {(() => {
                const isUnreleased = game.releaseDate && new Date(game.releaseDate) > new Date()
                if (game.type === 'hardware' || game.type === 'tool' || game.type === 'application') {
                  return null
                }
                if (isUnreleased) {
                  return (
                    <div className="flex items-center gap-1 max-w-full">
                      <Star className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-muted-foreground truncate">Not Released</span>
                    </div>
                  )
                }
                return (
                  <div className="flex items-center gap-1 max-w-full">
                    <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">{formatRating(game.rating)}</span>
                  </div>
                )
              })()}
              {game.reviewCount > 0 && (
                <div className="flex items-center gap-1 max-w-full">
                  <Users className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{formatReviewCount(game.reviewCount)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3 max-w-full">
              {game.tags.slice(0, isListView ? 2 : 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs max-w-full overflow-hidden">
                  <span className="truncate">{tag}</span>
                </Badge>
              ))}
            </div>

            {game.releaseDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-full">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>

          {!isListView && (
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                asChild
              >
                <span>
                  {game.type === 'hardware' || game.type === 'tool' || game.type === 'application'
                    ? 'View Details'
                    : 'View Reviews'}
                </span>
              </Button>
            </CardFooter>
          )}
        </Card>
      </Link>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Games</h3>
            <p className="text-muted-foreground mb-4">
              {error ? (error instanceof Error ? error.message : String(error)) : "Something went wrong while fetching games."}
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
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Discover Games</h2>
            <p className="text-muted-foreground">Explore games by category, rating, and popularity</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(value) => handleCategoryChange(value as CategoryType)} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new-releases">New Releases</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            <MotionEffect
              slide={viewMode === "grid" ? { direction: "up", offset: 30 } : undefined}
              fade={{ initialOpacity: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={activeCategory}
            >
              {/* Filters and Sorting */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="release">Release Date</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1" />

                <div className="text-sm text-muted-foreground flex items-center">
                  {isLoading ? "Loading..." : `${filteredAndSortedGames.length} games found`}
                </div>
              </div>

              {/* Games Grid/List */}
              {isLoading ? (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card
                      key={i}
                      className={`overflow-hidden border-border/50 bg-card/50 ${viewMode === "list" ? "flex flex-row h-40" : "flex flex-col h-96"}`}
                    >
                      <Skeleton className={viewMode === "list" ? "w-48 h-full flex-shrink-0" : "w-full h-48 flex-shrink-0"} />
                      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : "flex-1"}`}>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <div className="flex items-center gap-4 mb-3">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex gap-1 mb-3">
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </CardContent>
                      {viewMode === "grid" && (
                        <CardFooter className="p-4 pt-0">
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {filteredAndSortedGames.map((game) => (
                    <GameCard key={game.id} game={game} isListView={viewMode === "list"} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && filteredAndSortedGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Filter className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg">No games found</p>
                    <p className="text-sm">Try adjusting your filters or search criteria</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterTag("all")
                      setSortBy("rating")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Load More */}
              {!isLoading && filteredAndSortedGames.length > 0 && (
                <MotionEffect
                  slide={{ direction: "up", offset: 20 }}
                  fade={{ initialOpacity: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={handleLoadMore}>
                      Load More Games
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </MotionEffect>
              )}
            </MotionEffect>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
