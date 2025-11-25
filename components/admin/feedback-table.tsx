"use client"

import { useState, useEffect } from "react"
import type { Feedback, FeedbackStatus } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2 } from "lucide-react"
import { StarRating } from "../star-rating"
import FeedbackEditDialog from "./feedback-edit-dialog"

export default function FeedbackTable() {
  const { toast } = useToast()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/feedback")
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedbacks",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return

    try {
      const response = await fetch(`/api/feedback/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error()

      setFeedbacks(feedbacks.filter((f) => f.id !== id))
      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsDialogOpen(true)
  }

  const handleSave = async (updates: Partial<Feedback>) => {
    if (!selectedFeedback) return

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error()
      const updated = await response.json()

      setFeedbacks(feedbacks.map((f) => (f.id === updated.id ? updated : f)))
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Feedback updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive",
      })
    }
  }

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.eventName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || f.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in-review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Feedback Management</CardTitle>
        <CardDescription>View and manage all collected feedback from events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Search by name, email, or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading feedbacks...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No feedbacks found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{feedback.name}</div>
                        <div className="text-sm text-muted-foreground">{feedback.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{feedback.eventName}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground">
                        {feedback.division}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={feedback.rating} size="sm" showLabel={true} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(
                          feedback.status,
                        )}`}
                      >
                        {feedback.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(feedback)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(feedback.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </div>
        </div>
      </CardContent>

      {selectedFeedback && (
        <FeedbackEditDialog
          feedback={selectedFeedback}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      )}
    </Card>
  )
}
