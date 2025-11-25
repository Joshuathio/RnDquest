import { type NextRequest, NextResponse } from "next/server"
import { updateFeedback, deleteFeedback } from "@/lib/storage"

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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updated = updateFeedback(id, body)
    if (!updated) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const success = deleteFeedback(id)
    if (!success) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
