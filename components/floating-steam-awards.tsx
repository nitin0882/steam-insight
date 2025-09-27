"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// First 12 awards for floating animation (most recognizable ones)
const FLOATING_AWARDS = [
    { id: 1, name: "Deep Thoughts", path: "/steam-awards/animated/1.png" },
    { id: 2, name: "Hilarious", path: "/steam-awards/animated/2.png" },
    { id: 3, name: "Hot Take", path: "/steam-awards/animated/3.png" },
    { id: 8, name: "Wholesome", path: "/steam-awards/animated/8.png" },
    { id: 10, name: "Mind Blown", path: "/steam-awards/animated/10.png" },
    { id: 11, name: "Golden Unicorn", path: "/steam-awards/animated/11.png" },
    { id: 13, name: "Clever", path: "/steam-awards/animated/13.png" },
    { id: 17, name: "Take My Points", path: "/steam-awards/animated/17.png" },
    { id: 19, name: "Jester", path: "/steam-awards/animated/19.png" },
    { id: 20, name: "Fancy Pants", path: "/steam-awards/animated/20.png" },
    { id: 22, name: "Super Star", path: "/steam-awards/animated/22.png" },
    { id: 23, name: "Heartwarming", path: "/steam-awards/animated/23.png" }
] as const

interface FloatingAward {
    id: number
    x: number
    y: number
    scale: number
    duration: number
    delay: number
    award: {
        id: number
        name: string
        path: string
    }
}

export function FloatingSteamAwards() {
    const [awards, setAwards] = useState<FloatingAward[]>([])
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    useEffect(() => {
        if (dimensions.width === 0) return

        // Generate floating awards with random positions
        const generateAwards = (): FloatingAward[] => {
            const isMobile = dimensions.width < 768
            const isTablet = dimensions.width < 1024
            const awardCount = isMobile ? 5 : isTablet ? 7 : 9 // Responsive count

            return Array.from({ length: awardCount }, (_, index) => {
                const award = FLOATING_AWARDS[index % FLOATING_AWARDS.length]

                // Ensure awards are positioned away from center content area
                const centerBuffer = isMobile ? 100 : 200
                let x, y

                do {
                    x = Math.random() * (dimensions.width - 150)
                    y = Math.random() * (dimensions.height - 150)
                } while (
                    x > dimensions.width / 2 - centerBuffer &&
                    x < dimensions.width / 2 + centerBuffer &&
                    y > dimensions.height / 2 - centerBuffer &&
                    y < dimensions.height / 2 + centerBuffer
                )

                return {
                    id: index,
                    x,
                    y,
                    scale: isMobile ? 0.5 + Math.random() * 0.3 : 0.6 + Math.random() * 0.4, // Bigger and more visible
                    duration: 20 + Math.random() * 15, // Slower, more relaxed movement
                    delay: Math.random() * 15,
                    award
                }
            })
        }

        setAwards(generateAwards())
    }, [dimensions])

    if (awards.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {awards.map((floatingAward) => (
                <motion.div
                    key={floatingAward.id}
                    className="absolute opacity-25 hover:opacity-70 transition-opacity duration-500"
                    initial={{
                        x: floatingAward.x,
                        y: floatingAward.y,
                        scale: floatingAward.scale,
                        rotate: 0,
                        opacity: 0,
                    }}
                    animate={{
                        x: [
                            floatingAward.x,
                            floatingAward.x + (Math.random() - 0.5) * 150,
                            floatingAward.x + (Math.random() - 0.5) * 120,
                            floatingAward.x
                        ],
                        y: [
                            floatingAward.y,
                            floatingAward.y + (Math.random() - 0.5) * 100,
                            floatingAward.y + (Math.random() - 0.5) * 130,
                            floatingAward.y
                        ],
                        rotate: [0, 3, -3, 0],
                        scale: [
                            floatingAward.scale,
                            floatingAward.scale * 1.05,
                            floatingAward.scale * 0.95,
                            floatingAward.scale
                        ],
                        opacity: 0.25,
                    }}
                    transition={{
                        opacity: {
                            duration: 1.5,
                            delay: floatingAward.delay * 0.3, // Staggered fade-in
                            ease: "easeOut"
                        },
                        x: {
                            duration: floatingAward.duration,
                            delay: floatingAward.delay + 1.5, // Start floating after fade-in
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        y: {
                            duration: floatingAward.duration,
                            delay: floatingAward.delay + 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        rotate: {
                            duration: floatingAward.duration,
                            delay: floatingAward.delay + 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        scale: {
                            duration: floatingAward.duration,
                            delay: floatingAward.delay + 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <motion.img
                        src={floatingAward.award.path}
                        alt={floatingAward.award.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 drop-shadow-xl filter brightness-110 contrast-110"
                        whileHover={{
                            scale: 1.3,
                            rotate: 15,
                            opacity: 0.9,
                            transition: { duration: 0.3 }
                        }}
                        loading="lazy"
                    />
                </motion.div>
            ))}
        </div>
    )
}