import { Metadata } from "next"
import UserReviewsClient from "./UserReviewsClient"

interface PageProps {
    params: { steamid: string }
    searchParams: { page?: string }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const steamId = params.steamid
    const page = parseInt(searchParams.page || "1")

    try {
        // Fetch user info and review count by calling the API with limit 1
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        const apiUrl = `${baseUrl}/api/reviews/user/${steamId}?limit=1&page=1`

        console.log(`[Metadata] Fetching user data for ${steamId} from: ${apiUrl}`)

        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout
            signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!response.ok) {
            console.error(`[Metadata] API request failed: ${response.status} ${response.statusText}`)
            throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        // API node checker - validate response structure
        if (!data || typeof data !== 'object') {
            console.error('[Metadata] Invalid API response: not an object', data)
            throw new Error('Invalid API response format')
        }

        if (!data.reviews || !Array.isArray(data.reviews)) {
            console.warn('[Metadata] API response missing reviews array', data)
        }

        if (typeof data.total !== 'number') {
            console.warn('[Metadata] API response missing or invalid total count', data.total)
        }

        const userInfo = data.reviews?.[0]?.author
        const totalReviews = data.total || 0

        console.log(`[Metadata] Retrieved user info: ${userInfo?.personaname || 'Unknown'}, total reviews: ${totalReviews}`)

        const userName = userInfo?.personaname || `Steam User ${steamId.slice(-6)}`
        const title = page > 1
            ? `${userName}'s Reviews (${totalReviews}) - Page ${page} | Steam Scope`
            : `${userName}'s Reviews (${totalReviews}) | Steam Scope`
        const description = `Read all ${totalReviews} reviews written by ${userName} on Steam. Discover their gaming opinions and recommendations.`

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: "profile",
                url: `${baseUrl}/reviews/user/${steamId}${page > 1 ? `?page=${page}` : ""}`,
            },
            twitter: {
                card: "summary",
                title,
                description,
            },
        }
    } catch (error) {
        console.error("[Metadata] Error generating metadata:", error)
        return {
            title: `User Reviews | Steam Scope`,
            description: `Read reviews written by Steam user ${steamId}`,
        }
    }
}

export default function UserReviewsPage({ params, searchParams }: PageProps) {
    const steamId = params.steamid
    const page = parseInt(searchParams.page || "1")

    return <UserReviewsClient steamId={steamId} page={page} />
}

