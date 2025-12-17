"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useClients } from "@/hooks/useClients"
import { useOrdersByClient, useOrdersBeforeMonth } from "@/hooks/useOrders"
import { usePaymentsByClient, usePaymentsBeforeMonth } from "@/hooks/usePayments"
import { useCompanySettings } from "@/hooks/useSettings"
import { FileText, Download, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths } from "date-fns"

// 👉 React-PDF
import { PDFDownloadLink } from "@react-pdf/renderer"
import InvoicePDF from "@/components/invoice/InvoicePDF"

export default function Invoices() {
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: companySettings, isLoading: settingsLoading } = useCompanySettings()

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))

  const { data: clientOrders = [], isLoading: ordersLoading } =
    useOrdersByClient(selectedClient, selectedMonth)

  const { data: clientPayments = [] } =
    usePaymentsByClient(selectedClient, selectedMonth)

  const { data: previousOrders = [] } =
    useOrdersBeforeMonth(selectedClient, selectedMonth)

  const { data: previousPayments = [] } =
    usePaymentsBeforeMonth(selectedClient, selectedMonth)

  const client = clients.find((c) => c.id === selectedClient)
  const isLoading = clientsLoading || settingsLoading

  // ---------- TOTALS ----------
  const ordersTotal = clientOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const paymentsTotal = clientPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  const openingBalance = client ? Number(client.opening_balance || 0) : 0
  const previousOrdersTotal = previousOrders.reduce((s, o) => s + Number(o.total), 0)
  const previousPaymentsTotal = previousPayments.reduce((s, p) => s + Number(p.amount), 0)

  const previousBalance = openingBalance + previousOrdersTotal - previousPaymentsTotal
  const totalPayable = ordersTotal + previousBalance - paymentsTotal

  // ---------- MONTHS ----------
  const months = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const date = subMonths(new Date(), i)
      return {
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy"),
      }
    })
  }, [])

  const invoiceNumber = `${companySettings?.invoice_prefix || "INV"}-${companySettings?.next_invoice_number || 1}`
  const invoiceDate = format(new Date(), "dd-MM-yyyy")

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center h-96 items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-sm text-muted-foreground">Generate monthly invoices</p>
          </div>
        </div>

        {/* SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <Label>Select Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* PREVIEW */}
        {selectedClient && client && (
          <div className="bg-card rounded-xl border shadow overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-200 p-6">
              <h2 className="text-2xl font-bold">{companySettings?.company_name}</h2>
              <p className="text-sm">{companySettings?.address}</p>
            </div>

            {/* CLIENT */}
            <div className="p-6 border-b">
              <p className="font-bold">Invoice To</p>
              <p className="text-lg font-semibold">{client.name}</p>
              <p>{client.address}</p>
            </div>

            {/* TOTALS */}
            <div className="p-6 bg-muted/30">
              <div className="flex justify-between">
                <span>Orders Total</span>
                <span>₹{ordersTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Previous Balance</span>
                <span>₹{previousBalance.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Final Payable</span>
                <span>₹{totalPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-6 flex justify-end">
              <PDFDownloadLink
                document={
                  <InvoicePDF
                    company={companySettings}
                    client={client}
                    orders={clientOrders}
                    invoiceNumber={invoiceNumber}
                    invoiceDate={invoiceDate}
                  />
                }
                fileName={`${invoiceNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}

        {!selectedClient && (
          <div className="text-center p-12 border rounded-xl">
            <FileText className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
            <p>Select client and month to generate invoice</p>
          </div>
        )}

      </div>
    </MainLayout>
  )
}
