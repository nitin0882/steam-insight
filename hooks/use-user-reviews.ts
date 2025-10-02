import { UserReview } from "@/app/api/reviews/user/[steamid]/route"
import { useCallback, useEffect, useState } from "react"

interface UseUserReviewsReturn {
    reviews: UserReview[]
    isLoading: boolean
    error: string | null
    refetch: () => void
    loadMore: () => void
    hasMore: boolean
    total: number
    currentPage: number
    setPage: (page: number) => void
}

export function useUserReviews(steamId: string, itemsPerPage: number = 24, initialPage: number = 1): UseUserReviewsReturn {
    const [reviews, setReviews] = useState<UserReview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(initialPage)

    const fetchReviews = useCallback(async (page: number, append: boolean = false) => {
        try {
            if (!append) {
                setIsLoading(true)
            }
            setError(null)

            const url = new URL(`/api/reviews/user/${steamId}`, window.location.origin)
            url.searchParams.set("limit", itemsPerPage.toString())
            url.searchParams.set("page", page.toString())

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (data.reviews && Array.isArray(data.reviews)) {
                if (append) {
                    setReviews(prev => [...prev, ...data.reviews])
                } else {
                    setReviews(data.reviews)
                    setTotal(data.total || 0)
                }
                setHasMore(data.hasMore || false)
                console.log(`Loaded ${data.reviews.length} reviews for page ${page}, total available: ${data.total || 0}`)
            } else {
                throw new Error("Invalid response format")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch user reviews"
            console.error("Error fetching user reviews:", errorMessage)
            setError(errorMessage)
            if (!append) {
                setReviews([])
                setTotal(0)
                setHasMore(false)
            }
        } finally {
            if (!append) {
                setIsLoading(false)
            }
        }
    }, [steamId, itemsPerPage])

    const refetch = useCallback(() => {
        fetchReviews(currentPage)
    }, [fetchReviews, currentPage])

    const loadMore = useCallback(() => {
        if (hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchReviews(nextPage, true)
        }
    }, [hasMore, currentPage, fetchReviews])

    const setPage = useCallback((page: number) => {
        setCurrentPage(page)
        fetchReviews(page)
    }, [fetchReviews])

    useEffect(() => {
        if (steamId) {
            fetchReviews(currentPage)
        }
    }, [steamId, currentPage, fetchReviews])

    return {
        reviews,
        isLoading,
        error,
        refetch,
        loadMore,
        hasMore,
        total,
        currentPage,
        setPage,
    }
}