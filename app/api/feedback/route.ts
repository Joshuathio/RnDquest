import { type NextRequest, NextResponse } from "next/server"
import { getAllFeedback, addFeedback } from "@/lib/storage"

// This ensures data persists across requests in the same server instance
const feedbackStore: any[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    eventName: "Tech Summit 2024",
    division: "RnD",
    rating: 5,
    comment: "Great event, very informative!",
    suggestion: "More networking sessions would be great",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    eventName: "Product Launch",
    division: "PR",
    rating: 4,
    comment: "Good content, well organized",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in-review",
  },
]

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
