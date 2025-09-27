"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, X, Filter, Calendar, DollarSign, Star } from "lucide-react"

interface SearchFilters {
  priceRange: [number, number]
  ratingRange: [number, number]
  releaseYear: [number, number]
  genres: string[]
  features: string[]
  multiplayer: boolean
  earlyAccess: boolean
  freeToPlay: boolean
  onSale: boolean
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onReset: () => void
}

export function AdvancedSearchFilters({ filters, onFiltersChange, onReset }: AdvancedSearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const genres = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Sports",
    "Racing",
    "Puzzle",
    "Platformer",
    "Fighting",
    "Shooter",
    "Horror",
    "Survival",
    "Indie",
  ]

  const features = [
    "Single-player",
    "Multiplayer",
    "Co-op",
    "Online Co-op",
    "Local Co-op",
    "Cross-platform Multiplayer",
    "Steam Workshop",
    "Steam Cloud",
    "Controller Support",
    "VR Support",
    "HDR available",
    "Ray Tracing",
  ]

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]
    updateFilters({ genres: newGenres })
  }

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    updateFilters({ features: newFeatures })
  }

  const activeFiltersCount =
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0) +
    (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5 ? 1 : 0) +
    (filters.releaseYear[0] > 2000 || filters.releaseYear[1] < new Date().getFullYear() ? 1 : 0) +
    filters.genres.length +
    filters.features.length +
    (filters.multiplayer ? 1 : 0) +
    (filters.earlyAccess ? 1 : 0) +
    (filters.freeToPlay ? 1 : 0) +
    (filters.onSale ? 1 : 0)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Price Range</Label>
              </div>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>
            </div>

            {/* Rating Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Minimum Rating</Label>
              </div>
              <div className="px-3">
                <Slider
                  value={filters.ratingRange}
                  onValueChange={(value) => updateFilters({ ratingRange: value as [number, number] })}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.ratingRange[0].toFixed(1)} stars</span>
                  <span>{filters.ratingRange[1].toFixed(1)} stars</span>
                </div>
              </div>
            </div>

            {/* Release Year */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Release Year</Label>
              </div>
              <div className="px-3">
                <Slider
                  value={filters.releaseYear}
                  onValueChange={(value) => updateFilters({ releaseYear: value as [number, number] })}
                  min={2000}
                  max={new Date().getFullYear()}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{filters.releaseYear[0]}</span>
                  <span>{filters.releaseYear[1]}</span>
                </div>
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Filters</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="multiplayer"
                    checked={filters.multiplayer}
                    onCheckedChange={(checked) => updateFilters({ multiplayer: checked })}
                  />
                  <Label htmlFor="multiplayer" className="text-sm">
                    Multiplayer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="freeToPlay"
                    checked={filters.freeToPlay}
                    onCheckedChange={(checked) => updateFilters({ freeToPlay: checked })}
                  />
                  <Label htmlFor="freeToPlay" className="text-sm">
                    Free to Play
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="earlyAccess"
                    checked={filters.earlyAccess}
                    onCheckedChange={(checked) => updateFilters({ earlyAccess: checked })}
                  />
                  <Label htmlFor="earlyAccess" className="text-sm">
                    Early Access
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="onSale"
                    checked={filters.onSale}
                    onCheckedChange={(checked) => updateFilters({ onSale: checked })}
                  />
                  <Label htmlFor="onSale" className="text-sm">
                    On Sale
                  </Label>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Genres</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={filters.genres.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                    {filters.genres.includes(genre) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Features</Label>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                    {filters.features.includes(feature) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" onClick={onReset} className="w-full bg-transparent">
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
