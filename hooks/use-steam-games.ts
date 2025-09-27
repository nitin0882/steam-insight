"use client"
import useSWR from "swr"

interface Game {
  id: number
  name: string
  image: string
  rating: number
  reviewCount: number
  price: string
  tags: string[]
  releaseDate: string
  description: string
}

interface ApiResponse {
  success: boolean
  data: Game[]
  count: number
  error?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePopularGames(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(`/api/games/popular?limit=${limit}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  })

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useSearchGames(query: string, limit = 20) {
  const shouldFetch = query.trim().length > 0

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    shouldFetch ? `/api/games/search?q=${encodeURIComponent(query)}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  )

  return {
    games: data?.data || [],
    isLoading: shouldFetch ? isLoading : false,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useGameReviews(gameId: number, cursor = "*") {
  const { data, error, isLoading, mutate } = useSWR(
    gameId ? `/api/games/${gameId}/reviews?cursor=${cursor}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    reviews: data?.data || [],
    cursor: data?.cursor || "",
    summary: data?.summary || {},
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useTrendingGames(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(`/api/games/trending?limit=${limit}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  })

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useTopRatedGames(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(`/api/games/top-rated?limit=${limit}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  })

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useNewReleases(limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(`/api/games/new-releases?limit=${limit}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  })

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useGamesByCategory(category: string, limit = 20) {
  const mainCategoryMap: Record<string, string> = {
    popular: 'popular',
    trending: 'trending',
    'top-rated': 'top-rated',
    new: 'new-releases',
  }

  // Determine the API endpoint based on category type
  const mainEndpoint = mainCategoryMap[category]
  const apiUrl = mainEndpoint
    ? `/api/games/${mainEndpoint}?limit=${limit}`
    : `/api/games/category/${category}?limit=${limit}`

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}

export function useRelatedGames(gameId: number, limit = 8) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    gameId ? `/api/games/${gameId}/related?limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  )

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: mutate,
  }
}