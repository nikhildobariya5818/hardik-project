import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Invoice, InvoiceItem } from "@/lib/supabase/types"

// Fetch all invoices
export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (
            name,
            city
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Invoice[]
    },
  })
}

// Fetch single invoice with items
export function useInvoice(id: string | null) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) return null

      const supabase = getSupabaseBrowserClient()
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (
            name,
            city,
            phone,
            address,
            state,
            pincode,
            gst_number
          )
        `)
        .eq("id", id)
        .single()

      if (invoiceError) throw invoiceError

      const { data: items, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("created_at", { ascending: true })

      if (itemsError) throw itemsError

      return { invoice, items: items as InvoiceItem[] }
    },
    enabled: !!id,
  })
}

// Create invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      invoice,
      items,
    }: {
      invoice: Omit<Invoice, "id" | "created_at">
      items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
    }) => {
      const supabase = getSupabaseBrowserClient()
      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert(invoice)
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Insert invoice items
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: invoiceData.id,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithInvoiceId)

      if (itemsError) throw itemsError

      // Update next invoice number in company settings
      const { error: settingsError } = await supabase.rpc("increment_invoice_number")

      if (settingsError) console.error("Failed to increment invoice number:", settingsError)

      return invoiceData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["company-settings"] })
    },
  })
}

// Update invoice
export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      invoice,
      items,
    }: {
      id: string
      invoice: Partial<Omit<Invoice, "id" | "created_at">>
      items?: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
    }) => {
      const supabase = getSupabaseBrowserClient()
      // Update invoice
      const { error: invoiceError } = await supabase.from("invoices").update(invoice).eq("id", id)

      if (invoiceError) throw invoiceError

      // If items are provided, delete old items and insert new ones
      if (items) {
        const { error: deleteError } = await supabase.from("invoice_items").delete().eq("invoice_id", id)

        if (deleteError) throw deleteError

        const itemsWithInvoiceId = items.map((item) => ({
          ...item,
          invoice_id: id,
        }))

        const { error: itemsError } = await supabase.from("invoice_items").insert(itemsWithInvoiceId)

        if (itemsError) throw itemsError
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] })
    },
  })
}

// Delete invoice
export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("invoices").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}
