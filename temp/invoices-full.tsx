"use client"

import { useState, useMemo, useRef } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useClients } from "@/hooks/useClients"
import { useOrdersByClient, useOrdersBeforeMonth } from "@/hooks/useOrders"
import { usePaymentsByClient, usePaymentsBeforeMonth } from "@/hooks/usePayments"
import { useCompanySettings } from "@/hooks/useSettings"
import { FileText, Download, Printer, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths } from "date-fns"

export default function Invoices() {
  const { data: clients = [], isLoading: clientsLoading } = useClients()
  const { data: companySettings, isLoading: settingsLoading } = useCompanySettings()
  const printRef = useRef<HTMLDivElement>(null)

  const [selectedClient, setSelectedClient] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))

  // Current month orders
  const { data: clientOrders = [], isLoading: ordersLoading } = useOrdersByClient(selectedClient, selectedMonth)

  // Current month payments
  const { data: clientPayments = [], isLoading: paymentsLoading } = usePaymentsByClient(selectedClient, selectedMonth)

  // All orders before selected month (for previous balance)
  const { data: previousOrders = [] } = useOrdersBeforeMonth(selectedClient, selectedMonth)

  // All payments before selected month (for previous balance)
  const { data: previousPayments = [] } = usePaymentsBeforeMonth(selectedClient, selectedMonth)

  const client = clients.find((c) => c.id === selectedClient)
  const isLoading = clientsLoading || settingsLoading

  // Calculate totals
  const ordersTotal = clientOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const paymentsTotal = clientPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  // Previous balance = Opening balance + All previous orders - All previous payments
  const openingBalance = client ? Number(client.opening_balance || 0) : 0
  const previousOrdersTotal = previousOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const previousPaymentsTotal = previousPayments.reduce((sum, p) => sum + Number(p.amount), 0)
  const previousBalance = openingBalance + previousOrdersTotal - previousPaymentsTotal

  // Final payable = Current orders + Previous balance - Current payments
  const totalPayable = ordersTotal + previousBalance - paymentsTotal

  // Generate last 12 months
  const months = useMemo(() => {
    const result = []
    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), i)
      result.push({
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy"),
      })
    }
    return result
  }, [])

  const invoiceNumber = `${companySettings?.invoice_prefix || "INV"}-${companySettings?.next_invoice_number || 1}`
  const invoiceDate = format(new Date(), "dd/MM/yyyy")
  const billingPeriod = months.find((m) => m.value === selectedMonth)?.label || ""

  const handlePrint = () => {
    const printContent = printRef.current
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice - ${client?.name}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; }
                .invoice-container { max-width: 800px; margin: 0 auto; }
                .header { 
                  background: linear-gradient(135deg, #0d9488 0%, #a7f3d0 100%); 
                  padding: 30px; 
                  color: #1a365d;
                }
                .header h1 { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
                .company-info { margin-top: 15px; }
                .company-info p { font-size: 12px; margin: 2px 0; }
                .invoice-meta { display: flex; justify-content: space-between; padding: 20px 30px; }
                .invoice-number { font-size: 18px; font-weight: bold; }
                .invoice-date { text-align: right; }
                .client-section { padding: 20px 30px; }
                .client-section h3 { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
                .client-section p { font-size: 13px; margin: 3px 0; }
                .orders-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .orders-table th { 
                  background: #f0f0f0; 
                  padding: 12px 15px; 
                  text-align: left; 
                  font-size: 12px; 
                  font-weight: bold;
                  border-bottom: 2px solid #ddd;
                }
                .orders-table td { 
                  padding: 10px 15px; 
                  font-size: 12px; 
                  border-bottom: 1px solid #eee;
                }
                .orders-table .text-right { text-align: right; }
                .summary-section { 
                  padding: 20px 30px; 
                  background: #f9f9f9;
                }
                .summary-row { 
                  display: flex; 
                  justify-content: flex-end; 
                  gap: 50px;
                  padding: 8px 0; 
                  font-size: 14px;
                }
                .summary-row span:first-child { min-width: 200px; text-align: right; }
                .summary-row span:last-child { min-width: 120px; text-align: right; font-weight: 500; }
                .summary-total { 
                  border-top: 2px solid #0d9488; 
                  margin-top: 10px; 
                  padding-top: 15px;
                  font-size: 18px;
                  font-weight: bold;
                }
                .summary-total span:last-child { color: #0d9488; }
                .footer { 
                  background: linear-gradient(135deg, #0d9488 0%, #a7f3d0 100%); 
                  height: 100px; 
                  margin-top: 30px;
                }
                @media print { 
                  body { padding: 0; } 
                  .header, .footer { 
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact; 
                  }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const handleDownload = () => {
    handlePrint()
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Generate Invoice</h1>
              <p className="text-sm text-muted-foreground">Create monthly bills for clients</p>
            </div>
          </div>
        </div>

        {/* Selection */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <div className="space-y-2">
            <Label>Select Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Invoice Preview */}
        {selectedClient && (
          <div className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden animate-slide-up">
            {/* Invoice Header - Gradient Style */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-200 p-4 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {companySettings?.company_name || "SHREE RAM ENTERPRISE"}
              </h2>
              <div className="mt-4 text-slate-700">
                <p className="text-xs sm:text-sm font-semibold">YOUR COMPANY</p>
                <p className="text-xs sm:text-sm">{companySettings?.address || "Company Address"}</p>
                <p className="text-xs sm:text-sm">Phone:- {companySettings?.phone || "Phone Number"}</p>
              </div>
            </div>

            {/* Invoice Number & Date */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 p-4 sm:p-6 border-b border-border">
              <div>
                <p className="text-base sm:text-lg font-bold">INVOICE NO:- {invoiceNumber}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold">DATE= {invoiceDate}</p>
              </div>
            </div>

            {/* Client Details */}
            <div className="p-4 sm:p-6 border-b border-border">
              <h3 className="font-bold text-sm mb-2">INVOICE TO</h3>
              <p className="font-bold text-base sm:text-lg">{client?.name}</p>
              {client?.address && <p className="text-sm">{client.address}</p>}
              <p className="text-sm mt-2">CITY :- {client?.city}</p>
              <p className="text-sm">Phone:- {client?.phone}</p>
            </div>

            {/* Orders Table */}
            <div className="p-4 sm:p-6">
              {ordersLoading || paymentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-border bg-muted/50">
                          <th className="text-left py-3 px-4 text-sm font-bold">NO.</th>
                          <th className="text-left py-3 px-4 text-sm font-bold">DATE</th>
                          <th className="text-right py-3 px-4 text-sm font-bold">WEIGHT</th>
                          <th className="text-left py-3 px-4 text-sm font-bold">PLACE</th>
                          <th className="text-right py-3 px-4 text-sm font-bold">RATE</th>
                          <th className="text-right py-3 px-4 text-sm font-bold">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientOrders.map((order, index) => (
                          <tr key={order.id} className="border-b border-border/50">
                            <td className="py-3 px-4 text-sm">{index + 1}</td>
                            <td className="py-3 px-4 text-sm">{format(new Date(order.order_date), "dd/MM/yyyy")}</td>
                            <td className="py-3 px-4 text-sm text-right">{Number(order.weight).toFixed(3)}</td>
                            <td className="py-3 px-4 text-sm">{order.material}</td>
                            <td className="py-3 px-4 text-sm text-right">{Number(order.rate)}</td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              {Number(order.total).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {clientOrders.map((order, index) => (
                      <div key={order.id} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span className="text-sm">{format(new Date(order.order_date), "dd/MM/yyyy")}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span className="font-medium">{order.material}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span>{Number(order.weight).toFixed(3)} MT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rate:</span>
                            <span>₹{Number(order.rate)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-medium">Total:</span>
                            <span className="font-semibold">₹{Number(order.total).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {clientOrders.length === 0 && !ordersLoading && (
                <div className="text-center py-8 text-muted-foreground">No orders found for this period</div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between py-2 text-sm sm:text-base">
                  <span className="text-muted-foreground">Orders Total (This Month):</span>
                  <span className="font-medium">₹{ordersTotal.toLocaleString("en-IN")}</span>
                </div>

                {previousBalance !== 0 && (
                  <div className="flex justify-between py-2 text-sm sm:text-base">
                    <span className="text-muted-foreground">Previous Balance:</span>
                    <span className={`font-medium ${previousBalance > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {previousBalance > 0 ? "+" : ""} ₹{previousBalance.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-t border-border text-sm sm:text-base">
                  <span className="text-muted-foreground font-medium">Subtotal:</span>
                  <span className="font-medium">₹{(ordersTotal + previousBalance).toLocaleString("en-IN")}</span>
                </div>

                {paymentsTotal > 0 && (
                  <div className="flex justify-between py-2 text-sm sm:text-base">
                    <span className="text-muted-foreground">Payments Received:</span>
                    <span className="font-medium text-green-600">- ₹{paymentsTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between py-4 border-t-2 border-primary mt-4">
                  <span className="font-bold text-base sm:text-lg">FINAL PAYABLE</span>
                  <span className="font-bold text-lg sm:text-xl text-primary">
                    ₹{totalPayable.toLocaleString("en-IN")} /-
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Gradient */}
            <div className="h-16 sm:h-24 bg-gradient-to-br from-teal-500 to-emerald-200"></div>

            <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end bg-card">
              <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto bg-transparent">
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}

        {!selectedClient && (
          <div className="bg-card rounded-xl shadow-md border border-border/50 p-12 text-center animate-fade-in">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Client</h3>
            <p className="text-muted-foreground">Choose a client and month to generate their invoice</p>
          </div>
        )}

        {/* Hidden Print Content */}
        {selectedClient && client && (
          <div className="hidden">
            <div ref={printRef}>
              <div className="invoice-container">
                <div className="header">
                  <h1>{companySettings?.company_name || "SHREE RAM ENTERPRISE"}</h1>
                  <div className="company-info">
                    <p>
                      <strong>YOUR COMPANY</strong>
                    </p>
                    <p>{companySettings?.address || "Company Address"}</p>
                    <p>Phone:- {companySettings?.phone || "Phone Number"}</p>
                  </div>
                </div>

                <div className="invoice-meta">
                  <div className="invoice-number">INVOICE NO:- {invoiceNumber}</div>
                  <div className="invoice-date">DATE= {invoiceDate}</div>
                </div>

                <div className="client-section">
                  <h3>INVOICE TO</h3>
                  <p>
                    <strong>{client.name}</strong>
                  </p>
                  {client.address && <p>{client.address}</p>}
                  <p style={{ marginTop: "10px" }}>CITY :- {client.city}</p>
                  <p>Phone:- {client.phone}</p>
                </div>

                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>DATE</th>
                      <th className="text-right">WEIGHT</th>
                      <th>PLACE</th>
                      <th className="text-right">RATE</th>
                      <th className="text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{format(new Date(order.order_date), "dd/MM/yyyy")}</td>
                        <td className="text-right">{Number(order.weight).toFixed(3)}</td>
                        <td>{order.material}</td>
                        <td className="text-right">{Number(order.rate)}</td>
                        <td className="text-right">{Number(order.total).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="summary-section">
                  <div className="summary-row">
                    <span>Orders Total (This Month):</span>
                    <span>₹{ordersTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {previousBalance !== 0 && (
                    <div className="summary-row">
                      <span>Previous Balance (Agal na Baki):</span>
                      <span style={{ color: previousBalance > 0 ? "#ea580c" : "#16a34a" }}>
                        {previousBalance > 0 ? "+" : ""} ₹{previousBalance.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div
                    className="summary-row"
                    style={{ borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "5px" }}
                  >
                    <span>Subtotal:</span>
                    <span>₹{(ordersTotal + previousBalance).toLocaleString("en-IN")}</span>
                  </div>

                  {paymentsTotal > 0 && (
                    <div className="summary-row">
                      <span>Payments Received (This Month):</span>
                      <span style={{ color: "#16a34a" }}>- ₹{paymentsTotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="summary-row summary-total">
                    <span>FINAL PAYABLE:</span>
                    <span>₹{totalPayable.toLocaleString("en-IN")} /-</span>
                  </div>
                </div>

                <div className="footer"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
