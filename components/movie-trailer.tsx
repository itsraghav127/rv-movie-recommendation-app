"use client"

import * as React from "react"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieTrailerProps {
  movieTitle: string
  year?: string
}

export function MovieTrailer({ movieTitle, year }: MovieTrailerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Create YouTube search query for the movie trailer
  const searchQuery = encodeURIComponent(`${movieTitle} ${year || ""} official trailer`)
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1`
  const thumbnailSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Watch Trailer
        </h2>
      </div>

      {!isOpen ? (
        <div className="relative aspect-video bg-secondary cursor-pointer group" onClick={() => setIsOpen(true)}>
          {/* Thumbnail placeholder with play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary p-4 shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-white">Click to play trailer</span>
            </div>
          </div>

          {/* Movie title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-medium truncate">{movieTitle} - Official Trailer</p>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          )}

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
              setIsLoading(true)
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          <iframe
            src={embedUrl}
            title={`${movieTitle} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}

      {/* Link to YouTube for more trailers */}
      <div className="p-3 border-t bg-secondary/30">
        <a
          href={thumbnailSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Play className="h-3 w-3" />
          View more trailers on YouTube
        </a>
      </div>
    </div>
  )
}
