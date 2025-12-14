import Link from "next/link"
import { Film, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Film className="h-6 w-6 text-primary" />
              <span>ShinX</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover your next favorite movie with personalized recommendations powered by IMDb data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Movies
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Popular Genres</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/search?genre=Action"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Action
                </Link>
              </li>
              <li>
                <Link
                  href="/search?genre=Comedy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Comedy
                </Link>
              </li>
              <li>
                <Link
                  href="/search?genre=Drama"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Drama
                </Link>
              </li>
              <li>
                <Link
                  href="/search?genre=Sci-Fi"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/itsraghav127?igsh=cTUxc2FlcmZremdx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/raghav-nath-373b40387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShinX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
