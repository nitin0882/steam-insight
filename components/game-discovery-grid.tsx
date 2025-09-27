"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNewReleases, usePopularGames, useTopRatedGames, useTrendingGames } from "@/hooks/use-steam-games"
import { AlertCircle, Calendar, ExternalLink, Filter, Grid, List, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

interface Game {
  id: number
  name: string
  image: string
  rating: number
  reviewCount: number
  price: string
  tags: string[]
  releaseDate: string
  description: string
}

type SortOption = "name" | "rating" | "reviews" | "release" | "price"
type ViewMode = "grid" | "list"

export function GameDiscoveryGrid() {
  const [sortBy, setSortBy] = useState<SortOption>("rating")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeCategory, setActiveCategory] = useState("popular")

  // Fetch different game types based on active category
  const popularGames = usePopularGames(24)
  const trendingGames = useTrendingGames(24)
  const topRatedGames = useTopRatedGames(24)
  const newReleases = useNewReleases(24)

  // Select the appropriate data source based on active category
  const getCurrentGamesData = () => {
    switch (activeCategory) {
      case "trending":
        return trendingGames
      case "top-rated":
        return topRatedGames
      case "new":
        return newReleases
      default:
        return popularGames
    }
  }

  const { games, isLoading, error, refetch } = getCurrentGamesData()

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
          return b.rating - a.rating
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

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : "N/A"
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
    // Safety check: Don't render if game.id is missing or invalid
    if (!game.id || game.id === 0) {
      console.warn('Game card rendered with invalid ID:', game)
      return null
    }

    return (
      <Link href={`/game/${game.id}`} className="block">
        <Card
          className={`group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 ${isListView ? "flex flex-row h-32" : ""
            }`}
        >
          <div className={`relative overflow-hidden ${isListView ? "w-48 flex-shrink-0" : ""}`}>
            <Image
              width={isListView ? 192 : 384}
              height={isListView ? 192 : 192}
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              className={`object-cover transition-transform duration-300 group-hover:scale-110 ${isListView ? "w-full h-full" : "w-full h-48"
                }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=192&width=384&text=" + encodeURIComponent(game.name)
              }}
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {game.price}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className={`p-4 ${isListView ? "flex-1" : ""}`}>
            <div className="flex items-start justify-between mb-2">
              <h3
                className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 ${isListView ? "text-base" : "text-lg"
                  }`}
              >
                {game.name}
              </h3>
            </div>

            <p className={`text-sm text-muted-foreground mb-3 ${isListView ? "line-clamp-1" : "line-clamp-2"}`}>
              {game.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{formatRating(game.rating)}</span>
              </div>
              {game.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{formatReviewCount(game.reviewCount)} reviews</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {game.tags.slice(0, isListView ? 2 : 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {game.releaseDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>

          {!isListView && (
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                asChild
              >
                <span>View Reviews</span>
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
            <p className="text-muted-foreground mb-4">{error || "Something went wrong while fetching games."}</p>
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
        <div className="flex items-center justify-between mb-8">
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
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
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
                    className={`overflow-hidden border-border/50 bg-card/50 ${viewMode === "list" ? "flex flex-row h-32" : ""}`}
                  >
                    <Skeleton className={viewMode === "list" ? "w-48 h-full flex-shrink-0" : "w-full h-48"} />
                    <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
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
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={() => refetch()}>
                  Load More Games
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
