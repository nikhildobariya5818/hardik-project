"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Package, Mail, Lock, User, ArrowRight, Shield } from "lucide-react"

export default function SetupAdmin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin already exists
    const checkAdmin = async () => {
      const { data } = await supabase.from("user_roles").select("id").eq("role", "admin").limit(1)

      setHasAdmin(data && data.length > 0)
    }
    checkAdmin()
  }, [])

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke("setup-admin", {
        body: { email, password, fullName },
      })

      if (error) throw error
      if (data.error) throw new Error(data.error)

      toast({
        title: "Admin Created!",
        description: "You can now login with your admin credentials.",
      })
      navigate("/login")
    } catch (error: unknown) {
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Failed to create admin",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  if (hasAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Admin Already Exists</h1>
          <p className="text-muted-foreground mb-6">
            An administrator account has already been created. Please use the login page to access the system.
          </p>
          <Button onClick={() => navigate("/login")} variant="hero" size="lg">
            Go to Login
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">DeliveryPro</h1>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border/50 p-8">
          <div className="text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Initial Setup</h2>
            <p className="text-muted-foreground text-sm">Create your administrator account to get started</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Admin..." : "Create Admin Account"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
