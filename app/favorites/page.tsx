"use client"
import useSWR from "swr"
import { Heart } from "lucide-react"
import { getMultipleMovies } from "@/lib/omdb-api"
import { usePreferences } from "@/hooks/use-preferences"
import type { Movie } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieGrid } from "@/components/movie-grid"

export default function FavoritesPage() {
  const { preferences, isLoaded } = usePreferences()

  const { data: movies, isLoading } = useSWR<Movie[]>(
    isLoaded && preferences.likedMovies.length > 0 ? `favorites:${preferences.likedMovies.join(",")}` : null,
    () => getMultipleMovies(preferences.likedMovies),
    { revalidateOnFocus: false },
  )

  const isEmpty = isLoaded && preferences.likedMovies.length === 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 pt-24 pb-12 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-destructive" />
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Favorites</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Movies you've liked</p>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-card-foreground">No favorites yet</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Like movies by clicking the heart icon to add them to your favorites.
            </p>
          </div>
        ) : (
          <MovieGrid movies={movies || []} isLoading={!isLoaded || isLoading} />
        )}
      </main>

      <Footer />
    </div>
  )
}
