"use client"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/types"
import { MovieCard, MovieCardSkeleton } from "./movie-card"

interface MovieGridProps {
  movies: Movie[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function MovieGrid({ movies, isLoading = false, emptyMessage = "No movies found", className }: MovieGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", className)}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", className)}
    >
      {movies.map((movie, index) => (
        <MovieCard key={movie.imdbID} movie={movie} priority={index < 12} />
      ))}
    </div>
  )
}
