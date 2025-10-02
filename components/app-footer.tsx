"use client"

import { Footer } from "@/components/footer"
import { usePathname } from "next/navigation"

export function AppFooter() {
    const pathname = usePathname()
    if (pathname === "/") return null
    return <Footer />
}