import { ReviewsGrid } from "@/components/reviews-grid"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Best Game Reviews - Steam Insight",
    description: "Discover the highest quality Steam game reviews from experienced players. Read detailed, helpful reviews that help you find your next favorite game.",
}

export default function ReviewsPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Best Game Reviews</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover the most helpful and insightful Steam reviews from experienced gamers.
                        Our algorithm identifies high-quality reviews based on helpfulness, detail, and community engagement.
                    </p>
                </div>

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
        </main>
    )
}