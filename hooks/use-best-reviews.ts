import { BestReview } from "@/app/api/reviews/best/route"
import { useCallback, useEffect, useState } from "react"

interface UseBestReviewsReturn {
    reviews: BestReview[]
    isLoading: boolean
    error: string | null
    refetch: () => void
    total: number
}

export function useBestReviews(limit: number = 20): UseBestReviewsReturn {
    const [reviews, setReviews] = useState<BestReview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`/api/reviews/best?limit=${limit}`, {
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
                setReviews(data.reviews)
                setTotal(data.total || data.reviews.length)
            } else {
                throw new Error("Invalid response format")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch reviews"
            console.error("Error fetching best reviews:", errorMessage)
            setError(errorMessage)
            setReviews([])
            setTotal(0)
        } finally {
            setIsLoading(false)
        }
    }, [limit])

    const refetch = useCallback(() => {
        fetchReviews()
    }, [fetchReviews])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    return {
        reviews,
        isLoading,
        error,
        refetch,
        total,
    }
}