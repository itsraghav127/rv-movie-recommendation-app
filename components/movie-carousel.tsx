"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/types"
import { MovieCard, MovieCardSkeleton } from "./movie-card"
import { Button } from "@/components/ui/button"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  isLoading?: boolean
  className?: string
}

export function MovieCarousel({ title, movies, isLoading = false, className }: MovieCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  React.useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", checkScroll)
      return () => ref.removeEventListener("scroll", checkScroll)
    }
  }, [checkScroll, movies])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className={cn("relative", className)}>
      <div className="mb-4 flex items-center justify-between px-4 md:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-transparent"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-transparent"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:px-6 lg:px-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <MovieCardSkeleton />
              </div>
            ))
          : movies.map((movie, index) => (
              <div key={movie.imdbID} className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <MovieCard movie={movie} priority={index < 5} />
              </div>
            ))}
      </div>
    </section>
  )
}
