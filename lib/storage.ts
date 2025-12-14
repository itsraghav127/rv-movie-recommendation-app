import type { Comment, UserPreferences } from "./types"

const STORAGE_KEYS = {
  preferences: "movie_app_preferences",
  comments: "movie_app_comments",
  viewHistory: "movie_app_view_history",
} as const

// Default user preferences
const defaultPreferences: UserPreferences = {
  favoriteGenres: [],
  recentlyViewed: [],
  watchlist: [],
  likedMovies: [],
  theme: "dark",
}

// User Preferences
export function getPreferences(): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences

  const stored = localStorage.getItem(STORAGE_KEYS.preferences)
  if (!stored) return defaultPreferences

  try {
    return { ...defaultPreferences, ...JSON.parse(stored) }
  } catch {
    return defaultPreferences
  }
}

export function savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences()
  const updated = { ...current, ...preferences }
  localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(updated))
  return updated
}

export function addToRecentlyViewed(movieId: string): void {
  const prefs = getPreferences()
  const recentlyViewed = [movieId, ...prefs.recentlyViewed.filter((id) => id !== movieId)].slice(0, 20) // Keep last 20
  savePreferences({ recentlyViewed })
}

export function toggleWatchlist(movieId: string): boolean {
  const prefs = getPreferences()
  const isInWatchlist = prefs.watchlist.includes(movieId)
  const watchlist = isInWatchlist ? prefs.watchlist.filter((id) => id !== movieId) : [...prefs.watchlist, movieId]
  savePreferences({ watchlist })
  return !isInWatchlist
}

export function toggleLikedMovie(movieId: string): boolean {
  const prefs = getPreferences()
  const isLiked = prefs.likedMovies.includes(movieId)
  const likedMovies = isLiked ? prefs.likedMovies.filter((id) => id !== movieId) : [...prefs.likedMovies, movieId]
  savePreferences({ likedMovies })
  return !isLiked
}

export function toggleFavoriteGenre(genre: string): boolean {
  const prefs = getPreferences()
  const isFavorite = prefs.favoriteGenres.includes(genre)
  const favoriteGenres = isFavorite ? prefs.favoriteGenres.filter((g) => g !== genre) : [...prefs.favoriteGenres, genre]
  savePreferences({ favoriteGenres })
  return !isFavorite
}

// Comments
export function getComments(movieId?: string): Comment[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEYS.comments)
  if (!stored) return []

  try {
    const comments: Comment[] = JSON.parse(stored)
    if (movieId) {
      return comments.filter((c) => c.movieId === movieId)
    }
    return comments
  } catch {
    return []
  }
}

export function addComment(comment: Omit<Comment, "id" | "timestamp">): Comment {
  const comments = getComments()
  const newComment: Comment = {
    ...comment,
    id: `comment_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
  }
  comments.unshift(newComment)
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments))

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent("comment-added", { detail: newComment }))

  return newComment
}

export function deleteComment(commentId: string): void {
  const comments = getComments().filter((c) => c.id !== commentId)
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments))
  window.dispatchEvent(new CustomEvent("comment-deleted", { detail: commentId }))
}
