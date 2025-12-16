"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Payment } from "@/lib/supabase/types"
import { useToast } from "@/hooks/use-toast"

async function fetchPayments(): Promise<Payment[]> {
  const res = await fetch("/api/payments")
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  })
}

export function useAddPayment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (payment: Omit<Payment, "id" | "created_at" | "created_by">) => {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast({
        title: "Payment Added",
        description: "New payment has been recorded.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast({
        title: "Payment Deleted",
        description: "Payment has been removed.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
