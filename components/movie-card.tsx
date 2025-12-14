"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Check, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface MovieCardProps {
  movie: Movie
  className?: string
  priority?: boolean
  showActions?: boolean
}

export function MovieCard({ movie, className, priority = false, showActions = true }: MovieCardProps) {
  const { isInWatchlist, isLiked, toggleWatchlist, toggleLiked } = usePreferences()
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const inWatchlist = isInWatchlist(movie.imdbID)
  const liked = isLiked(movie.imdbID)
  const hasValidPoster = movie.Poster && movie.Poster !== "N/A"

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWatchlist(movie.imdbID)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLiked(movie.imdbID)
  }

  return (
    <Link
      href={`/movie/${movie.imdbID}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {!imageLoaded && !imageError && <Skeleton className="absolute inset-0" />}
        {hasValidPoster && !imageError ? (
          <Image
            src={movie.Poster || "/placeholder.svg"}
            alt={`${movie.Title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              "object-cover transition-all duration-500",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary p-4">
            <span className="text-center text-sm text-muted-foreground">{movie.Title}</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Rating Badge */}
        {movie.imdbRating && movie.imdbRating !== "N/A" && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span className="text-xs font-semibold text-foreground">{movie.imdbRating}</span>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleWatchlistClick}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? <Check className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleLikeClick}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-destructive text-destructive")} />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{movie.Year}</span>
          {movie.Genre && (
            <>
              <span className="text-border">|</span>
              <span className="line-clamp-1">{movie.Genre.split(",")[0]}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-card">
      <Skeleton className="aspect-[2/3]" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
