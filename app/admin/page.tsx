import FeedbackTable from "@/components/admin/feedback-table"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage and track all feedback submissions</p>
        </div>

        <FeedbackTable />
      </div>
    </main>
  )
}
