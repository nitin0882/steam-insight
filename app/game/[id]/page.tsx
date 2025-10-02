import { getGameDetails } from "@/lib/steam-api"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import GamePageClient from "./GamePageClient"

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

  return <GamePageClient gameId={gameId} />
}