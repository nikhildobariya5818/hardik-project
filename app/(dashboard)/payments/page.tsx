"use client"

import { MainLayout } from "@/components/layout/MainLayout"

export default function PaymentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-sm text-muted-foreground">Track payments and balances</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Payments page - Coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">
            This page will display all payments and allow you to record new ones
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
