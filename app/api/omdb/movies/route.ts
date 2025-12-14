import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.OMDB_API_KEY || "demo"
const BASE_URL = "https://www.omdbapi.com"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ids = searchParams.get("ids")

  if (!ids) {
    return NextResponse.json([], { status: 400 })
  }

  const idArray = ids.split(",").filter(Boolean)

  try {
    const promises = idArray.map(async (id) => {
      const params = new URLSearchParams({
        apikey: API_KEY,
        i: id,
        plot: "full",
      })
      const response = await fetch(`${BASE_URL}?${params.toString()}`)
      return response.json()
    })

    const results = await Promise.all(promises)
    const validMovies = results.filter((movie) => movie.Response !== "False")

    return NextResponse.json(validMovies, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    })
  } catch (error) {
    console.error("OMDb multiple movies error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
