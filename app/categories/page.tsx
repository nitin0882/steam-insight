import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Calculator,
    Car,
    Crown,
    Gamepad2,
    Ghost,
    Grid3X3,
    Puzzle,
    Swords,
    Target,
    TreePine,
    Trophy,
    Users,
    Zap
} from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Game Categories",
    description: "Explore Steam games by category. Browse action, RPG, strategy, indie, and more game genres to find your perfect match.",
}

const categories = [
    {
        name: "Action",
        icon: Swords,
        description: "Fast-paced games with combat and excitement",
        count: "2,500+",
        color: "text-red-500",
        bgGradient: "from-red-500/20 via-red-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg", // ELDEN RING
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg", // Counter-Strike 2
    },
    {
        name: "RPG",
        icon: Crown,
        description: "Role-playing games with character progression",
        count: "1,800+",
        color: "text-purple-500",
        bgGradient: "from-purple-500/20 via-purple-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg", // The Witcher 3
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg", // Baldur's Gate 3
    },
    {
        name: "Strategy",
        icon: Target,
        description: "Tactical games requiring planning and strategy",
        count: "1,200+",
        color: "text-blue-500",
        bgGradient: "from-blue-500/20 via-blue-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg", // RimWorld
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/813780/header.jpg", // Age of Empires II
    },
    {
        name: "Indie",
        icon: Zap,
        description: "Independent games from creative developers",
        count: "3,000+",
        color: "text-yellow-500",
        bgGradient: "from-yellow-500/20 via-yellow-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1818750/header.jpg", // Stray
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1794680/header.jpg", // Vampire Survivors
    },
    {
        name: "Adventure",
        icon: TreePine,
        description: "Story-driven exploration games",
        count: "1,500+",
        color: "text-green-500",
        bgGradient: "from-green-500/20 via-green-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg", // Red Dead Redemption 2
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1818750/header.jpg", // Stray
    },
    {
        name: "Simulation",
        icon: Calculator,
        description: "Life and world simulation games",
        count: "800+",
        color: "text-cyan-500",
        bgGradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1222670/header.jpg", // Manor Lords
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg", // RimWorld
    },
    {
        name: "Racing",
        icon: Car,
        description: "High-speed racing and driving games",
        count: "400+",
        color: "text-orange-500",
        bgGradient: "from-orange-500/20 via-orange-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/2206760/header.jpg", // F1 24
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg", // Forza Horizon 5
    },
    {
        name: "Sports",
        icon: Trophy,
        description: "Sports simulation and arcade games",
        count: "300+",
        color: "text-emerald-500",
        bgGradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1811260/header.jpg", // FIFA 23
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg", // EA SPORTS FC 24
    },
    {
        name: "Puzzle",
        icon: Puzzle,
        description: "Brain-teasing puzzles and logic games",
        count: "600+",
        color: "text-pink-500",
        bgGradient: "from-pink-500/20 via-pink-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg", // Among Us
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1097840/header.jpg", // Geometry Dash
    },
    {
        name: "Horror",
        icon: Ghost,
        description: "Scary and atmospheric horror games",
        count: "500+",
        color: "text-gray-500",
        bgGradient: "from-gray-500/20 via-gray-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1942110/header.jpg", // Lethal Company
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg", // Dead by Daylight
    },
    {
        name: "Multiplayer",
        icon: Users,
        description: "Games designed for multiple players",
        count: "1,000+",
        color: "text-indigo-500",
        bgGradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg", // Dota 2
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg", // Counter-Strike 2
    },
    {
        name: "Arcade",
        icon: Gamepad2,
        description: "Classic arcade-style games",
        count: "700+",
        color: "text-violet-500",
        bgGradient: "from-violet-500/20 via-violet-400/10 to-transparent",
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1794680/header.jpg", // Vampire Survivors
        representativeImage: "https://cdn.akamai.steamstatic.com/steam/apps/1097840/header.jpg", // Geometry Dash
    }
]

