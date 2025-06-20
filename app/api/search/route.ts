import { NextResponse } from "next/server"

interface SearchParams {
  q?: string
  genres?: string
  formats?: string
  status?: string
}

interface AnilistResponse {
  data: {
    Page: {
      media: Array<{
        id: number
        title: {
          english: string | null
          romaji: string
          native: string | null
        }
        coverImage: {
          large: string
          medium: string
        }
        description: string
        averageScore: number
        popularity: number
        genres: string[]
        format: string
        status: string
        startDate: {
          year: number
          month: number
          day: number
        }
        siteUrl: string
        isAdult: boolean
      }>
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params: SearchParams = {
      q: searchParams.get("q") ?? undefined,
      genres: searchParams.get("genres") ?? undefined,
      formats: searchParams.get("formats") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    }

    // Construct GraphQL query
    const query = `
      query ($search: String, $genres: [String], $formats: [MediaFormat], $status: [MediaStatus]) {
        Page(page: 1, perPage: 24) {
          media(
            type: MANGA
            search: $search
            genre_in: $genres
            format_in: $formats
            status_in: $status
            sort: [POPULARITY_DESC, SCORE_DESC]
          ) {
            id
            siteUrl
            isAdult
            title {
              english
              romaji
              native
            }
            coverImage {
              large
              medium
            }
            description(asHtml: true)
            averageScore
            popularity
            genres
            format
            status
            startDate {
              year
              month
              day
            }
          }
        }
      }
    `

    // Prepare variables
    const variables = {
      search: params.q,
      genres: params.genres?.split(","),
      formats: params.formats?.split(","),
      status: params.status?.split(","),
    }

    // Make request to Anilist API
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Anilist")
    }

    const data = (await response.json()) as AnilistResponse

    return NextResponse.json(data.data.Page.media)
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    )
  }
} 