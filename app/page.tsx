"use client"

import * as React from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { MovieCarousel } from "@/components/movie-carousel"
import { GenreFilter } from "@/components/genre-filter"
import { MovieGrid } from "@/components/movie-grid"
import { getMultipleMovies, FEATURED_MOVIE_IDS, LATEST_MOVIES_IDS, searchByGenre } from "@/lib/omdb-api"
import { getRecommendations } from "@/lib/recommendation-engine"
import { usePreferences } from "@/hooks/use-preferences"
import type { Movie, RecommendationScore } from "@/lib/types"

const fetcher = async (key: string) => {
  if (key === "featured") {
    return getMultipleMovies(FEATURED_MOVIE_IDS.slice(0, 10))
  }
  if (key === "latest") {
    return getMultipleMovies(LATEST_MOVIES_IDS)
  }
  if (key.startsWith("genre:")) {
    const genre = key.replace("genre:", "")
    return searchByGenre(genre)
  }
  return []
}

export default function HomePage() {
  const { preferences, isLoaded } = usePreferences()
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([])

  // Fetch featured movies for hero
  const { data: featuredMovies, isLoading: isFeaturedLoading } = useSWR<Movie[]>("featured", fetcher, {
    revalidateOnFocus: false,
  })

  // Fetch latest releases
  const { data: latestMovies, isLoading: isLatestLoading } = useSWR<Movie[]>("latest", fetcher, {
    revalidateOnFocus: false,
  })

  // Fetch recommendations
  const { data: recommendations, isLoading: isRecsLoading } = useSWR<RecommendationScore[]>(
    isLoaded ? `recommendations:${preferences.favoriteGenres.join(",")}` : null,
    () => getRecommendations([], 10),
    { revalidateOnFocus: false },
  )

  // Fetch genre-based movies
  const { data: genreMovies, isLoading: isGenreLoading } = useSWR<Movie[]>(
    selectedGenres.length > 0 ? `genre:${selectedGenres[0]}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  const recommendedMovies = recommendations?.map((r) => r.movie) || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection movies={featuredMovies || []} isLoading={isFeaturedLoading} />

        <div className="space-y-12 py-12">
          {/* Latest Releases */}
          <MovieCarousel title="Latest Releases" movies={latestMovies || []} isLoading={isLatestLoading} />

          {/* Personalized Recommendations */}
          {isLoaded && (
            <MovieCarousel title="Recommended For You" movies={recommendedMovies} isLoading={isRecsLoading} />
          )}

          {/* Top Rated */}
          <MovieCarousel title="Top Rated" movies={featuredMovies || []} isLoading={isFeaturedLoading} />

          {/* Browse by Genre */}
          <section className="px-4 md:px-6 lg:px-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground md:text-2xl">Browse by Genre</h2>
            <GenreFilter selectedGenres={selectedGenres} onGenreChange={setSelectedGenres} className="mb-6" />
            {selectedGenres.length > 0 && (
              <MovieGrid
                movies={genreMovies || []}
                isLoading={isGenreLoading}
                emptyMessage="No movies found for selected genre"
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
