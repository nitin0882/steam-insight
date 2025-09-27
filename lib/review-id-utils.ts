import { createHash } from "crypto"

// Review ID utilities for generating and parsing unique review identifiers

export interface ReviewIdComponents {
    hash: string
    prefix: string
    gameId: number
}

export interface ReviewMetadata {
    id: string
    hash: string
    gameId: number
    isValid: boolean
}

/**
 * Generate a stable, unique ID for a review based on its properties
 * @param review - The Steam review object
 * @param gameId - The Steam app ID of the game
 * @returns A unique review ID in format "rv_[gameId]_[12-char-hash]"
 */
export function generateReviewId(review: {
    recommendationid: string
    author: { steamid: string }
    timestamp_created: number
    review: string
}, gameId: number): string {
    // Create a hash based on stable review properties
    const hashInput = [
        review.recommendationid,
        review.author.steamid,
        gameId.toString(),
        review.timestamp_created.toString(),
        review.review.substring(0, 100) // First 100 chars of review for uniqueness
    ].join('|')

    // Create a short, URL-friendly hash
    const hash = createHash('sha256').update(hashInput).digest('hex')
    return `rv_${gameId}_${hash.substring(0, 12)}` // rv_ prefix + gameId + _ + 12 char hash
}

/**
 * Parse a review ID to extract its components
 * @param reviewId - The review ID to parse
 * @returns Object with hash, prefix, and gameId, or null if invalid
 */
export function parseReviewId(reviewId: string): ReviewIdComponents | null {
    if (!reviewId || typeof reviewId !== 'string') {
        return null
    }

    const match = reviewId.match(/^rv_(\d+)_([a-f0-9]{12})$/)
    if (!match) {
        return null
    }

    return {
        prefix: 'rv_',
        gameId: parseInt(match[1], 10),
        hash: match[2]
    }
}

/**
 * Validate if a string is a valid review ID
 * @param reviewId - The string to validate
 * @returns True if valid review ID format
 */
export function isValidReviewId(reviewId: string): boolean {
    return parseReviewId(reviewId) !== null
}

/**
 * Generate a shortened version of the review ID for display purposes
 * @param reviewId - The full review ID
 * @returns Shortened ID (e.g., "rv_abc123...")
 */
export function shortenReviewId(reviewId: string, length: number = 10): string {
    const parsed = parseReviewId(reviewId)
    if (!parsed) return reviewId

    return `${parsed.prefix}${parsed.hash.substring(0, Math.max(1, length - 3))}...`
}

/**
 * Create a shareable URL for a review
 * @param reviewId - The unique review ID
 * @param baseUrl - The base URL of the application (optional)
 * @returns Full URL to the review
 */
export function createReviewUrl(reviewId: string, baseUrl?: string): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    return `${base}/reviews/${reviewId}`
}

/**
 * Extract game ID and other metadata that might be encoded in review context
 * @param reviewId - The review ID
 * @returns Metadata object
 */
export function extractReviewMetadata(reviewId: string): ReviewMetadata {
    const parsed = parseReviewId(reviewId)
    if (!parsed) return { id: reviewId, hash: '', gameId: 0, isValid: false }

    return {
        id: reviewId,
        hash: parsed.hash,
        gameId: parsed.gameId,
        isValid: true
    }
}

/**
 * Generate multiple review IDs at once
 * @param reviews - Array of review objects
 * @param gameId - The Steam app ID
 * @returns Array of objects with review and its generated ID
 */
export function generateReviewIds<T extends {
    recommendationid: string
    author: { steamid: string }
    timestamp_created: number
    review: string
}>(reviews: T[], gameId: number): Array<T & { unique_id: string }> {
    return reviews.map(review => ({
        ...review,
        unique_id: generateReviewId(review, gameId)
    }))
}

// Export types for use elsewhere
export type ReviewWithId<T> = T & { unique_id: string }