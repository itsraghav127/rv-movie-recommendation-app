import type { Movie, RecommendationScore, UserPreferences } from "./types"
import { getMovieDetails, GENRE_SAMPLE_IDS, FEATURED_MOVIE_IDS } from "./omdb-api"
import { getPreferences } from "./storage"

// Content-based filtering algorithm
export function calculateSimilarity(movie1: Movie, movie2: Movie): number {
  let score = 0

  // Genre similarity (40% weight)
  if (movie1.Genre && movie2.Genre) {
    const genres1 = movie1.Genre.split(", ").map((g) => g.toLowerCase())
    const genres2 = movie2.Genre.split(", ").map((g) => g.toLowerCase())
    const commonGenres = genres1.filter((g) => genres2.includes(g))
    score += (commonGenres.length / Math.max(genres1.length, genres2.length)) * 40
  }

  // Director similarity (20% weight)
  if (movie1.Director && movie2.Director) {
    const directors1 = movie1.Director.split(", ")
    const directors2 = movie2.Director.split(", ")
    if (directors1.some((d) => directors2.includes(d))) {
      score += 20
    }
  }

  // Actor similarity (20% weight)
  if (movie1.Actors && movie2.Actors) {
    const actors1 = movie1.Actors.split(", ")
    const actors2 = movie2.Actors.split(", ")
    const commonActors = actors1.filter((a) => actors2.includes(a))
    score += Math.min(commonActors.length * 5, 20)
  }

  // Rating similarity (10% weight)
  if (movie1.imdbRating && movie2.imdbRating) {
    const rating1 = Number.parseFloat(movie1.imdbRating)
    const rating2 = Number.parseFloat(movie2.imdbRating)
    if (!isNaN(rating1) && !isNaN(rating2)) {
      const ratingDiff = Math.abs(rating1 - rating2)
      score += Math.max(0, (1 - ratingDiff / 10) * 10)
    }
  }

  // Year proximity (10% weight)
  if (movie1.Year && movie2.Year) {
    const year1 = Number.parseInt(movie1.Year)
    const year2 = Number.parseInt(movie2.Year)
    if (!isNaN(year1) && !isNaN(year2)) {
      const yearDiff = Math.abs(year1 - year2)
      score += Math.max(0, (1 - yearDiff / 50) * 10)
    }
  }

  return score
}

// Get recommendation reasons
function getRecommendationReasons(movie: Movie, preferences: UserPreferences, viewedMovies: Movie[]): string[] {
  const reasons: string[] = []

  // Check genre preference match
  if (movie.Genre) {
    const movieGenres = movie.Genre.split(", ")
    const matchingGenres = movieGenres.filter((g) =>
      preferences.favoriteGenres.some((fg) => g.toLowerCase().includes(fg.toLowerCase())),
    )
    if (matchingGenres.length > 0) {
      reasons.push(`Matches your favorite genre: ${matchingGenres[0]}`)
    }
  }

  // Check high rating
  if (movie.imdbRating && Number.parseFloat(movie.imdbRating) >= 8.0) {
    reasons.push(`Highly rated: ${movie.imdbRating}/10`)
  }

  // Check similarity to viewed movies
  for (const viewed of viewedMovies.slice(0, 3)) {
    const similarity = calculateSimilarity(movie, viewed)
    if (similarity > 50) {
      reasons.push(`Similar to "${viewed.Title}"`)
      break
    }
  }

  // Check same director
  for (const viewed of viewedMovies) {
    if (movie.Director && viewed.Director) {
      const movieDirectors = movie.Director.split(", ")
      const viewedDirectors = viewed.Director.split(", ")
      const commonDirector = movieDirectors.find((d) => viewedDirectors.includes(d))
      if (commonDirector) {
        reasons.push(`From director ${commonDirector}`)
        break
      }
    }
  }

  if (reasons.length === 0) {
    reasons.push("Popular recommendation")
  }

  return reasons.slice(0, 2)
}

// Main recommendation function
export async function getRecommendations(excludeIds: string[] = [], limit = 10): Promise<RecommendationScore[]> {
  const preferences = getPreferences()
  const recommendations: RecommendationScore[] = []

  // Get IDs to fetch based on preferences
  let candidateIds: string[] = []

  // Add movies from favorite genres
  for (const genre of preferences.favoriteGenres) {
    const genreIds = GENRE_SAMPLE_IDS[genre] || []
    candidateIds.push(...genreIds)
  }

  // Add featured movies as fallback
  candidateIds.push(...FEATURED_MOVIE_IDS)

  // Remove duplicates and excluded
  candidateIds = [...new Set(candidateIds)].filter(
    (id) => !excludeIds.includes(id) && !preferences.recentlyViewed.includes(id),
  )

  // Fetch movie details
  const moviePromises = candidateIds.slice(0, 20).map((id) => getMovieDetails(id))
  const movies = (await Promise.all(moviePromises)).filter((m): m is Movie => m !== null)

  // Get recently viewed movies for similarity comparison
  const viewedPromises = preferences.recentlyViewed.slice(0, 5).map((id) => getMovieDetails(id))
  const viewedMovies = (await Promise.all(viewedPromises)).filter((m): m is Movie => m !== null)

  // Score each candidate
  for (const movie of movies) {
    let score = 0

    // Genre preference score (0-40)
    if (movie.Genre) {
      const movieGenres = movie.Genre.split(", ")
      const matchingGenres = movieGenres.filter((g) =>
        preferences.favoriteGenres.some((fg) => g.toLowerCase().includes(fg.toLowerCase())),
      )
      score += matchingGenres.length * 15
    }

    // Rating score (0-30)
    if (movie.imdbRating) {
      const rating = Number.parseFloat(movie.imdbRating)
      if (!isNaN(rating)) {
        score += rating * 3
      }
    }

    // Similarity to recently viewed (0-30)
    for (const viewed of viewedMovies) {
      const similarity = calculateSimilarity(movie, viewed)
      score += similarity * 0.3
    }

    const reasons = getRecommendationReasons(movie, preferences, viewedMovies)

    recommendations.push({
      movie,
      score,
      reasons,
    })
  }

  // Sort by score and return top N
  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit)
}

// Get similar movies to a specific movie
export async function getSimilarMovies(movie: Movie, limit = 6): Promise<Movie[]> {
  // Get candidates from same genres
  const movieGenres = movie.Genre?.split(", ") || []
  let candidateIds: string[] = []

  for (const genre of movieGenres) {
    const genreIds = GENRE_SAMPLE_IDS[genre] || []
    candidateIds.push(...genreIds)
  }

  candidateIds.push(...FEATURED_MOVIE_IDS)
  candidateIds = [...new Set(candidateIds)].filter((id) => id !== movie.imdbID)

  // Fetch candidates
  const promises = candidateIds.slice(0, 15).map((id) => getMovieDetails(id))
  const candidates = (await Promise.all(promises)).filter((m): m is Movie => m !== null)

  // Score by similarity
  const scored = candidates.map((candidate) => ({
    movie: candidate,
    score: calculateSimilarity(movie, candidate),
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.movie)
}
