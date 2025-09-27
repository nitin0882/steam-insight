import { GameDiscoveryGrid } from "@/components/game-discovery-grid"
import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative">
      <HeroSection />
      <div className="relative z-10">
        <SearchSection />
        <GameDiscoveryGrid />
      </div>
    </main>
  )
}
