"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CompanySettings, MaterialRate } from "@/lib/supabase/types"
import { useToast } from "@/hooks/use-toast"

async function fetchSettings(): Promise<CompanySettings> {
  const res = await fetch("/api/settings")
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data
}

async function fetchMaterialRates(): Promise<MaterialRate[]> {
  const res = await fetch("/api/material-rates")
  const json = await res.json()
  if (!res.ok) throw new Error(json.error)
  return json.data
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  })
}

export function useMaterialRates() {
  return useQuery({
    queryKey: ["material-rates"],
    queryFn: fetchMaterialRates,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (settings: Partial<CompanySettings> & { id: string }) => {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast({
        title: "Settings Updated",
        description: "Company settings have been saved.",
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

export function useUpdateMaterialRates() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (rates: MaterialRate[]) => {
      const res = await fetch("/api/material-rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-rates"] })
      toast({
        title: "Rates Updated",
        description: "Material rates have been updated.",
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
