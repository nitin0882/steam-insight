"use client"
import { useCallback } from "react"
import useSWR from "swr"

interface TrendingGame {
    id: number
    name: string
    type?: string
    image: string
    rating: number | null
    reviewCount: number
    price: string
    tags: string[]
    releaseDate: string
    description: string
    screenshots: Array<{ id: number; path_thumbnail: string; path_full: string }>
    movies: Array<{ id: number; name: string; thumbnail: string }>
    developers: string[]
    publishers: string[]
}

interface TrendingApiResponse {
    success: boolean
    data: TrendingGame[]
    count: number
    source?: string
    algorithm?: string
    error?: string
    message?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTrendingGames(limit = 20) {
    const { data, error, isLoading, mutate } = useSWR<TrendingApiResponse>(
        `/api/games/trending?limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes - trending data doesn't change very often
            errorRetryCount: 3,
            errorRetryInterval: 2000,
        }
    )

    const refresh = useCallback(() => {
        mutate()
    }, [mutate])

    return {
        games: data?.data || [],
        isLoading,
        error: error || (data && !data.success ? data.error : null),
        source: data?.source || "unknown",
        algorithm: data?.algorithm || "unknown",
        message: data?.message,
        refetch: refresh,
        count: data?.count || 0,
        success: data?.success || false,
    }
}