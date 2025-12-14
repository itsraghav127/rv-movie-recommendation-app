"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserPreferences } from "@/lib/types"
import {
  getPreferences,
  savePreferences,
  toggleWatchlist,
  toggleLikedMovie,
  toggleFavoriteGenre,
  addToRecentlyViewed,
} from "@/lib/storage"

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    recentlyViewed: [],
    watchlist: [],
    likedMovies: [],
    theme: "dark",
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setPreferences(getPreferences())
    setIsLoaded(true)
  }, [])

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    const updated = savePreferences(updates)
    setPreferences(updated)
  }, [])

  const handleToggleWatchlist = useCallback((movieId: string) => {
    const isInWatchlist = toggleWatchlist(movieId)
    setPreferences(getPreferences())
    return isInWatchlist
  }, [])

  const handleToggleLiked = useCallback((movieId: string) => {
    const isLiked = toggleLikedMovie(movieId)
    setPreferences(getPreferences())
    return isLiked
  }, [])

  const handleToggleGenre = useCallback((genre: string) => {
    const isFavorite = toggleFavoriteGenre(genre)
    setPreferences(getPreferences())
    return isFavorite
  }, [])

  const handleAddToViewed = useCallback((movieId: string) => {
    addToRecentlyViewed(movieId)
    setPreferences(getPreferences())
  }, [])

  const isInWatchlist = useCallback(
    (movieId: string) => preferences.watchlist.includes(movieId),
    [preferences.watchlist],
  )

  const isLiked = useCallback((movieId: string) => preferences.likedMovies.includes(movieId), [preferences.likedMovies])

  const isGenreFavorite = useCallback(
    (genre: string) => preferences.favoriteGenres.includes(genre),
    [preferences.favoriteGenres],
  )

  return {
    preferences,
    isLoaded,
    updatePreferences,
    toggleWatchlist: handleToggleWatchlist,
    toggleLiked: handleToggleLiked,
    toggleGenre: handleToggleGenre,
    addToViewed: handleAddToViewed,
    isInWatchlist,
    isLiked,
    isGenreFavorite,
  }
}
