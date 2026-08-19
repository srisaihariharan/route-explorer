export type Filters = { ecoMode: boolean; walkThreshold: number; groupSize: number }
export type RouteOption = {
  id: string
  name: string
  mode: string
  badge: string
  duration: number
  distance: number
  fare: number
  co2: number
  accent: "green" | "amber" | "red" | "blue"
  summary: string
  legs: { mode: string; label: string; duration: number; distance: number; color: string }[]
  polyline: { lat: number; lng: number }[]
}

export const demoFilters: Filters = { ecoMode: true, walkThreshold: 10, groupSize: 1 }
const path = [
  { lat: 12.9719, lng: 77.5937 }, { lat: 12.9766, lng: 77.5993 }, { lat: 12.9824, lng: 77.6048 }, { lat: 12.987, lng: 77.6091 }, { lat: 12.9921, lng: 77.6135 },
]

export function generateRoutes(filters: Filters, live = false): RouteOption[] {
  const walk = Math.min(filters.walkThreshold, 15)
  return [
    { id: "metro", name: "Metro + Walk", mode: "METRO", badge: "Best for you", duration: live ? 34 : 34, distance: live ? 8.4 : 8.4, fare: 42 * filters.groupSize, co2: 86, accent: "green", summary: `Fast metro with a ${walk} min connector`, legs: [{ mode: "walk", label: "Walk to Indiranagar Station", duration: 7, distance: 0.5, color: "#4f9d78" }, { mode: "metro", label: "Purple Line to Majestic", duration: 19, distance: 6.8, color: "#4f9d78" }, { mode: "walk", label: "Walk to destination", duration: 8, distance: 1.1, color: "#4f9d78" }], polyline: path },
    { id: "bus", name: "Bus + Walk", mode: "BUS", badge: "Lowest emissions", duration: 41, distance: 7.9, fare: 25 * filters.groupSize, co2: 112, accent: "green", summary: "Simple, direct route with fewer changes", legs: [{ mode: "walk", label: "Walk to 12th Main Stop", duration: 5, distance: 0.3, color: "#4f9d78" }, { mode: "bus", label: "Bus 500D towards Majestic", duration: 29, distance: 6.7, color: "#4f9d78" }, { mode: "walk", label: "Walk to destination", duration: 7, distance: 0.9, color: "#4f9d78" }], polyline: path.map((p, i) => ({ ...p, lng: p.lng + (i % 2 ? 0.003 : -0.002) })) },
    { id: "ev", name: "EV Cab", mode: "ELECTRIC", badge: "Most comfortable", duration: 22, distance: 8.9, fare: 238 * filters.groupSize, co2: 420, accent: "amber", summary: "Door-to-door, quiet and comfortable", legs: [{ mode: "ev", label: "Electric cab to destination", duration: 22, distance: 8.9, color: "#c18a43" }], polyline: path.map((p, i) => ({ ...p, lat: p.lat + 0.002 * i, lng: p.lng - 0.004 })) },
    { id: "auto", name: "Petrol Auto", mode: "AUTO", badge: "Fastest", duration: 19, distance: 9.1, fare: 185 * filters.groupSize, co2: 1240, accent: "red", summary: "The quickest option in current traffic", legs: [{ mode: "auto", label: "Petrol auto to destination", duration: 19, distance: 9.1, color: "#c9694d" }], polyline: path.map((p, i) => ({ ...p, lat: p.lat - 0.001 * i, lng: p.lng + 0.005 })) },
  ]
}

export function sortRoutes(routes: RouteOption[], sort: string) {
  return [...routes].sort((a, b) => sort === "cheapest" ? a.fare - b.fare : sort === "greenest" ? a.co2 - b.co2 : a.duration - b.duration)
}

export const fallbackRoutes = generateRoutes(demoFilters, true)
export const fallbackAssistant = (message: string) => ({ reply: `Looking at the routes on screen, ${message.toLowerCase().includes("eco") ? "Metro + Walk is the clearest low-carbon choice at 86g CO₂." : "Metro + Walk balances time, cost, and emissions best for this trip."}`, suggested_filter_change: message.toLowerCase().includes("eco") ? { ecoMode: true } : undefined })
