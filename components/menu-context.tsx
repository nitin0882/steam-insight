"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface MenuContextType {
    isMenuOpen: boolean
    setIsMenuOpen: (open: boolean) => void
    menuHeight: number
    setMenuHeight: (height: number) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuHeight, setMenuHeight] = useState(0)

    return (
        <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, menuHeight, setMenuHeight }}>
            {children}
        </MenuContext.Provider>
    )
}

export function useMenu() {
    const context = useContext(MenuContext)
    if (context === undefined) {
        throw new Error("useMenu must be used within a MenuProvider")
    }
    return context
}
