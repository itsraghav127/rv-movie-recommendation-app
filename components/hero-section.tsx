"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Play, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface HeroSectionProps {
  movies: Movie[]
  isLoading?: boolean
}

export function HeroSection({ movies, isLoading = false }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const { isInWatchlist, toggleWatchlist } = usePreferences()

  React.useEffect(() => {
    if (movies.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(movies.length, 5))
    }, 8000)
    return () => clearInterval(timer)
  }, [movies.length])

  if (isLoading || movies.length === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full bg-muted">
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <Skeleton className="mb-4 h-12 w-3/4 max-w-xl" />
          <Skeleton className="mb-2 h-6 w-1/2 max-w-md" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>
    )
  }

  const featuredMovies = movies.slice(0, 5)
  const activeMovie = featuredMovies[activeIndex]
  const inWatchlist = isInWatchlist(activeMovie.imdbID)

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      {featuredMovies.map((movie, index) => (
        <div
          key={movie.imdbID}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        >
          {movie.Poster && movie.Poster !== "N/A" && (
            <Image
              src={movie.Poster || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          )}
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="max-w-3xl">
          {/* Rating */}
          {activeMovie.imdbRating && activeMovie.imdbRating !== "N/A" && (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="text-sm font-semibold text-gold">{activeMovie.imdbRating}</span>
              </div>
              {activeMovie.Year && <span className="text-sm text-muted-foreground">{activeMovie.Year}</span>}
              {activeMovie.Runtime && activeMovie.Runtime !== "N/A" && (
                <span className="text-sm text-muted-foreground">{activeMovie.Runtime}</span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            {activeMovie.Title}
          </h1>

          {/* Genre Tags */}
          {activeMovie.Genre && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeMovie.Genre.split(", ")
                .slice(0, 3)
                .map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          )}

          {/* Plot */}
          {activeMovie.Plot && activeMovie.Plot !== "N/A" && (
            <p className="mb-6 line-clamp-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {activeMovie.Plot}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href={`/movie/${activeMovie.imdbID}`}>
                <Play className="h-5 w-5" />
                View Details
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2" onClick={() => toggleWatchlist(activeMovie.imdbID)}>
              {inWatchlist ? (
                <>
                  <Check className="h-5 w-5" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="mt-8 flex gap-2">
          {featuredMovies.map((movie, index) => (
            <button
              key={movie.imdbID}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === activeIndex ? "w-8 bg-primary" : "w-4 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`View ${movie.Title}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
