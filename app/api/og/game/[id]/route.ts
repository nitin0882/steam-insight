import { getGameDetails } from '@/lib/steam-api'
import { NextRequest } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const gameId = Number.parseInt(params.id)

    if (isNaN(gameId)) {
        return new Response('Invalid game ID', { status: 400 })
    }

    try {
        const gameData = await getGameDetails(gameId)

        if (!gameData) {
            return new Response('Game not found', { status: 404 })
        }

        // For now, redirect to the game's header image from Steam
        // In a full production app, you'd generate a custom OG image
        if (gameData.header_image) {
            return Response.redirect(gameData.header_image, 302)
        }

        // Fallback text response
        return new Response(`Open Graph image for ${gameData.name}`, {
            headers: {
                'Content-Type': 'text/plain',
            },
        })
    } catch (error) {
        console.error('Error generating OG image:', error)
        return new Response('Error generating image', { status: 500 })
    }
}