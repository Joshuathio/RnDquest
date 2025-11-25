export type Division = "LnT" | "EEO" | "PR" | "HRD" | "RnD"
export type FeedbackStatus = "open" | "in-review" | "resolved"

export interface Feedback {
  id: string
  name: string
  email: string
  eventName: string
  division: Division
  rating: number
  comment?: string
  suggestion?: string
  createdAt: string
  status: FeedbackStatus
}

export interface FeedbackFormData {
  name: string
  email: string
  eventName: string
  division: Division
  rating: number
  comment?: string
  suggestion?: string
}
