"use client"
import useSWR from "swr"
import type { Movie } from "@/lib/types"
import { getSimilarMovies } from "@/lib/recommendation-engine"
import { MovieCarousel } from "./movie-carousel"

interface SimilarMoviesProps {
  movie: Movie
}

export function SimilarMovies({ movie }: SimilarMoviesProps) {
  const { data: similarMovies, isLoading } = useSWR<Movie[]>(
    `similar:${movie.imdbID}`,
    () => getSimilarMovies(movie, 8),
    { revalidateOnFocus: false },
  )

  if (!isLoading && (!similarMovies || similarMovies.length === 0)) {
    return null
  }

  return <MovieCarousel title="Similar Movies" movies={similarMovies || []} isLoading={isLoading} className="px-0" />
}
