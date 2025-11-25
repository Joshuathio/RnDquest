"use client"

import { useEffect, useState } from "react"
import FeedbackForm from "@/components/feedback-form"
import { StarRating } from "@/components/star-rating"

interface Feedback {
  id: string
  rating: number
}

export default function Page() {
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    divisions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/feedback")
      const feedbacks: Feedback[] = await response.json()

      const totalFeedbacks = feedbacks.length
      const avgRating = feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0

      const uniqueDivisions = new Set(feedbacks.map((f: any) => f.division).filter(Boolean)).size

      setStats({
        total: totalFeedbacks,
        avgRating: Number.parseFloat(avgRating.toFixed(1)),
        divisions: uniqueDivisions || 5,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Event Feedback Form</h1>
          <p className="text-lg text-muted-foreground">Your feedback matters. Help us create better experiences.</p>
        </div>

        <div className="flex justify-center">
          <FeedbackForm />
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{isLoading ? "-" : stats.total}</div>
            <p className="text-sm text-muted-foreground">Feedbacks Collected</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.divisions}</div>
            <p className="text-sm text-muted-foreground">Divisions</p>
          </div>
          <div className="text-center space-y-2">
            {isLoading ? (
              <div className="text-3xl font-bold text-primary">-</div>
            ) : (
              <div className="flex justify-center">
                <StarRating rating={stats.avgRating} size="lg" showLabel={true} />
              </div>
            )}
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </div>
    </main>
  )
}
