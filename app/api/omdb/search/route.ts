import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.OMDB_API_KEY || "demo"
const BASE_URL = "https://www.omdbapi.com"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("s")
  const page = searchParams.get("page") || "1"
  const type = searchParams.get("type")
  const year = searchParams.get("y")

  if (!query) {
    return NextResponse.json(
      { Search: [], totalResults: "0", Response: "False", Error: "No search query" },
      { status: 400 },
    )
  }

  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    page,
  })

  if (type) params.append("type", type)
  if (year) params.append("y", year)

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    })
  } catch (error) {
    console.error("OMDb search error:", error)
    return NextResponse.json({ Search: [], totalResults: "0", Response: "False", Error: "API Error" }, { status: 500 })
  }
}
