import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { ReviewsGrid } from "@/components/reviews-grid"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, ThumbsUp, Users } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Best Game Reviews - Steam Insight",
    description: "Discover the highest quality Steam game reviews from experienced players. Read detailed, helpful reviews that help you find your next favorite game.",
}

export default function ReviewsPage() {
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
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Curated Gaming Insights
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
                                <span className="text-balance">Best Game</span>
                                <br />
                                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                    Reviews
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
                                Discover the most helpful and insightful Steam reviews from experienced gamers.
                                Our algorithm identifies high-quality reviews based on helpfulness, detail, and community engagement.
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
                                    Quality Reviews
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <ThumbsUp className="h-4 w-4 mr-2 text-primary" />
                                    Community Verified
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                    Expert Players
                                </Badge>
                            </div>
                        </MotionEffect>
                    </div>
                </div>
            </section>

            {/* Reviews Grid Section */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Curating the best reviews...</p>
                            </div>
                        </div>
                    }>
                        <ReviewsGrid />
                    </Suspense>
                </div>
            </section>
        </main>
    )
}