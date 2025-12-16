"use client"

import { MainLayout } from "@/components/layout/MainLayout"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm text-muted-foreground">View business analytics</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Reports page - Coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">This page will show detailed reports and analytics</p>
        </div>
      </div>
    </MainLayout>
  )
}
