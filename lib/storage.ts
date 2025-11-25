import type { Feedback, FeedbackFormData } from "./types"

const STORAGE_KEY = "feedback_data"

export function getAllFeedback(): Feedback[] {
  if (typeof window === "undefined") return []

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

  const allFeedback = getAllFeedback()
  allFeedback.push(feedback)

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFeedback))
  }

  return feedback
}

export function updateFeedback(id: string, updates: Partial<Feedback>): Feedback | null {
  const allFeedback = getAllFeedback()
  const index = allFeedback.findIndex((f) => f.id === id)

  if (index === -1) return null

  allFeedback[index] = { ...allFeedback[index], ...updates }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFeedback))
  }

  return allFeedback[index]
}

export function deleteFeedback(id: string): boolean {
  const allFeedback = getAllFeedback()
  const filtered = allFeedback.filter((f) => f.id !== id)

  if (filtered.length === allFeedback.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  return true
}
