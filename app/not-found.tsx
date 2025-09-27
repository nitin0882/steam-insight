import { Button } from "@/components/ui/button"
import { GamepadIcon, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto">
                    {/* 404 Animation */}
                    <div className="mb-8">
                        <div className="relative">
                            <div className="text-9xl font-bold text-primary/20 select-none">404</div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GamepadIcon className="h-16 w-16 text-primary animate-bounce" />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Game Not Found
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                        Looks like this game has respawned elsewhere! The page you&apos;re looking for doesn&apos;t exist
                        or may have been moved to a different level.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="min-w-48">
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Return Home
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="min-w-48">
                            <Link href="/">
                                <Search className="mr-2 h-5 w-5" />
                                Search Games
                            </Link>
                        </Button>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-12 p-6 rounded-lg border border-border/50 bg-muted/30">
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                            What you can do:
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Check the URL for typos</li>
                            <li>• Use the search to find the game you&apos;re looking for</li>
                            <li>• Browse our featured games on the homepage</li>
                            <li>• Discover new games in different categories</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}