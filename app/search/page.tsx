import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { SearchSection } from "@/components/search-section"
import { Metadata } from "next"
import { Suspense } from "react"

interface SearchPageProps {
    searchParams: {
        q?: string
    }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
    const query = searchParams.q || ""

    return {
        title: query ? `Search results for "${query}"` : "Search Games",
        description: query
            ? `Find games matching "${query}" on SteamInsight. Browse reviews, ratings, and detailed information.`
            : "Search for your favorite Steam games on SteamInsight. Find reviews, ratings, and detailed game information.",
    }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || ""

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView
                    >
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {query ? `Search Results for "${query}"` : "Search Games"}
                        </h1>
                    </MotionEffect>
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView
                        delay={0.1}
                    >
                        <p className="text-muted-foreground">
                            {query ? `Find games matching your search` : "Discover your next favorite game"}
                        </p>
                    </MotionEffect>
                </div>

                <Suspense fallback={<div>Loading search results...</div>}>
                    <SearchSection initialQuery={query} />
                </Suspense>
            </div>
        </main>
    )
}