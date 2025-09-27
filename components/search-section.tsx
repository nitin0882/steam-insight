"use client"

import type React from "react"

import { AdvancedSearchFilters } from "@/components/advanced-search-filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchGames } from "@/hooks/use-steam-games"
import { Search, SlidersHorizontal, Star, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface SearchFilters {
  priceRange: [number, number]
  ratingRange: [number, number]
  releaseYear: [number, number]
  genres: string[]
  features: string[]
  multiplayer: boolean
  earlyAccess: boolean
  freeToPlay: boolean
  onSale: boolean
}

interface SearchSectionProps {
  initialQuery?: string
}

export function SearchSection({ initialQuery = "" }: SearchSectionProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 100],
    ratingRange: [0, 5],
    releaseYear: [2000, new Date().getFullYear()],
    genres: [],
    features: [],
    multiplayer: false,
    earlyAccess: false,
    freeToPlay: false,
    onSale: false,
  })

  const debouncedQuery = useDebounce(searchQuery, 500)
  const { games, isLoading, error } = useSearchGames(debouncedQuery, 12)

  const popularTags = [
    "Action",
    "RPG",
    "Strategy",
    "Indie",
    "Adventure",
    "Simulation",
    "Racing",
    "Sports",
    "Puzzle",
    "Horror",
    "Multiplayer",
    "Co-op",
  ]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setShowResults(true)
    }
  }, [searchQuery])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [debouncedQuery])

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      ratingRange: [0, 5],
      releaseYear: [2000, new Date().getFullYear()],
      genres: [],
      features: [],
      multiplayer: false,
      earlyAccess: false,
      freeToPlay: false,
      onSale: false,
    })
    setSelectedTags([])
  }

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Your Perfect Game</h2>
            <p className="text-muted-foreground text-lg">
              Search through thousands of Steam games and discover hidden gems
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for games, genres, or developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-12 text-base bg-background border-border/50 focus:border-primary/50"
                />
              </div>
              <Button size="lg" className="px-6" onClick={handleSearch}>
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button
                size="lg"
                variant={showAdvancedFilters ? "default" : "outline"}
                className="px-4"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mb-8">
              <AdvancedSearchFilters filters={filters} onFiltersChange={setFilters} onReset={resetFilters} />
            </div>
          )}

          {showResults && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      Searching Steam library...
                    </span>
                  ) : (
                    `Search Results for "${debouncedQuery}"`
                  )}
                </h3>
                {!isLoading && games.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {games.length} game{games.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="flex">
                        <Skeleton className="w-24 h-16 flex-shrink-0" />
                        <CardContent className="p-3 flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2 mb-1" />
                          <Skeleton className="h-3 w-1/3" />
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-destructive mb-2">Search temporarily unavailable</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                  <Button variant="outline" onClick={() => window.location.reload()} size="sm">
                    Try Again
                  </Button>
                </div>
              ) : games.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">No games found for &quot;{debouncedQuery}&quot;</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching for:
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Skyrim", "Witcher", "Cyberpunk", "GTA", "Portal", "Half-Life"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.filter(game => game.id && game.id !== 0).map((game) => (
                    <Card
                      key={game.id}
                      className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                      onClick={() => router.push(`/game/${game.id}`)}
                    >
                      <div className="flex">
                        <div className="relative w-24 h-16 flex-shrink-0">
                          <img
                            src={game.image || "/placeholder.svg"}
                            alt={game.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src =
                                "/placeholder.svg?height=64&width=96&text=" + encodeURIComponent(game.name.slice(0, 8))
                            }}
                          />
                          {game.price && game.price.toLowerCase().includes('free') && (
                            <div className="absolute top-1 left-1">
                              <Badge variant="secondary" className="text-xs bg-green-500/80 text-white">
                                Free
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-1 hover:text-primary transition-colors">
                            {game.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            {game.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{game.rating.toFixed(1)}</span>
                              </div>
                            )}
                            {game.reviewCount > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>
                                  {game.reviewCount > 1000
                                    ? `${(game.reviewCount / 1000).toFixed(1)}k`
                                    : game.reviewCount}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-primary truncate">
                              {game.price || 'N/A'}
                            </span>
                            {game.tags && game.tags.length > 0 && (
                              <Badge variant="outline" className="text-xs px-1 py-0 ml-2">
                                {game.tags[0]}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popular Tags */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer transition-all hover:scale-105 ${selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              🔥 Trending Now
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              ⭐ Highest Rated
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              🆕 New Releases
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              💰 Best Value
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
