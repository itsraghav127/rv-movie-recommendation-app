"use client"

import { useState, useEffect, useCallback } from "react"
import type { Comment } from "@/lib/types"
import { getComments, addComment, deleteComment } from "@/lib/storage"

export function useComments(movieId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadComments = useCallback(() => {
    const movieComments = getComments(movieId)
    setComments(movieComments.sort((a, b) => b.timestamp - a.timestamp))
    setIsLoading(false)
  }, [movieId])

  useEffect(() => {
    loadComments()

    // Listen for real-time updates
    const handleCommentAdded = (e: CustomEvent<Comment>) => {
      if (e.detail.movieId === movieId) {
        setComments((prev) => [e.detail, ...prev])
      }
    }

    const handleCommentDeleted = (e: CustomEvent<string>) => {
      setComments((prev) => prev.filter((c) => c.id !== e.detail))
    }

    window.addEventListener("comment-added", handleCommentAdded as EventListener)
    window.addEventListener("comment-deleted", handleCommentDeleted as EventListener)

    return () => {
      window.removeEventListener("comment-added", handleCommentAdded as EventListener)
      window.removeEventListener("comment-deleted", handleCommentDeleted as EventListener)
    }
  }, [movieId, loadComments])

  const postComment = useCallback(
    (content: string, rating: number, author = "Anonymous") => {
      const newComment = addComment({
        movieId,
        author,
        content,
        rating,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`,
      })
      return newComment
    },
    [movieId],
  )

  const removeComment = useCallback((commentId: string) => {
    deleteComment(commentId)
  }, [])

  return {
    comments,
    isLoading,
    postComment,
    removeComment,
    refresh: loadComments,
  }
}
