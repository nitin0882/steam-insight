import { GameGrid } from "@/components/game-grid"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Top Games",
    description: "Discover the highest-rated and most popular games on Steam. Browse top games by rating, reviews, and community recommendations.",
}

export default function TopGamesPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Top Games</h1>
                    <p className="text-muted-foreground">
                        Discover the highest-rated and most popular games on Steam
                    </p>
                </div>

                <Suspense fallback={<div></div>}>
                    <GameGrid />
                </Suspense>
            </div>
        </main>
    )
}