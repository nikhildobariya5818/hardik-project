"use client"

import { MainLayout } from "@/components/layout/MainLayout"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage company settings</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">Settings page - Coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">
            This page will allow you to configure company details, rates, and staff
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
