"use client"
import { useCallback } from "react"
import useSWR from "swr"

interface PopularGame {
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

interface PopularApiResponse {
    success: boolean
    data: PopularGame[]
    count: number
    fallback?: boolean
    error?: string
    message?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePopularGames(limit = 20) {
    const { data, error, isLoading, mutate } = useSWR<PopularApiResponse>(
        `/api/games/popular?limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes
            errorRetryCount: 2,
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
        isUsingFallback: data?.fallback || false,
        message: data?.message,
        refetch: refresh,
        count: data?.count || 0,
    }
}