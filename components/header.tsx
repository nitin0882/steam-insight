"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gamepad2, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SteamInsight</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Discover
            </Link>
            <Link
              href="/reviews"
              className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/reviews") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Reviews
            </Link>
            <Link
              href="/top-games"
              className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/top-games") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Top Games
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive("/categories") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Categories
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/50 border-border/50 focus:border-primary/50"
                />
              </form>
            </div>

            <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
              Sign In
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
                />
              </form>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Discover
                </Link>
                <Link
                  href="/reviews"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/reviews") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Reviews
                </Link>
                <Link
                  href="/top-games"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/top-games") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Top Games
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors py-2 whitespace-nowrap ${isActive("/categories") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Categories
                </Link>
              </nav>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
