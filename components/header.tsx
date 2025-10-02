"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { useMenu } from "@/components/menu-context"
import { SearchDialog } from "@/components/search-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Gamepad2, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header({ transition = true }: { transition?: boolean }) {
  const { isMenuOpen, setIsMenuOpen } = useMenu()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <motion.header
      className={
        transition
          ? "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "absolute inset-0 z-40 w-full h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }
      layout
      initial={false}
      animate={transition ? "normal" : "center"}
      variants={{
        center: { height: "100vh" },
        normal: { height: "auto" },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${transition ? "" : "h-full flex items-center justify-center"}`}>
        <div className={`flex ${transition ? "h-16" : "h-auto"} items-center justify-between w-full`}>
          {/* Logo */}
          <motion.div
            layoutId="logo"
            className={transition ? "" : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"}
          >
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">SteamInsight</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {transition && (
            <nav className="hidden lg:flex items-center space-x-8">

              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.2}
              >
                <Link
                  href="/reviews"
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/reviews") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Reviews
                </Link>
              </MotionEffect>
              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.3}
              >
                <Link
                  href="/top-games"
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/top-games") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Top Games
                </Link>
              </MotionEffect>
              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.4}
              >
                <Link
                  href="/categories"
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/categories") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Categories
                </Link>
              </MotionEffect>
            </nav>
          )}

          {/* Search and Actions */}
          {transition && (
            <div className="flex items-center space-x-4">
              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.5}
              >
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search games..."
                      readOnly
                      onFocus={() => setIsSearchOpen(true)}
                      className="pl-10 w-64 bg-muted/50 border-border/50 focus:border-primary/50 cursor-pointer"
                    />
                  </div>
                </div>
              </MotionEffect>

              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.6}
              >
                <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                  Sign In
                </Button>
              </MotionEffect>

              {/* Mobile menu button */}
              <MotionEffect
                slide={{
                  direction: 'down',
                }}
                fade
                zoom
                inView
                delay={0.7}
              >
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </MotionEffect>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {transition && (
          <motion.div
            initial={{ maxHeight: 0 }}
            animate={{ maxHeight: isMenuOpen ? 500 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden border-t border-border/40 py-4 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  readOnly
                  onFocus={() => {
                    setIsSearchOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 cursor-pointer"
                />
              </div>
              <nav className="flex flex-col space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -10 }}
                  transition={{ delay: isMenuOpen ? 0.15 : 0, type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href="/reviews"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/reviews") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Reviews
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -10 }}
                  transition={{ delay: isMenuOpen ? 0.2 : 0, type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href="/top-games"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/top-games") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Top Games
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -10 }}
                  transition={{ delay: isMenuOpen ? 0.25 : 0, type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href="/categories"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/categories") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Categories
                  </Link>
                </motion.div>
              </nav>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </motion.header>
  )
}
