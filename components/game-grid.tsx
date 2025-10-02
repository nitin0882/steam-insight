"use client"
import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePopularGames } from "@/hooks/use-steam-games"
import { AlertCircle, Calendar, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function GameGrid() {
  const { games, isLoading, error, refetch } = usePopularGames(18)


  const formatRating = (rating: number | null) => {
    if (rating === null) return "Not Released Yet"
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


        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <MotionEffect
                key={i}
                slide={{
                  direction: 'up',
                }}
                fade
                zoom
                inView
                delay={0.1 + i * 0.05}
              >
                <Card className="overflow-hidden border-border/50 bg-card/50">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
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
            : // Actual games
            games.filter(game => game.id && game.id !== 0).map((game, index) => (
              <MotionEffect
                key={game.id}
                slide={{
                  direction: 'up',
                }}
                fade
                zoom
                inView
                delay={0.1 + index * 0.05}
              >
                <Link href={`/game/${game.id}`} className="block">
                  <Card
                    className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer flex flex-col h-96"
                  >
                    <div className="relative overflow-hidden flex-shrink-0">
                      <Image
                        width={384}
                        height={192}
                        src={game.image || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={game.image?.includes('cdn.akamai.steamstatic.com') || game.image?.includes('steamcdn-a.akamaihd.net')}
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
                        {game.tags.slice(0, 3).map((tag) => (
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

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <span>View Reviews</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </MotionEffect>
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
            inView
            delay={0.2}
          >
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={() => refetch()}>
                🔄 Refresh Games
              </Button>
            </div>
          </MotionEffect>
        )}

      </div>
    </section>
  )
}