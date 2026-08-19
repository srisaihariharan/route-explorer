import { NextResponse } from "next/server"
import { fallbackAssistant } from "@/lib/routes"
import { generateText } from "ai"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const message = String(body.user_message || "")
  const routes = JSON.stringify(body.current_route_list || [])
  const filters = JSON.stringify(body.active_filters || {})
  if (!process.env.AI_GATEWAY_API_KEY) return NextResponse.json(fallbackAssistant(message))
  try {
    const result = await generateText({
      model: "anthropic/claude-sonnet-4.5",
      system: `You are a read-only transit advisor. The user always decides. Never claim you changed filters, booked, or hid routes. Compare only these visible routes: ${routes}. Active filters: ${filters}. If a filter change would help, finish with JSON on its own line: SUGGESTION:{"ecoMode":true} or SUGGESTION:{"walkThreshold":8} or SUGGESTION:{"groupSize":2}.`,
      prompt: message,
    })
    const match = result.text.match(/SUGGESTION:(\{.*\})/)
    return NextResponse.json({ reply: result.text.replace(/\nSUGGESTION:.*$/, ""), suggested_filter_change: match ? JSON.parse(match[1]) : undefined })
  } catch { return NextResponse.json(fallbackAssistant(message)) }
}
