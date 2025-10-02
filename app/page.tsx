"use client"

import { Footer } from "@/components/footer"
import { GameDiscoveryGrid } from "@/components/game-discovery-grid"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [transition, setTransition] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTransition(true), 1250)
    return () => clearTimeout(timer)
  }, [])

  return (

    <main className="min-h-screen bg-background relative">
      <Header transition={transition} />
      {transition && (
        <>
          <HeroSection />
          <div className="relative z-10">
            <SearchSection />
            <GameDiscoveryGrid />
          </div>
          <Footer />
        </>
      )}
    </main>
  )
}
