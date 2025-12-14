// Movie and App Types

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
  Plot?: string
  Genre?: string
  Director?: string
  Actors?: string
  Runtime?: string
  imdbRating?: string
  Released?: string
  Rated?: string
  Awards?: string
  BoxOffice?: string
  Country?: string
  Language?: string
  Metascore?: string
  Production?: string
  Writer?: string
}

export interface MovieSearchResult {
  Search: Movie[]
  totalResults: string
  Response: string
  Error?: string
}

export interface MovieDetails extends Movie {
  Ratings?: { Source: string; Value: string }[]
}

export interface Comment {
  id: string
  movieId: string
  author: string
  content: string
  rating: number
  timestamp: number
  avatar?: string
}

export interface UserPreferences {
  favoriteGenres: string[]
  recentlyViewed: string[]
  watchlist: string[]
  likedMovies: string[]
  theme: "dark" | "light"
}

export interface RecommendationScore {
  movie: Movie
  score: number
  reasons: string[]
}

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
] as const

export type Genre = (typeof GENRES)[number]
