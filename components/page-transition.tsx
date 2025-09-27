"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type React from "react"

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}