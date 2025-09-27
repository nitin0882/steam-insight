
import { CategoryGameGrid } from "@/components/category-game-grid"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface CategoryPageProps {
    params: {
        category: string
    }
}

const validCategories = [
    "action", "rpg", "strategy", "indie", "adventure", "simulation",
    "racing", "sports", "puzzle", "horror", "multiplayer", "arcade"
]

export function generateMetadata({ params }: CategoryPageProps): Metadata {
    const category = decodeURIComponent(params.category)
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

    if (!validCategories.includes(category.toLowerCase())) {
        return {
            title: "Category Not Found",
            description: "The requested game category could not be found.",
        }
    }

    return {
        title: `${categoryName} Games`,
        description: `Discover the best ${categoryName.toLowerCase()} games on Steam. Browse reviews, ratings, and find your next favorite ${categoryName.toLowerCase()} game.`,
    }
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const category = decodeURIComponent(params.category)
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

    if (!validCategories.includes(category.toLowerCase())) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName} Games</h1>
                    <p className="text-muted-foreground">
                        Discover the best {categoryName.toLowerCase()} games on Steam
                    </p>
                </div>

                <Suspense fallback={<div></div>}>
                    <CategoryGameGrid category={category.toLowerCase()} />
                </Suspense>
            </div>
        </main>
    )
}