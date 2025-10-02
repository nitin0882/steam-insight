"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { CategoryGameGrid } from "@/components/category-game-grid"
import { Badge } from "@/components/ui/badge"
import {
    Calculator,
    Car,
    Crown,
    Gamepad2,
    Ghost,
    Menu,
    Puzzle,
    Swords,
    Target,
    TreePine,
    Trophy,
    Users,
    Zap
} from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"

interface CategoryPageProps {
    params: {
        category: string
    }
}

const validCategories = [
    "action", "rpg", "strategy", "indie", "adventure", "simulation",
    "racing", "sports", "puzzle", "horror", "multiplayer", "arcade"
]

const categoryIcons = {
    action: Swords,
    rpg: Crown,
    strategy: Target,
    indie: Zap,
    adventure: TreePine,
    simulation: Calculator,
    racing: Car,
    sports: Trophy,
    puzzle: Puzzle,
    horror: Ghost,
    multiplayer: Users,
    arcade: Gamepad2
}

export default function CategoryPageClient({ params }: CategoryPageProps) {
    const category = decodeURIComponent(params.category)
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
    const IconComponent = categoryIcons[category.toLowerCase() as keyof typeof categoryIcons] || Gamepad2

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Steam Scope</h2>
                            <nav className="space-y-2">
                                <Link href="/" className="block p-2 rounded hover:bg-accent">Home</Link>
                                <Link href="/categories" className="block p-2 rounded hover:bg-accent">Categories</Link>
                                <Link href="/top-games" className="block p-2 rounded hover:bg-accent">Top Games</Link>
                                <Link href="/reviews" className="block p-2 rounded hover:bg-accent">Reviews</Link>
                                <Link href="/search" className="block p-2 rounded hover:bg-accent">Search</Link>
                            </nav>
                            <div className="mt-8">
                                <h3 className="text-sm font-medium mb-2">Categories</h3>
                                <ul className="space-y-1">
                                    {validCategories.map(cat => (
                                        <li key={cat}>
                                            <Link href={`/categories/${cat}`} className="block p-2 text-sm rounded hover:bg-accent">
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
            {/* Desktop sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden lg:block">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Steam Scope</h2>
                    <nav className="space-y-2">
                        <Link href="/" className="block p-2 rounded hover:bg-accent">Home</Link>
                        <Link href="/categories" className="block p-2 rounded hover:bg-accent">Categories</Link>
                        <Link href="/top-games" className="block p-2 rounded hover:bg-accent">Top Games</Link>
                        <Link href="/reviews" className="block p-2 rounded hover:bg-accent">Reviews</Link>
                        <Link href="/search" className="block p-2 rounded hover:bg-accent">Search</Link>
                    </nav>
                    <div className="mt-8">
                        <h3 className="text-sm font-medium mb-2">Categories</h3>
                        <ul className="space-y-1">
                            {validCategories.map(cat => (
                                <li key={cat}>
                                    <Link href={`/categories/${cat}`} className="block p-2 text-sm rounded hover:bg-accent">
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
            {/* Main content */}
            <div className="lg:ml-64">
                {/* Mobile header */}
                <header className="lg:hidden p-4 bg-card border-b border-border flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="p-2">
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="ml-4 text-lg font-semibold">{categoryName} Games</h1>
                </header>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    {/* Floating background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <MotionEffect
                            zoom={{ initialScale: 0.8, scale: 1 }}
                            fade={{ initialOpacity: 0.1, opacity: 0.3 }}
                            inView
                            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
                        </MotionEffect>
                        <MotionEffect
                            zoom={{ initialScale: 1.2, scale: 0.8 }}
                            fade={{ initialOpacity: 0.2, opacity: 0.1 }}
                            inView
                            delay={10}
                            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />
                        </MotionEffect>
                    </div>
                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <MotionEffect
                                slide={{ direction: 'up' }}
                                fade
                                zoom
                                inView
                            >
                                <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                    <IconComponent className="mr-2 h-4 w-4" />
                                    {categoryName} Collection
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
                                    <span className="text-balance">{categoryName}</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                        Games
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
                                    Discover the best {categoryName.toLowerCase()} games on Steam.
                                    Browse reviews, ratings, and find your next favorite {categoryName.toLowerCase()} experience.
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
                                        <IconComponent className="h-4 w-4 mr-2 text-primary" />
                                        {categoryName} Genre
                                    </Badge>
                                    <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                        <Trophy className="h-4 w-4 mr-2 text-primary" />
                                        Top Rated
                                    </Badge>
                                    <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                        <Users className="h-4 w-4 mr-2 text-primary" />
                                        Community Picks
                                    </Badge>
                                </div>
                            </MotionEffect>
                        </div>
                    </div>
                </section>
                {/* Games Grid Section */}
                <section className="py-8 px-4">
                    <div className="container mx-auto">
                        <Suspense fallback={
                            <div className="space-y-8">
                                {/* Search skeleton */}
                                <div className="mb-8">
                                    <div className="relative max-w-2xl mx-auto">
                                        <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-lg">
                                            <div className="text-center mb-6">
                                                <div className="h-6 bg-muted/30 rounded w-48 mx-auto mb-2 animate-pulse"></div>
                                                <div className="h-4 bg-muted/20 rounded w-64 mx-auto animate-pulse"></div>
                                            </div>
                                            <div className="h-12 bg-muted/30 rounded-xl animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Results info skeleton */}
                                <div className="mb-6 text-center">
                                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
                                        <div className="h-6 bg-muted/30 rounded w-20 animate-pulse"></div>
                                        <div className="h-4 bg-muted/20 rounded w-32 animate-pulse"></div>
                                    </div>
                                </div>
                                {/* Featured game skeleton */}
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 p-6 mb-12">
                                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                                        <div className="aspect-video rounded-xl bg-muted/30 animate-pulse"></div>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="h-8 bg-muted/30 rounded w-3/4 mb-3 animate-pulse"></div>
                                                <div className="h-4 bg-muted/20 rounded w-full mb-2 animate-pulse"></div>
                                                <div className="h-4 bg-muted/20 rounded w-5/6 animate-pulse"></div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-10 bg-muted/30 rounded w-24 animate-pulse"></div>
                                                <div className="h-10 bg-muted/30 rounded w-32 animate-pulse"></div>
                                                <div className="h-10 bg-muted/30 rounded w-28 animate-pulse"></div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-10 bg-muted/40 rounded w-32 animate-pulse"></div>
                                                <div className="h-10 bg-muted/30 rounded w-28 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Games grid skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden">
                                                <div className="w-full h-48 bg-muted/30" />
                                                <div className="p-4 space-y-3">
                                                    <div className="h-6 bg-muted/40 rounded" />
                                                    <div className="h-4 bg-muted/30 rounded w-3/4" />
                                                    <div className="flex gap-2">
                                                        <div className="h-6 bg-muted/30 rounded w-16" />
                                                        <div className="h-6 bg-muted/30 rounded w-20" />
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <div className="h-5 bg-muted/20 rounded w-12" />
                                                        <div className="h-5 bg-muted/20 rounded w-16" />
                                                        <div className="h-5 bg-muted/20 rounded w-14" />
                                                    </div>
                                                </div>
                                                <div className="p-4 pt-0">
                                                    <div className="h-10 bg-muted/30 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }>
                            <CategoryGameGrid category={category.toLowerCase()} />
                        </Suspense>
                    </div>
                </section>
            </div>
        </>
    )
}