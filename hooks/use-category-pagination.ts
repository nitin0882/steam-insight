"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
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
    category?: string
    searchQuery?: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCategoryPagination(category: string, searchQuery: string = "", itemsPerPage: number = 20) {
    const [currentPage, setCurrentPage] = useState(1)
    const [allGames, setAllGames] = useState<Game[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // Calculate total items we want to fetch for this page
    const totalItemsToFetch = currentPage * itemsPerPage

    // Build API URL
    const apiUrl = useMemo(() => {
        const baseUrl = searchQuery.trim()
            ? `/api/games/category/${category}?search=${encodeURIComponent(searchQuery)}&limit=${totalItemsToFetch}`
            : `/api/games/category/${category}?limit=${totalItemsToFetch}`
        return baseUrl
    }, [category, searchQuery, totalItemsToFetch])

    const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
        apiUrl,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes
            onSuccess: (data) => {
                if (data?.data) {
                    setAllGames(data.data)
                }
            }
        }
    )

    // Current page games
    const currentPageGames = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return allGames.slice(0, endIndex)
    }, [allGames, currentPage, itemsPerPage])

    // Check if we can load more
    const canLoadMore = useMemo(() => {
        return data?.data && data.data.length >= totalItemsToFetch && data.data.length % itemsPerPage === 0
    }, [data?.data, totalItemsToFetch, itemsPerPage])

    // Load more function
    const loadMore = useCallback(async () => {
        if (canLoadMore && !isLoadingMore) {
            setIsLoadingMore(true)
            setCurrentPage(prev => prev + 1)
            // The SWR will automatically refetch with the new URL
            setTimeout(() => setIsLoadingMore(false), 1000) // Minimum loading time for UX
        }
    }, [canLoadMore, isLoadingMore])

    // Reset function
    const reset = useCallback(() => {
        setCurrentPage(1)
        setAllGames([])
        mutate()
    }, [mutate])

    // Reset when search query changes
    useEffect(() => {
        setCurrentPage(1)
        setAllGames([])
    }, [searchQuery, category])

    return {
        games: currentPageGames,
        isLoading: isLoading || (currentPage === 1 && allGames.length === 0),
        isLoadingMore,
        error: error || (data && !data.success ? data.error : null),
        canLoadMore,
        loadMore,
        reset,
        currentPage,
        totalGames: allGames.length,
        hasSearchQuery: searchQuery.trim().length > 0
    }
}