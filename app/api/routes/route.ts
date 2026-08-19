import { NextResponse } from "next/server"
import { generateRoutes, type Filters } from "@/lib/routes"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const filters: Filters = { ecoMode: Boolean(body.active_filters?.ecoMode ?? true), walkThreshold: Number(body.active_filters?.walkThreshold ?? 10), groupSize: Number(body.active_filters?.groupSize ?? 1) }
  return NextResponse.json({ routes: generateRoutes(filters), source: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "google-ready" : "demo-fallback" })
}
