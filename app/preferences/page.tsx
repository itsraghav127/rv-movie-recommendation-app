"use client"
import { Settings, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { GENRES } from "@/lib/types"
import { usePreferences } from "@/hooks/use-preferences"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PreferencesPage() {
  const { preferences, isLoaded, toggleGenre, isGenreFavorite } = usePreferences()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-screen-lg px-4 pt-24 pb-12 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Preferences</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Customize your movie recommendations</p>
        </div>

        {/* Genre Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Genres</CardTitle>
            <CardDescription>
              Select your favorite genres to get better movie recommendations. We'll use these to personalize your
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {GENRES.map((genre) => {
                const isSelected = isGenreFavorite(genre)
                return (
                  <Button
                    key={genre}
                    variant={isSelected ? "default" : "outline"}
                    className={cn("justify-start gap-2", isSelected && "bg-primary text-primary-foreground")}
                    onClick={() => toggleGenre(genre)}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    {genre}
                  </Button>
                )
              })}
            </div>
            {preferences.favoriteGenres.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                {preferences.favoriteGenres.length} genre{preferences.favoriteGenres.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Recently Viewed</CardDescription>
              <CardTitle className="text-3xl">{preferences.recentlyViewed.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Watchlist</CardDescription>
              <CardTitle className="text-3xl">{preferences.watchlist.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Liked Movies</CardDescription>
              <CardTitle className="text-3xl">{preferences.likedMovies.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
