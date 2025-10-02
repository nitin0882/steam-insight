"use client"
import { useCallback } from "react"
import useSWR from "swr"

interface TopRatedGame {
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

interface TopRatedApiResponse {
    success: boolean
    data: TopRatedGame[]
    count: number
    source?: string
    fallback?: boolean
    error?: string
    message?: string
}

const fetcher = async (url: string): Promise<TopRatedApiResponse> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout - please try again')
        }
        throw error
    }
}

export function useTopRatedGames(limit = 20) {
    const { data, error, isLoading, mutate } = useSWR<TopRatedApiResponse>(
        `/api/games/top-rated?limit=${limit}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 300000, // 5 minutes
            errorRetryCount: 3, // Increased from 2 to 3
            errorRetryInterval: 2000,
            // Exponential backoff retry logic
            onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                // Stop retrying if we exceed max retries
                if (retryCount >= 3) return

                // Stop retrying for certain error types
                if (error?.status === 404) return

                // Exponential backoff with jitter
                const baseDelay = Math.min(1000 * (2 ** retryCount), 10000)
                const jitter = Math.random() * 0.3 * baseDelay
                const delay = baseDelay + jitter

                console.log(`Retrying top-rated games API in ${Math.round(delay)}ms (attempt ${retryCount + 1}/3)`)

                setTimeout(() => revalidate({ retryCount }), delay)
            },
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