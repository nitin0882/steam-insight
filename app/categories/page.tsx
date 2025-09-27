import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Calculator,
    Car,
    Crown,
    Gamepad2,
    Ghost,
    Puzzle,
    Swords,
    Target,
    TreePine,
    Trophy,
    Users,
    Zap
} from "lucide-react"
import { Metadata } from "next"
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
        color: "text-red-500"
    },
    {
        name: "RPG",
        icon: Crown,
        description: "Role-playing games with character progression",
        count: "1,800+",
        color: "text-purple-500"
    },
    {
        name: "Strategy",
        icon: Target,
        description: "Tactical games requiring planning and strategy",
        count: "1,200+",
        color: "text-blue-500"
    },
    {
        name: "Indie",
        icon: Zap,
        description: "Independent games from creative developers",
        count: "3,000+",
        color: "text-yellow-500"
    },
    {
        name: "Adventure",
        icon: TreePine,
        description: "Story-driven exploration games",
        count: "1,500+",
        color: "text-green-500"
    },
    {
        name: "Simulation",
        icon: Calculator,
        description: "Life and world simulation games",
        count: "800+",
        color: "text-cyan-500"
    },
    {
        name: "Racing",
        icon: Car,
        description: "High-speed racing and driving games",
        count: "400+",
        color: "text-orange-500"
    },
    {
        name: "Sports",
        icon: Trophy,
        description: "Sports simulation and arcade games",
        count: "300+",
        color: "text-emerald-500"
    },
    {
        name: "Puzzle",
        icon: Puzzle,
        description: "Brain-teasing puzzles and logic games",
        count: "600+",
        color: "text-pink-500"
    },
    {
        name: "Horror",
        icon: Ghost,
        description: "Scary and atmospheric horror games",
        count: "500+",
        color: "text-gray-500"
    },
    {
        name: "Multiplayer",
        icon: Users,
        description: "Games designed for multiple players",
        count: "1,000+",
        color: "text-indigo-500"
    },
    {
        name: "Arcade",
        icon: Gamepad2,
        description: "Classic arcade-style games",
        count: "700+",
        color: "text-violet-500"
    }
]

export default function CategoriesPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Game Categories</h1>
                    <p className="text-muted-foreground">
                        Explore Steam games by genre and find your next favorite game
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon
                        return (
                            <Link
                                key={category.name}
                                href={`/categories/${category.name.toLowerCase()}`}
                                className="block"
                            >
                                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-2 rounded-lg bg-muted/50 ${category.color}`}>
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </h3>
                                                <Badge variant="secondary" className="text-xs">
                                                    {category.count} games
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}