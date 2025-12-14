import { type NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.OMDB_API_KEY || "demo"
const BASE_URL = "https://www.omdbapi.com"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ Response: "False", Error: "No movie ID provided" }, { status: 400 })
  }

  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    i: id,
    plot: "full",
  })

  try {
    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`)
    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    })
  } catch (error) {
    console.error("OMDb movie details error:", error)
    return NextResponse.json({ Response: "False", Error: "API Error" }, { status: 500 })
  }
}
