"use client"

import { MotionEffect } from "@/components/animate-ui/effects/motion-effect"
import { GameDetails } from "@/components/game-details"
import { GameReviews } from "@/components/game-reviews"
import { RelatedGames } from "@/components/related-games"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

interface GamePageClientProps {
  gameId: number
}

function GameDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-3/4 mb-4 bg-card/50" />
          <Skeleton className="h-4 w-full mb-2 bg-card/50" />
          <Skeleton className="h-4 w-2/3 mb-6 bg-card/50" />
          <Skeleton className="h-64 w-full mb-6 bg-card/50" />
        </div>
        <div>
          <Skeleton className="h-48 w-full mb-4 bg-card/50" />
          <Skeleton className="h-32 w-full bg-card/50" />
        </div>
      </div>
    </div>
  )
}

function GameReviewsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6 bg-card/50" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full bg-card/50" />
        ))}
      </div>
    </div>
  )
}

function RelatedGamesSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6 bg-card/50" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full bg-card/50" />
        ))}
      </div>
    </div>
  )
}

export default function GamePageClient({ gameId }: GamePageClientProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Game Details */}
      <Suspense fallback={<GameDetailsSkeleton />}>
        <GameDetails gameId={gameId} />
      </Suspense>

      {/* Game Reviews with smooth reveal */}
      <MotionEffect
        slide={{
          direction: 'up',
        }}
        fade
        inView
        delay={0.2}
      >
        <Suspense fallback={<GameReviewsSkeleton />}>
          <GameReviews gameId={gameId} />
        </Suspense>
      </MotionEffect>

      {/* Related Games with delayed reveal */}
      <MotionEffect
        slide={{
          direction: 'up',
        }}
        fade
        inView
        delay={0.4}
      >
        <Suspense fallback={<RelatedGamesSkeleton />}>
          <RelatedGames gameId={gameId} />
        </Suspense>
      </MotionEffect>
    </main>
  )
}