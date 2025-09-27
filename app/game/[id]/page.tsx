import { GameDetails } from "@/components/game-details"
import { GameReviews } from "@/components/game-reviews"
import { RelatedGames } from "@/components/related-games"
import { Skeleton } from "@/components/ui/skeleton"
import { getGameDetails } from "@/lib/steam-api"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface GamePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const gameId = Number.parseInt(params.id)

  if (isNaN(gameId)) {
    return {
      title: "Invalid Game | SteamInsight",
      description: "The requested game ID is invalid.",
    }
  }

  try {
    const gameData = await getGameDetails(gameId)

    if (!gameData) {
      return {
        title: "Game Not Found | SteamInsight",
        description: "The requested game could not be found on SteamInsight.",
      }
    }

    const rating = gameData.metacritic?.score ? gameData.metacritic.score / 20 : 0
    const reviewCount = gameData.recommendations?.total || 0
    const price = gameData.price_overview?.final_formatted || "Free"
    const developer = "Steam Game" // We'll extract this from other fields if needed

    return {
      title: `${gameData.name} - Steam Reviews & Details | SteamInsight`,
      description: `${gameData.short_description || 'Discover this amazing game'} Read ${reviewCount.toLocaleString()} community reviews and find the best price for ${gameData.name}.`,
      keywords: [
        gameData.name.toLowerCase(),
        "steam review",
        "pc gaming",
        developer.toLowerCase(),
        "game review",
        "gaming community",
        ...(gameData.genres?.map(g => g.description.toLowerCase()) || [])
      ],
      openGraph: {
        title: `${gameData.name} - Steam Reviews & Details`,
        description: gameData.short_description || `Discover ${gameData.name} with community reviews and detailed analysis.`,
        type: "article",
        url: `https://steaminsight.vercel.app/game/${gameId}`,
        images: [
          {
            url: gameData.header_image || `https://steaminsight.vercel.app/api/og/game/${gameId}`,
            width: 1200,
            height: 630,
            alt: `${gameData.name} game cover`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${gameData.name} - Steam Reviews & Details`,
        description: gameData.short_description || `Discover ${gameData.name} with community reviews.`,
        images: [gameData.header_image || `https://steaminsight.vercel.app/api/og/game/${gameId}`],
      },
      alternates: {
        canonical: `https://steaminsight.vercel.app/game/${gameId}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for game:', gameId, error)
    return {
      title: "Game Details | SteamInsight",
      description: "Explore game reviews and details on SteamInsight.",
    }
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const gameId = Number.parseInt(params.id)

  if (isNaN(gameId)) {
    notFound()
  }

  // We'll let the individual components handle their own data fetching
  // This allows for better loading states and error handling
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<GameDetailsSkeleton />}>
        <GameDetails gameId={gameId} />
      </Suspense>

      <Suspense fallback={<GameReviewsSkeleton />}>
        <GameReviews gameId={gameId} />
      </Suspense>

      <Suspense fallback={<RelatedGamesSkeleton />}>
        <RelatedGames gameId={gameId} />
      </Suspense>
    </main>
  )
}

function GameDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
        </div>
        <div>
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}

function GameReviewsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

function RelatedGamesSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}
