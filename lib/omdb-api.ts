import type { Movie, MovieDetails, MovieSearchResult } from "./types"

// Popular movie IDs for initial load and recommendations
export const FEATURED_MOVIE_IDS = [
  "tt1375666", // Inception
  "tt0816692", // Interstellar
  "tt0468569", // The Dark Knight
  "tt0133093", // The Matrix
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0167260", // LOTR: Return of the King
  "tt0110912", // Pulp Fiction
  "tt0109830", // Forrest Gump
  "tt0137523", // Fight Club
  "tt0120737", // LOTR: Fellowship
  "tt0080684", // Empire Strikes Back
  "tt0099685", // Goodfellas
  "tt0073486", // One Flew Over the Cuckoo's Nest
  "tt0114369", // Se7en
  "tt0102926", // Silence of the Lambs
  "tt0038650", // It's a Wonderful Life
  "tt0120815", // Saving Private Ryan
  "tt0245429", // Spirited Away
  "tt0047478", // Seven Samurai
]

export const LATEST_MOVIES_IDS = [
  "tt1517268", // Barbie
  "tt15398776", // Oppenheimer
  "tt9362722", // Spider-Man: Across the Spider-Verse
  "tt6718170", // The Super Mario Bros. Movie
  "tt5537002", // Killers of the Flower Moon
  "tt14998742", // Napoleon
  "tt14230458", // Poor Things
  "tt15239678", // Dune: Part Two
  "tt10366206", // John Wick: Chapter 4
  "tt11389872", // Guardians of the Galaxy Vol. 3
]

export const GENRE_SAMPLE_IDS: Record<string, string[]> = {
  Action: ["tt0468569", "tt0133093", "tt10366206", "tt0848228", "tt4154796"],
  Comedy: ["tt0110912", "tt0109830", "tt0382932", "tt1517268", "tt0325980"],
  Drama: ["tt0111161", "tt0068646", "tt0137523", "tt5537002", "tt0120689"],
  "Sci-Fi": ["tt1375666", "tt0816692", "tt0133093", "tt0088763", "tt0076759"],
  Horror: ["tt0081505", "tt1457767", "tt0078748", "tt0054215", "tt7784604"],
  Romance: ["tt0338013", "tt0332280", "tt0118799", "tt0099348", "tt0095953"],
  Thriller: ["tt0114369", "tt0102926", "tt0169547", "tt0482571", "tt0144084"],
  Animation: ["tt0245429", "tt2380307", "tt9362722", "tt6718170", "tt0910970"],
}

export async function searchMovies(
  query: string,
  page = 1,
  type?: "movie" | "series" | "episode",
  year?: string,
): Promise<MovieSearchResult> {
  const params = new URLSearchParams({
    s: query,
    page: page.toString(),
  })

  if (type) params.append("type", type)
  if (year) params.append("y", year)

  try {
    const response = await fetch(`/api/omdb/search?${params.toString()}`)
    if (!response.ok) throw new Error("API request failed")
    return response.json()
  } catch (error) {
    console.error("Search error:", error)
    return { Search: [], totalResults: "0", Response: "False", Error: "API Error" }
  }
}

export async function getMovieDetails(imdbId: string): Promise<MovieDetails | null> {
  try {
    const response = await fetch(`/api/omdb/movie/${imdbId}`)
    if (!response.ok) throw new Error("API request failed")
    const data = await response.json()
    if (data.Response === "False") return null
    return data
  } catch (error) {
    console.error("Get movie details error:", error)
    return null
  }
}

export async function getMultipleMovies(ids: string[]): Promise<Movie[]> {
  try {
    const response = await fetch(`/api/omdb/movies?ids=${ids.join(",")}`)
    if (!response.ok) throw new Error("API request failed")
    return response.json()
  } catch (error) {
    console.error("Get multiple movies error:", error)
    return []
  }
}

export async function searchByGenre(genre: string): Promise<Movie[]> {
  const genreIds = GENRE_SAMPLE_IDS[genre] || FEATURED_MOVIE_IDS.slice(0, 5)
  return getMultipleMovies(genreIds)
}
