"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, Clock, Calendar, Film, Users, Award, Plus, Check, Heart, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMovieDetails } from "@/lib/omdb-api"
import { usePreferences } from "@/hooks/use-preferences"
import type { MovieDetails } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comment-section"
import { SimilarMovies } from "@/components/similar-movies"

export default function MoviePage() {
  const params = useParams()
  const id = params.id as string

  const { isInWatchlist, isLiked, toggleWatchlist, toggleLiked, addToViewed } = usePreferences()

  const {
    data: movie,
    isLoading,
    error,
  } = useSWR<MovieDetails | null>(`movie:${id}`, () => getMovieDetails(id), {
    revalidateOnFocus: false,
  })

  // Track view
  React.useEffect(() => {
    if (movie && id) {
      addToViewed(id)
    }
  }, [movie, id, addToViewed])

  const inWatchlist = isInWatchlist(id)
  const liked = isLiked(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <MovieDetailSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center pt-16">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Movie Not Found</h1>
          <p className="mb-8 text-muted-foreground">We couldn't find the movie you're looking for.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const hasValidPoster = movie.Poster && movie.Poster !== "N/A"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section with Backdrop */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          {hasValidPoster && (
            <div className="absolute inset-0">
              <Image
                src={movie.Poster || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover opacity-20 blur-xl scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
            </div>
          )}

          <div className="relative mx-auto max-w-screen-xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            <div className="flex flex-col gap-8 md:flex-row md:gap-12">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative mx-auto aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-xl shadow-2xl md:w-[300px]">
                  {hasValidPoster ? (
                    <Image
                      src={movie.Poster || "/placeholder.svg"}
                      alt={`${movie.Title} poster`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <Film className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-6">
                {/* Title & Year */}
                <div>
                  <h1 className="text-3xl font-bold leading-tight text-foreground text-balance md:text-4xl lg:text-5xl">
                    {movie.Title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {movie.Year && <span className="text-lg text-muted-foreground">{movie.Year}</span>}
                    {movie.Rated && movie.Rated !== "N/A" && (
                      <Badge variant="outline" className="text-xs">
                        {movie.Rated}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Ratings */}
                <div className="flex flex-wrap gap-4">
                  {movie.imdbRating && movie.imdbRating !== "N/A" && (
                    <div className="flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2">
                      <Star className="h-5 w-5 fill-gold text-gold" />
                      <div>
                        <span className="text-lg font-bold text-gold">{movie.imdbRating}</span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                      <span className="text-xs text-muted-foreground">IMDb</span>
                    </div>
                  )}
                  {movie.Metascore && movie.Metascore !== "N/A" && (
                    <div className="flex items-center gap-2 rounded-lg bg-accent/50 px-4 py-2">
                      <span className="text-lg font-bold text-accent-foreground">{movie.Metascore}</span>
                      <span className="text-xs text-muted-foreground">Metascore</span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {movie.Runtime && movie.Runtime !== "N/A" && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {movie.Runtime}
                    </div>
                  )}
                  {movie.Released && movie.Released !== "N/A" && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {movie.Released}
                    </div>
                  )}
                  {movie.Country && movie.Country !== "N/A" && (
                    <div className="flex items-center gap-1.5">{movie.Country}</div>
                  )}
                </div>

                {/* Genres */}
                {movie.Genre && movie.Genre !== "N/A" && (
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(", ").map((genre) => (
                      <Link key={genre} href={`/search?genre=${encodeURIComponent(genre)}`}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        >
                          {genre}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Plot */}
                {movie.Plot && movie.Plot !== "N/A" && (
                  <p className="text-base leading-relaxed text-foreground max-w-2xl">{movie.Plot}</p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2" onClick={() => toggleWatchlist(id)}>
                    {inWatchlist ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent" onClick={() => toggleLiked(id)}>
                    <Heart className={cn("h-5 w-5", liked && "fill-destructive text-destructive")} />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  {movie.imdbID && (
                    <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
                      <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        IMDb
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Details */}
        <section className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Cast & Crew */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-card-foreground">Cast & Crew</h2>
                <div className="space-y-4">
                  {movie.Director && movie.Director !== "N/A" && (
                    <div className="flex items-start gap-3">
                      <Film className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Director</span>
                        <p className="font-medium text-card-foreground">{movie.Director}</p>
                      </div>
                    </div>
                  )}
                  {movie.Writer && movie.Writer !== "N/A" && (
                    <div className="flex items-start gap-3">
                      <Film className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Writer</span>
                        <p className="font-medium text-card-foreground">{movie.Writer}</p>
                      </div>
                    </div>
                  )}
                  {movie.Actors && movie.Actors !== "N/A" && (
                    <div className="flex items-start gap-3">
                      <Users className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <span className="text-sm text-muted-foreground">Cast</span>
                        <p className="font-medium text-card-foreground">{movie.Actors}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Awards */}
              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-gold" />
                    <div>
                      <h2 className="text-lg font-semibold text-card-foreground">Awards</h2>
                      <p className="text-muted-foreground">{movie.Awards}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <CommentSection movieId={id} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Box Office */}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Box Office</h3>
                  <p className="text-2xl font-bold text-card-foreground">{movie.BoxOffice}</p>
                </div>
              )}

              {/* Production */}
              {movie.Production && movie.Production !== "N/A" && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Production</h3>
                  <p className="font-medium text-card-foreground">{movie.Production}</p>
                </div>
              )}

              {/* Language */}
              {movie.Language && movie.Language !== "N/A" && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Language</h3>
                  <p className="font-medium text-card-foreground">{movie.Language}</p>
                </div>
              )}

              {/* Ratings from other sources */}
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">Ratings</h3>
                  <div className="space-y-3">
                    {movie.Ratings.map((rating) => (
                      <div key={rating.Source} className="flex items-center justify-between">
                        <span className="text-sm text-card-foreground">{rating.Source}</span>
                        <span className="font-semibold text-primary">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* Similar Movies */}
        <section className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 lg:px-8">
          <SimilarMovies movie={movie} />
        </section>
      </main>

      <Footer />
    </div>
  )
}

function MovieDetailSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="mb-6 h-10 w-24" />
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[300px] rounded-xl md:w-[300px]" />
        <div className="flex-1 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
