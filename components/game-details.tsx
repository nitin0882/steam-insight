"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, Heart, Image as ImageIcon, Play, Share2, Star, ThumbsDown, ThumbsUp, Users, Video } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface GameDetailsProps {
  gameId: number
}

interface MediaItem {
  type: 'image' | 'video'
  id: number | string
  thumbnail: string
  fullImage?: string
  videoUrl?: string
  title?: string
}

interface SteamMovie {
  id: number | string
  name: string
  thumbnail: string
  webm?: {
    max: string
  }
  mp4?: {
    max: string
  }
}

interface SteamScreenshot {
  id: number | string
  path_thumbnail: string
  path_full: string
}

interface ReviewBreakdown {
  reviewScore: number
  reviewScoreDesc: string
  totalReviews: number
  positivePercentage: number
  negativePercentage: number
}

interface GameData {
  name: string
  description: string
  tags: string[]
  image: string
  movies?: SteamMovie[]
  screenshots?: SteamScreenshot[]
  reviewBreakdown?: ReviewBreakdown
  rating: number
  reviewCount: number
  releaseDate: string
  price: string
  developers?: string[]
  publishers?: string[]
}

export function GameDetails({ gameId }: GameDetailsProps) {
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Utility function to decode HTML entities and clean up text
  const decodeHtmlEntities = (text: string) => {
    if (!text) return ""

    // Create a temporary textarea element to decode HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    let decoded = textarea.value

    // Additional cleanup for common HTML entities and formatting issues
    decoded = decoded
      .replace(/&quot;/g, '"')    // Replace &quot; with actual quotes
      .replace(/&amp;/g, '&')     // Replace &amp; with &
      .replace(/&lt;/g, '<')      // Replace &lt; with <
      .replace(/&gt;/g, '>')      // Replace &gt; with >
      .replace(/&nbsp;/g, ' ')    // Replace &nbsp; with space
      .replace(/&#39;/g, "'")     // Replace &#39; with apostrophe
      .replace(/&apos;/g, "'")    // Replace &apos; with apostrophe
      .replace(/&#x27;/g, "'")    // Replace &#x27; with apostrophe
      .replace(/&hellip;/g, '...') // Replace &hellip; with ellipsis
      .replace(/&mdash;/g, '—')   // Replace &mdash; with em dash
      .replace(/&ndash;/g, '–')   // Replace &ndash; with en dash
      .trim()

    return decoded
  }

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        setLoading(true)
        const response = await fetch(`/api/games/${gameId}`)
        const data = await response.json()

        if (data.success && data.data) {
          setGame(data.data)
        } else {
          setError(data.error || "Game not found")
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load game details")
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [gameId])

  // Function to get media items (videos and screenshots)
  const getMediaItems = (): MediaItem[] => {
    if (!game) return []

    const items: MediaItem[] = []

    // Add videos if available (these would come from the raw Steam API data)
    if (game.movies && Array.isArray(game.movies)) {
      game.movies.forEach((movie: SteamMovie, index: number) => {
        console.log(`[DEBUG] Video ${index}:`, movie.name, 'Thumbnail:', movie.thumbnail)
        items.push({
          type: 'video',
          id: movie.id || `video-${index}`,
          thumbnail: movie.thumbnail || "/placeholder.svg?height=215&width=460&text=Video+Thumbnail",
          videoUrl: movie.webm?.max || movie.mp4?.max,
          title: movie.name || `Trailer ${index + 1}`
        })
      })
    }

    // Add screenshots
    if (game.screenshots && Array.isArray(game.screenshots)) {
      game.screenshots.forEach((screenshot: SteamScreenshot, index: number) => {
        items.push({
          type: 'image',
          id: screenshot.id || `screenshot-${index}`,
          thumbnail: screenshot.path_thumbnail || "/placeholder.svg?height=215&width=460&text=Screenshot",
          fullImage: screenshot.path_full || screenshot.path_thumbnail,
          title: `Screenshot ${index + 1}`
        })
      })
    }

    // If no media, add the header image as fallback
    if (items.length === 0 && game.image) {
      items.push({
        type: 'image',
        id: 'header',
        thumbnail: game.image,
        fullImage: game.image,
        title: game.name
      })
    }

    // If still no media, add a placeholder
    if (items.length === 0) {
      items.push({
        type: 'image',
        id: 'placeholder',
        thumbnail: "/placeholder.svg?height=384&width=768&text=" + encodeURIComponent(game.name || "Game Media"),
        fullImage: "/placeholder.svg?height=384&width=768&text=" + encodeURIComponent(game.name || "Game Media"),
        title: "Game Media"
      })
    }

    return items
  }

  const mediaItems = getMediaItems()

  // Auto-play videos when they become the current media item
  useEffect(() => {
    const currentItem = mediaItems[currentMediaIndex]
    if (currentItem?.type === 'video') {
      setPlayingVideoId(currentItem.id as string)
    } else {
      setPlayingVideoId(null)
    }
  }, [currentMediaIndex, mediaItems])

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return

    const scrollAmount = 320 // width of one item + gap
    const currentScroll = carouselRef.current.scrollLeft
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
  }

  const handleVideoPlay = (videoId: string) => {
    setPlayingVideoId(videoId)
  }

  const handleVideoStop = () => {
    setPlayingVideoId(null)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8"></div>
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h1>
        <p className="text-muted-foreground">{error || "The game you're looking for could not be found."}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Game Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{game.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {decodeHtmlEntities(game.description)}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {game.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.open(`https://store.steampowered.com/app/${gameId}`, '_blank')}
              >
                <Play className="h-5 w-5 mr-2" />
                View on Steam
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(`https://store.steampowered.com/app/${gameId}`, '_blank')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: game.name,
                      text: decodeHtmlEntities(game.description),
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Media Carousel */}
          <div className="mb-8">
            {/* Main Media Display */}
            <div className="mb-4">
              {mediaItems.length > 0 && (
                <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden shadow-lg">
                  {mediaItems[currentMediaIndex]?.type === 'video' ? (
                    <div className="relative w-full h-full">
                      {playingVideoId === mediaItems[currentMediaIndex].id ? (
                        <video
                          className="w-full h-full object-contain"
                          controls
                          autoPlay
                          onEnded={handleVideoStop}
                          onPause={handleVideoStop}
                        >
                          <source src={mediaItems[currentMediaIndex].videoUrl} type="video/mp4" />
                          <source src={mediaItems[currentMediaIndex].videoUrl?.replace('.mp4', '.webm')} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="relative w-full h-full cursor-pointer group" onClick={() => handleVideoPlay(mediaItems[currentMediaIndex].id as string)}>
                          <Image
                            width={768}
                            height={432}
                            src={mediaItems[currentMediaIndex].thumbnail}
                            alt={mediaItems[currentMediaIndex].title || ''}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              // Try to load without query parameters first
                              if (target.src.includes('?')) {
                                const baseUrl = target.src.split('?')[0]
                                if (target.src !== baseUrl) {
                                  target.src = baseUrl
                                  return
                                }
                              }
                              // Final fallback
                              target.src = "/placeholder.svg?height=384&width=768&text=" + encodeURIComponent(game.name)
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
                            <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform">
                              <Play className="h-8 w-8 text-black ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-600 text-white">
                              <Video className="h-3 w-3 mr-1" />
                              Video
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      width={768}
                      height={432}
                      src={mediaItems[currentMediaIndex]?.fullImage || mediaItems[currentMediaIndex]?.thumbnail}
                      alt={mediaItems[currentMediaIndex]?.title || game.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => window.open(mediaItems[currentMediaIndex]?.fullImage || mediaItems[currentMediaIndex]?.thumbnail, '_blank')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        // Try thumbnail if full image fails
                        const currentItem = mediaItems[currentMediaIndex]
                        if (currentItem?.fullImage && target.src === currentItem.fullImage) {
                          target.src = currentItem.thumbnail
                          return
                        }
                        // Try without query parameters
                        if (target.src.includes('?')) {
                          const baseUrl = target.src.split('?')[0]
                          if (target.src !== baseUrl) {
                            target.src = baseUrl
                            return
                          }
                        }
                        // Final fallback
                        target.src = "/placeholder.svg?height=384&width=768&text=" + encodeURIComponent(game.name)
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Media Carousel */}
            {mediaItems.length > 1 && (
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">Media Gallery</h3>
                  <span className="text-sm text-muted-foreground">
                    {currentMediaIndex + 1} / {mediaItems.length}
                  </span>
                </div>

                <div className="relative group">
                  {/* Carousel Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => scrollCarousel('left')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => scrollCarousel('right')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Scrollable Media Items */}
                  <div
                    ref={carouselRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {mediaItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`relative flex-shrink-0 w-80 h-20 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${index === currentMediaIndex ? 'ring-2 ring-primary' : ''
                          }`}
                        onClick={() => {
                          setCurrentMediaIndex(index)
                        }}
                      >
                        <Image
                          width={320}
                          height={80}
                          src={item.thumbnail}
                          alt={item.title || ''}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            // Try to load the original image without query parameters first
                            if (target.src.includes('?')) {
                              const baseUrl = target.src.split('?')[0]
                              if (target.src !== baseUrl) {
                                target.src = baseUrl
                                return
                              }
                            }
                            // Final fallback to placeholder
                            target.src = "/placeholder.svg?height=80&width=320&text=" + encodeURIComponent(item.title || '')
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-all">
                          {item.type === 'video' ? (
                            <div className="absolute top-1 left-1">
                              <Badge variant="secondary" className="text-xs">
                                <Video className="h-2 w-2 mr-1" />
                                Video
                              </Badge>
                            </div>
                          ) : (
                            <div className="absolute top-1 left-1">
                              <Badge variant="secondary" className="text-xs">
                                <ImageIcon className="h-2 w-2 mr-1" />
                                Image
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Stats */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {(() => {
                      // Use Steam review score if available, otherwise use Metacritic score
                      if (game.reviewBreakdown?.reviewScore && game.reviewBreakdown.reviewScore > 0) {
                        // Convert Steam's 10-point scale to 5-star scale
                        return (game.reviewBreakdown.reviewScore / 2).toFixed(1)
                      } else if (game.rating > 0) {
                        // Use Metacritic score converted to 5-star scale
                        return game.rating.toFixed(1)
                      }
                      return "N/A"
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {game.reviewCount > 1000 ? `${(game.reviewCount / 1000).toFixed(1)}k` : game.reviewCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {game.releaseDate ? new Date(game.releaseDate).getFullYear() : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">Release</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ExternalLink className="h-5 w-5 text-chart-3" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{game.price}</div>
                  <div className="text-sm text-muted-foreground">Price</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Purchase Card */}
          <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-foreground mb-2">{game.price}</div>
                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={() => window.open(`https://store.steampowered.com/app/${gameId}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buy on Steam
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="sm"
                  onClick={() => window.open(`https://store.steampowered.com/app/${gameId}`, '_blank')}
                >
                  View in Steam Store
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date:</span>
                  <span className="text-foreground">
                    {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Developer:</span>
                  <span className="text-foreground">
                    {game.developers && game.developers.length > 0 ? game.developers.join(", ") : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Publisher:</span>
                  <span className="text-foreground">
                    {game.publishers && game.publishers.length > 0 ? game.publishers.join(", ") : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Rating Breakdown
              </CardTitle>
              {game.reviewBreakdown?.reviewScoreDesc && (
                <p className="text-sm text-muted-foreground">
                  {game.reviewBreakdown.reviewScoreDesc} ({game.reviewBreakdown.totalReviews.toLocaleString()} reviews)
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Positive</span>
                  </div>
                  <Progress value={game.reviewBreakdown?.positivePercentage || 0} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">
                    {game.reviewBreakdown?.positivePercentage || 0}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Negative</span>
                  </div>
                  <Progress value={game.reviewBreakdown?.negativePercentage || 0} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">
                    {game.reviewBreakdown?.negativePercentage || 0}%
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                {game.reviewBreakdown ? (
                  // Generate star ratings based on review score
                  (() => {
                    const score = game.reviewBreakdown.reviewScore || 0
                    const positivePercentage = game.reviewBreakdown.positivePercentage || 0

                    // Create distribution based on review score
                    const getStarPercentage = (starLevel: number) => {
                      if (score >= 8) { // Very Positive
                        return starLevel === 5 ? Math.max(positivePercentage - 20, 0) :
                          starLevel === 4 ? 20 :
                            starLevel === 3 ? Math.min(15, 100 - positivePercentage) :
                              starLevel === 2 ? Math.max(10 - positivePercentage / 8, 0) :
                                Math.max(100 - positivePercentage - 35, 0)
                      } else if (score >= 7) { // Mostly Positive
                        return starLevel === 5 ? Math.max(positivePercentage - 30, 0) :
                          starLevel === 4 ? 30 :
                            starLevel === 3 ? Math.min(25, 100 - positivePercentage) :
                              starLevel === 2 ? Math.max(15 - positivePercentage / 6, 0) :
                                Math.max(100 - positivePercentage - 40, 0)
                      } else if (score >= 5) { // Mixed
                        return starLevel === 5 ? Math.max(positivePercentage / 3, 0) :
                          starLevel === 4 ? Math.max(positivePercentage / 2, 0) :
                            starLevel === 3 ? Math.max(positivePercentage / 1.5, 0) :
                              starLevel === 2 ? Math.min(30, 100 - positivePercentage / 2) :
                                Math.max(100 - positivePercentage, 0)
                      } else { // Mostly Negative
                        return starLevel === 5 ? Math.max(positivePercentage / 4, 0) :
                          starLevel === 4 ? Math.max(positivePercentage / 3, 0) :
                            starLevel === 3 ? Math.max(positivePercentage / 2, 0) :
                              starLevel === 2 ? Math.min(25, positivePercentage) :
                                Math.max(100 - positivePercentage - 15, 0)
                      }
                    }

                    return [5, 4, 3, 2, 1].map((stars) => {
                      const percentage = Math.round(getStarPercentage(stars))
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{stars}</span>
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          </div>
                          <Progress value={percentage} className="flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                        </div>
                      )
                    })
                  })()
                ) : (
                  // Fallback to default distribution if no review data
                  [5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{stars}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                      <Progress
                        value={stars === 5 ? 45 : stars === 4 ? 25 : stars === 3 ? 15 : stars === 2 ? 10 : 5}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {stars === 5 ? "45%" : stars === 4 ? "25%" : stars === 3 ? "15%" : stars === 2 ? "10%" : "5%"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
