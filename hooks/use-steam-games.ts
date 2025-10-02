"use client"
import { useCallback, useEffect, useState } from "react"
import useSWR from "swr"

interface Game {
  id: number
  name: string
  image: string
  rating: number | null
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
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, error, isLoading } = useSWR<ApiResponse>(`/api/games/popular?limit=${limit}&refresh=${refreshKey}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
  })

  const refetchWithNewGames = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return {
    games: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    refetch: refetchWithNewGames,
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
  const [allGames, setAllGames] = useState<Game[]>([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const mainCategoryMap: Record<string, string> = {
    popular: 'popular',
    trending: 'trending',
    'top-rated': 'top-rated',
    new: 'new-releases',
  }

  // Include offset in the cache key so SWR treats different pages as different cache entries
  const cacheKey = `games-category-${category}-${limit}-${currentOffset}`

  const { data, error, isLoading, mutate } = useSWR<ApiResponse & { hasMore?: boolean; total?: number }>(
    cacheKey,
    () => {
      // Custom fetcher that uses current offset
      const mainEndpoint = mainCategoryMap[category]
      const apiUrl = mainEndpoint
        ? `/api/games/${mainEndpoint}?limit=${limit}&offset=${currentOffset}`
        : `/api/games/category/${category}?limit=${limit}&offset=${currentOffset}`

      return fetch(apiUrl).then((res) => res.json())
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      refreshInterval: 0, // No automatic refresh
      revalidateOnMount: true, // Always revalidate on mount
      revalidateIfStale: true, // Revalidate if data is stale
      fallbackData: { success: true, data: [], count: 0, hasMore: true }, // Provide fallback to prevent undefined
    }
  )

  // Update accumulated games when new data arrives
  useEffect(() => {
    if (data?.data && data.success) {
      if (currentOffset === 0) {
        // First load - replace all games
        setAllGames(data.data)
        setIsRefreshing(false) // Refresh complete
      } else {
        // Loading more - append to existing games
        setAllGames(prev => [...prev, ...data.data])
      }
      setHasMore(data.hasMore ?? false)
      setIsLoadingMore(false)
    }
  }, [data, currentOffset])

  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true)
      setCurrentOffset(prev => prev + limit)
    }
  }, [isLoading, isLoadingMore, hasMore, limit])

  const resetAndRefetch = useCallback(() => {
    setIsRefreshing(true)
    setCurrentOffset(0)
    setAllGames([])
    setHasMore(true)
    setIsLoadingMore(false)
    mutate()
  }, [mutate])

  return {
    games: allGames,
    isLoading: isLoading && currentOffset === 0, // Only show loading for initial load
    isLoadingMore,
    isRefreshing,
    error: error || (data && !data.success ? data.error : null),
    hasMore,
    loadMore,
    refetch: resetAndRefetch,
  }
}

export function useSearchInCategory(category: string, searchQuery: string, limit = 20) {
  const shouldFetch = category && searchQuery.trim().length > 0

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    shouldFetch ? `/api/games/category/${category}?search=${encodeURIComponent(searchQuery)}&limit=${limit}` : null,
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