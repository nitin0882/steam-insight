import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://steaminsight.vercel.app'

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/discover`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
    ]

    // Featured games (would be dynamic in a real app)
    const featuredGames = [
        { id: 1091500, name: 'cyberpunk-2077' },
        { id: 1174180, name: 'red-dead-redemption-2' },
        { id: 292030, name: 'the-witcher-3' },
        { id: 489830, name: 'skyrim-special-edition' },
        { id: 1245620, name: 'elden-ring' },
        { id: 271590, name: 'grand-theft-auto-v' },
    ]

    const gamePages = featuredGames.map((game) => ({
        url: `${baseUrl}/game/${game.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...staticPages, ...gamePages]
}