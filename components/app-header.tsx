"use client"

import { Header } from "@/components/header"
import { usePathname } from "next/navigation"

export function AppHeader() {
    const pathname = usePathname()
    if (pathname === "/") return null
    return <Header />
}