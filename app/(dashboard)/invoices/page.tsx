"use client"

import { MainLayout } from "@/components/layout/MainLayout"

export default function InvoicesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-sm text-muted-foreground">Generate and manage invoices</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Invoices page - Coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">
            This page will allow you to generate monthly invoices for clients
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
