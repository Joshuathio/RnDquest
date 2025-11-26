import type { Feedback, FeedbackFormData } from "./types"

const STORAGE_KEY = "feedback_data"

// In-memory storage untuk server-side
let feedbackData: Feedback[] = []

export function getAllFeedback(): Feedback[] {
  if (typeof window === "undefined") {
    return [...feedbackData]
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addFeedback(formData: FeedbackFormData): Feedback {
  const id = Date.now().toString()
  const feedback: Feedback = {
    ...formData,
    id,
    createdAt: new Date().toISOString(),
    status: "open",
  }

  if (typeof window === "undefined") {
    feedbackData.push(feedback)
  } else {
    const allFeedback = getAllFeedback()
    allFeedback.push(feedback)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFeedback))
  }

  return feedback
}

export function updateFeedback(id: string, updates: Partial<Feedback>): Feedback | null {
  if (typeof window === "undefined") {
    const index = feedbackData.findIndex((f) => f.id === id)

    if (index === -1) return null

    feedbackData[index] = { ...feedbackData[index], ...updates }
    return feedbackData[index]
  } else {
    const allFeedback = getAllFeedback()
    const index = allFeedback.findIndex((f) => f.id === id)

    if (index === -1) return null

    allFeedback[index] = { ...allFeedback[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFeedback))
    return allFeedback[index]
  }
}

export function deleteFeedback(id: string): boolean {
  if (typeof window === "undefined") {
    const initialLength = feedbackData.length
    feedbackData = feedbackData.filter((f) => f.id !== id)
    return feedbackData.length < initialLength
  } else {
    const allFeedback = getAllFeedback()
    const filtered = allFeedback.filter((f) => f.id !== id)

    if (filtered.length === allFeedback.length) return false

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  }
}
