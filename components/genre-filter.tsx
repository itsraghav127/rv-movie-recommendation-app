"use client"
import { cn } from "@/lib/utils"
import { GENRES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface GenreFilterProps {
  selectedGenres: string[]
  onGenreChange: (genres: string[]) => void
  className?: string
}

export function GenreFilter({ selectedGenres, onGenreChange, className }: GenreFilterProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter((g) => g !== genre))
    } else {
      onGenreChange([...selectedGenres, genre])
    }
  }

  return (
    <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
      <div className="flex gap-2 pb-2">
        <Button
          variant={selectedGenres.length === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreChange([])}
          className="rounded-full"
        >
          All
        </Button>
        {GENRES.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenres.includes(genre) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleGenre(genre)}
            className="rounded-full"
          >
            {genre}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
