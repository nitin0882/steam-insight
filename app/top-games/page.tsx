import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { TopGamesGrid } from "@/components/top-games-grid"
import { Badge } from "@/components/ui/badge"
import { Award, Star, TrendingUp, Trophy } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Top Rated Games - Steam Scope",
    description: "Discover the highest-rated and most critically acclaimed games on Steam. Browse games by Metacritic scores, user ratings, and expert reviews.",
}

export default function TopGamesPage() {
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
                                <Trophy className="mr-2 h-4 w-4" />
                                Elite Gaming Collection
                            </div>
                        </MotionEffect>

                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                            delay={0.15}
                        >
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                <span className="text-balance">Top Rated</span>
                                <br />
                                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                    Steam Games
                                </span>
                            </h1>
                        </MotionEffect>

                        <MotionEffect
                            slide={{ direction: 'up' }}
                            fade
                            zoom
                            inView
                            delay={0.3}
                        >
                            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
                                Discover the highest-rated and most critically acclaimed games on Steam.
                                Curated by Metacritic scores, user ratings, and community recommendations.
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
                                    <Star className="h-4 w-4 mr-2 text-primary" />
                                    Metacritic Rated
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                                    Community Favorites
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <Award className="h-4 w-4 mr-2 text-primary" />
                                    Award Winners
                                </Badge>
                            </div>
                        </MotionEffect>
                    </div>
                </div>
            </section>

            {/* Games Grid Section */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <Suspense
                        fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden">
                                            <div className="w-full h-48 bg-muted/50" />
                                            <div className="p-4 space-y-3">
                                                <div className="h-6 bg-muted/50 rounded" />
                                                <div className="h-4 bg-muted/30 rounded w-3/4" />
                                                <div className="flex gap-2">
                                                    <div className="h-6 bg-muted/30 rounded w-16" />
                                                    <div className="h-6 bg-muted/30 rounded w-20" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    >
                        <TopGamesGrid />
                    </Suspense>
                </div>
            </section>
        </main>
    )
}