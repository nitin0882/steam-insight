"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/animate-ui/components/dialog"
import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchGames } from "@/hooks/use-steam-games"
import { Search, Star, Users, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialQuery?: string
}

export function SearchDialog({ open, onOpenChange, initialQuery = "" }: SearchDialogProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const debouncedQuery = useDebounce(searchQuery, 300)
    const { games, isLoading, error } = useSearchGames(debouncedQuery, 8)

    useEffect(() => {
        if (open) {
            setSearchQuery(initialQuery)
        }
    }, [open, initialQuery])

    const handleGameClick = (gameId: number) => {
        onOpenChange(false)
        router.push(`/game/${gameId}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-2xl w-full max-h-[80vh] sm:max-h-[70vh] overflow-hidden p-0"
                showCloseButton={false}
                onKeyDown={handleKeyDown}
            >
                <MotionEffect
                    slide={{ direction: 'up', offset: 20 }}
                    fade
                    zoom={{ initialScale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-left">Search Games</DialogTitle>
                        </DialogHeader>

                        <div className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                autoFocus
                                placeholder="Search for games, genres, or developers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-base bg-muted/50 border-border/50 focus:border-primary/50"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {debouncedQuery.trim() === "" ? (
                                <MotionEffect
                                    fade
                                    slide={{ direction: 'up', offset: 10 }}
                                    delay={0.1}
                                >
                                    <div className="text-center py-8">
                                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">Start typing to search games...</p>
                                    </div>
                                </MotionEffect>
                            ) : isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <MotionEffect
                                            key={i}
                                            fade
                                            slide={{ direction: 'up', offset: 10 }}
                                            delay={i * 0.05}
                                        >
                                            <Card className="overflow-hidden">
                                                <div className="flex">
                                                    <Skeleton className="w-16 h-12 flex-shrink-0" />
                                                    <CardContent className="p-3 flex-1">
                                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                                        <Skeleton className="h-3 w-1/2" />
                                                    </CardContent>
                                                </div>
                                            </Card>
                                        </MotionEffect>
                                    ))}
                                </div>
                            ) : error ? (
                                <MotionEffect
                                    fade
                                    slide={{ direction: 'up', offset: 10 }}
                                >
                                    <div className="text-center py-8">
                                        <p className="text-destructive mb-2">Search temporarily unavailable</p>
                                        <p className="text-sm text-muted-foreground">
                                            {error instanceof Error ? error.message : String(error)}
                                        </p>
                                    </div>
                                </MotionEffect>
                            ) : games.length === 0 ? (
                                <MotionEffect
                                    fade
                                    slide={{ direction: 'up', offset: 10 }}
                                >
                                    <div className="text-center py-8">
                                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-2">No games found for &quot;{debouncedQuery}&quot;</p>
                                        <p className="text-sm text-muted-foreground">Try a different search term</p>
                                    </div>
                                </MotionEffect>
                            ) : (
                                <div className="space-y-2">
                                    {games.filter(game => game.id && game.id !== 0).map((game, index) => (
                                        <MotionEffect
                                            key={game.id}
                                            fade
                                            slide={{ direction: 'up', offset: 10 }}
                                            delay={index * 0.05}
                                        >
                                            <Card
                                                className="overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                                                onClick={() => handleGameClick(game.id)}
                                            >
                                                <div className="flex">
                                                    <div className="relative w-16 h-12 flex-shrink-0">
                                                        <Image
                                                            src={game.image || "/placeholder.svg"}
                                                            alt={game.name}
                                                            width={64}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.src = "/placeholder.svg?height=48&width=64&text=" + encodeURIComponent(game.name.slice(0, 6))
                                                            }}
                                                        />
                                                        {game.price && game.price.toLowerCase().includes('free') && (
                                                            <div className="absolute -top-1 -left-1">
                                                                <Badge variant="secondary" className="text-xs bg-green-500/80 text-white px-1 py-0">
                                                                    Free
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="p-3 flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-1 hover:text-primary transition-colors">
                                                            {game.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            {game.rating && game.rating > 0 && (
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
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs font-medium text-primary">
                                                                {game.price || 'N/A'}
                                                            </span>
                                                            {game.tags && game.tags.length > 0 && (
                                                                <Badge variant="outline" className="text-xs px-1 py-0">
                                                                    {game.tags[0]}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Card>
                                        </MotionEffect>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </MotionEffect>
            </DialogContent>
        </Dialog>
    )
}
