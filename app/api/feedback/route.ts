import { type NextRequest, NextResponse } from "next/server"
import { getAllFeedback, addFeedback } from "@/lib/storage"

export async function GET() {
  const feedbacks = getAllFeedback()
  return NextResponse.json(feedbacks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newFeedback = addFeedback(body)
    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