export default function CategoriesPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Floating background elements - Hidden on mobile for performance */}
                <div className="absolute inset-0 overflow-hidden hidden sm:block">
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
                                <Grid3X3 className="mr-2 h-4 w-4" />
                                Genre Discovery
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
                                <span className="text-balance">Game</span>
                                <br />
                                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                    Categories
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
                                Explore Steam games by category and genre. Browse action, RPG, strategy, indie,
                                and more game types to find your perfect match.
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
                                    <Gamepad2 className="h-4 w-4 mr-2 text-primary" />
                                    12 Categories
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <Trophy className="h-4 w-4 mr-2 text-primary" />
                                    Curated Selection
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2 text-sm bg-card/50 backdrop-blur-sm border-border/50">
                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                    All Genres
                                </Badge>
                            </div>
                        </MotionEffect>
                    </div>
                </div>
            </section>

            {/* Categories Grid Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <MotionEffect
                        slide={{ direction: 'up', offset: 100 }}
                        fade
                        inView
                        delay={0.2}
                    >
                        {/* Desktop Grid - 3-4 columns */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {categories.map((category, index) => {
                                const IconComponent = category.icon
                                return (
                                    <MotionEffect
                                        key={`desktop-${category.name}`}
                                        slide={{ direction: 'up', offset: 50 }}
                                        fade
                                        zoom={{ initialScale: 0.95, scale: 1 }}
                                        inView
                                        delay={0.1 + index * 0.08}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 120,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                    >
                                        <Link
                                            href={`/categories/${category.name.toLowerCase()}`}
                                            className="block group"
                                        >
                                            <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border-border/50 bg-card/30 backdrop-blur-lg hover:bg-card/60 h-80">
                                                {/* Background Image */}
                                                <div className="absolute inset-0 z-0">
                                                    <Image
                                                        src={category.headerImage}
                                                        alt={`${category.name} category`}
                                                        fill
                                                        className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 1200px) 50vw, 25vw"
                                                        loading={index < 6 ? "eager" : "lazy"}
                                                        placeholder="blur"
                                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                                    />
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} group-hover:opacity-80 transition-opacity duration-500`} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                                                </div>

                                                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className={`p-3 rounded-xl bg-background/80 backdrop-blur-sm ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                                                                <IconComponent className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                                                                    {category.name}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                                                            {category.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs bg-background/80 backdrop-blur-sm border border-border/50 group-hover:${category.color.replace('text-', 'bg-').replace('500', '500/20')} group-hover:border-current transition-all duration-300`}
                                                        >
                                                            {category.count} games
                                                        </Badge>

                                                        {/* Representative game thumbnail */}
                                                        <div className="relative w-16 h-9 rounded-md overflow-hidden border border-border/50 group-hover:scale-110 transition-transform duration-300">
                                                            <Image
                                                                src={category.representativeImage}
                                                                alt={`${category.name} representative game`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                                loading={index < 6 ? "eager" : "lazy"}
                                                                placeholder="blur"
                                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                {/* Hover glow effect */}
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${category.bgGradient} blur-xl`} />
                                            </Card>
                                        </Link>
                                    </MotionEffect>
                                )
                            })}
                        </div>

                        {/* Mobile Grid - 2 columns with unique staggered animation */}
                        <div className="md:hidden grid grid-cols-2 gap-4">
                            {categories.map((category, index) => {
                                const IconComponent = category.icon
                                const isEven = index % 2 === 0
                                return (
                                    <MotionEffect
                                        key={`mobile-${category.name}`}
                                        slide={{
                                            direction: isEven ? 'left' : 'right',
                                            offset: 30
                                        }}
                                        fade
                                        inView
                                        delay={0.1 + index * 0.05}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 150,
                                            damping: 30,
                                            mass: 0.5
                                        }}
                                    >
                                        <Link
                                            href={`/categories/${category.name.toLowerCase()}`}
                                            className="block group"
                                        >
                                            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 h-44">
                                                {/* Background Image - Lazy load for mobile */}
                                                <div className="absolute inset-0 z-0">
                                                    <Image
                                                        src={category.headerImage}
                                                        alt={`${category.name} category`}
                                                        fill
                                                        className="object-cover opacity-25 group-hover:opacity-30 transition-opacity duration-200"
                                                        sizes="50vw"
                                                        loading={index < 4 ? "eager" : "lazy"}
                                                        placeholder="blur"
                                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                                    />
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} group-hover:opacity-80 transition-opacity duration-200`} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                                                </div>

                                                <CardContent className="relative z-10 p-3 h-full flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`p-1.5 rounded-lg bg-background/90 backdrop-blur-sm ${category.color} group-hover:scale-105 transition-transform duration-150`}>
                                                                <IconComponent className="h-3 w-3" />
                                                            </div>
                                                            <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                                                {category.name}
                                                            </h3>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-200">
                                                            {category.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-xs bg-background/90 backdrop-blur-sm border border-border/50 group-hover:${category.color.replace('text-', 'bg-').replace('500', '500/20')} group-hover:border-current transition-all duration-200 px-1.5 py-0.5`}
                                                        >
                                                            {category.count}
                                                        </Badge>

                                                        {/* Representative game thumbnail - Lazy load */}
                                                        <div className="relative w-10 h-6 rounded overflow-hidden border border-border/50 group-hover:scale-105 transition-transform duration-150">
                                                            <Image
                                                                src={category.representativeImage}
                                                                alt={`${category.name} representative game`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                                loading={index < 4 ? "eager" : "lazy"}
                                                                placeholder="blur"
                                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                {/* Simplified hover glow effect */}
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200 bg-gradient-to-br ${category.bgGradient} blur-sm`} />
                                            </Card>
                                        </Link>
                                    </MotionEffect>
                                )
                            })}
                        </div>
                    </MotionEffect>
                </div>
            </section>

            {/* Additional Features Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-muted/30 to-background">
                <div className="container mx-auto text-center">
                    <MotionEffect
                        slide={{ direction: 'up' }}
                        fade
                        zoom
                        inView
                        delay={0.2}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-foreground">
                            Discover Your Next Adventure
                        </h2>
                    </MotionEffect>

                    <MotionEffect
                        slide={{ direction: 'up' }}
                        fade
                        inView
                        delay={0.4}
                    >
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Each category features hand-picked games with instant loading and detailed information.
                            No more waiting for API calls - just pure gaming discovery.
                        </p>
                    </MotionEffect>
                </div>
            </section>
        </main>
    )
}