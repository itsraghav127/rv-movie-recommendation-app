"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { searchMovies } from "@/lib/omdb-api"
import type { Movie } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  className?: string
  variant?: "default" | "hero"
}

export function SearchBar({ className, variant = "default" }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Movie[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Fetch results on debounced query change
  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const data = await searchMovies(debouncedQuery)
      setResults(data.Search?.slice(0, 6) || [])
      setIsLoading(false)
    }

    fetchResults()
  }, [debouncedQuery])

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleResultClick = (movieId: string) => {
    router.push(`/movie/${movieId}`)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className={cn(
              "pl-10 pr-10",
              variant === "hero" && "h-12 text-base bg-background/80 backdrop-blur-sm border-muted",
            )}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-popover p-2 shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((movie) => (
                <button
                  key={movie.imdbID}
                  onClick={() => handleResultClick(movie.imdbID)}
                  className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent transition-colors"
                >
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <img src={movie.Poster || "/placeholder.svg"} alt="" className="h-12 w-8 rounded object-cover" />
                  ) : (
                    <div className="flex h-12 w-8 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-popover-foreground">{movie.Title}</p>
                    <p className="text-xs text-muted-foreground">{movie.Year}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-md p-2 text-sm text-primary hover:bg-accent transition-colors"
              >
                <Search className="h-4 w-4" />
                Search for "{query}"
              </button>
            </div>
          ) : query.length >= 2 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No results found for "{query}"</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
