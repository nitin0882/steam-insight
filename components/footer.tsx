"use client"

import { Gamepad2, Github, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import { MotionEffect } from "./animate-ui/effects/motion-effect"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView
                        delay={0.1}
                    >
                        <div className="md:col-span-1">
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                                    <Gamepad2 className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-lg font-bold text-foreground">SteamInsight</span>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-4">
                                The ultimate platform for Steam game reviews and discovery. Find your next favorite game with authentic community reviews.
                            </p>
                            <div className="flex space-x-4">
                                <Link
                                    href="https://github.com/xi-Rick"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Github className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="mailto:contact@steaminsight.vercel.app"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Mail className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </MotionEffect>

                    {/* Navigate */}
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView
                        delay={0.2}
                    >
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Navigate</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Discover
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Reviews
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/top-games" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Top Games
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Categories
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </MotionEffect>

                    {/* Categories */}
                    <MotionEffect
                        slide={{
                            direction: 'up',
                        }}
                        fade
                        zoom
                        inView
                        delay={0.3}
                    >
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Popular Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/categories/action" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Action
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/rpg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        RPG
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/strategy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Strategy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/indie" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Indie
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </MotionEffect>


                </div>

                <MotionEffect
                    slide={{
                        direction: 'up',
                    }}
                    fade
                    zoom
                    inView
                    delay={0.4}
                >
                    <div className="border-t border-border/40 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                © {currentYear} SteamInsight. All rights reserved.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
                                Made with ❤️ for the gaming community
                            </p>
                        </div>
                    </div>
                </MotionEffect>
            </div>
        </footer>
    )
}