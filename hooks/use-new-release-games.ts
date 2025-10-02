"use client"
import { useCallback } from "react"
import useSWR from "swr"

interface NewReleaseGame {
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

interface NewReleaseApiResponse {
    success: boolean
    data: NewReleaseGame[]
    count: number
    source?: string
    fallback?: boolean
    error?: string
    message?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useNewReleaseGames(limit = 20) {
    const { data, error, isLoading, mutate } = useSWR<NewReleaseApiResponse>(
        `/api/games/new-releases?limit=${limit}`,
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
        source: data?.source || "unknown",
        message: data?.message,
        refetch: refresh,
        count: data?.count || 0,
    }
}