"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { SlidersHorizontal } from "lucide-react"
import { searchMovies, searchByGenre, getMultipleMovies, FEATURED_MOVIE_IDS } from "@/lib/omdb-api"
import type { Movie } from "@/lib/types"
import { GENRES } from "@/lib/types"
import { useDebounce } from "@/hooks/use-debounce"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { MovieGrid } from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialGenre = searchParams.get("genre") || ""

  const [query, setQuery] = React.useState(initialQuery)
  const [selectedGenre, setSelectedGenre] = React.useState(initialGenre)
  const [yearRange, setYearRange] = React.useState([1970, 2024])
  const [minRating, setMinRating] = React.useState(0)
  const [sortBy, setSortBy] = React.useState<"relevance" | "rating" | "year">("relevance")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Fetch movies based on search or genre
  const {
    data: movies,
    isLoading,
    error,
  } = useSWR<Movie[]>(
    `search:${debouncedQuery}:${selectedGenre}`,
    async () => {
      if (debouncedQuery.length >= 2) {
        const results = await searchMovies(debouncedQuery)
        return results.Search || []
      }
      if (selectedGenre) {
        return searchByGenre(selectedGenre)
      }
      // Default: show popular movies
      return getMultipleMovies(FEATURED_MOVIE_IDS.slice(0, 12))
    },
    { revalidateOnFocus: false },
  )

  // Filter and sort movies
  const filteredMovies = React.useMemo(() => {
    let result = movies || []

    // Filter by year
    result = result.filter((movie) => {
      const year = Number.parseInt(movie.Year || "0")
      return year >= yearRange[0] && year <= yearRange[1]
    })

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((movie) => {
        const rating = Number.parseFloat(movie.imdbRating || "0")
        return rating >= minRating
      })
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = Number.parseFloat(a.imdbRating || "0")
        const ratingB = Number.parseFloat(b.imdbRating || "0")
        return ratingB - ratingA
      })
    } else if (sortBy === "year") {
      result.sort((a, b) => {
        const yearA = Number.parseInt(a.Year || "0")
        const yearB = Number.parseInt(b.Year || "0")
        return yearB - yearA
      })
    }

    return result
  }, [movies, yearRange, minRating, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-screen-2xl px-4 pt-24 pb-12 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Browse Movies</h1>
          <p className="mt-2 text-muted-foreground">Search and discover movies from our extensive collection</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="flex-1 max-w-md">
              <SearchBar variant="hero" />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Movies</SheetTitle>
                  <SheetDescription>Refine your movie search with filters</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Year Range */}
                  <div className="space-y-4">
                    <Label>
                      Year Range: {yearRange[0]} - {yearRange[1]}
                    </Label>
                    <Slider
                      value={yearRange}
                      onValueChange={setYearRange}
                      min={1920}
                      max={2024}
                      step={1}
                      minStepsBetweenThumbs={1}
                    />
                  </div>

                  {/* Minimum Rating */}
                  <div className="space-y-4">
                    <Label>Minimum Rating: {minRating > 0 ? minRating : "Any"}</Label>
                    <Slider value={[minRating]} onValueChange={([v]) => setMinRating(v)} min={0} max={9} step={0.5} />
                  </div>

                  {/* Genre */}
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setYearRange([1970, 2024])
                      setMinRating(0)
                      setSelectedGenre("")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedGenre || minRating > 0 || yearRange[0] !== 1970 || yearRange[1] !== 2024) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedGenre && selectedGenre !== "all" && (
              <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => setSelectedGenre("")}>
                {selectedGenre}
                <span className="ml-1">×</span>
              </Button>
            )}
            {minRating > 0 && (
              <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => setMinRating(0)}>
                Rating ≥ {minRating}
                <span className="ml-1">×</span>
              </Button>
            )}
            {(yearRange[0] !== 1970 || yearRange[1] !== 2024) && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => setYearRange([1970, 2024])}
              >
                {yearRange[0]} - {yearRange[1]}
                <span className="ml-1">×</span>
              </Button>
            )}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <p className="mb-6 text-sm text-muted-foreground">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Movies Grid */}
        <MovieGrid
          movies={filteredMovies}
          isLoading={isLoading}
          emptyMessage={debouncedQuery ? `No movies found for "${debouncedQuery}"` : "No movies match your filters"}
        />
      </main>

      <Footer />
    </div>
  )
}
