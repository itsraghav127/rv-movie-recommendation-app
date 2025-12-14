"use client"

import * as React from "react"
import { Star, Send, Trash2, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useComments } from "@/hooks/use-comments"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface CommentSectionProps {
  movieId: string
}

export function CommentSection({ movieId }: CommentSectionProps) {
  const { comments, isLoading, postComment, removeComment } = useComments(movieId)
  const [content, setContent] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [rating, setRating] = React.useState(0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || rating === 0) return

    setIsSubmitting(true)
    postComment(content.trim(), rating, author.trim() || "Anonymous")

    // Reset form
    setContent("")
    setRating(0)
    setIsSubmitting(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Reviews & Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Your name (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="max-w-[200px]"
          />
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <span className="mr-2 text-sm text-muted-foreground">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 focus:outline-none"
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    (hoverRating || rating) >= star ? "fill-gold text-gold" : "text-muted-foreground",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder="Share your thoughts about this movie..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!content.trim() || rating === 0 || isSubmitting} className="gap-2">
            <Send className="h-4 w-4" />
            Post Review
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border bg-card p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card p-8 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="flex gap-4 rounded-lg border bg-card p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-card-foreground">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-3 w-3",
                            star <= comment.rating ? "fill-gold text-gold" : "text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeComment(comment.id)}
                    aria-label="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-card-foreground leading-relaxed">{comment.content}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
