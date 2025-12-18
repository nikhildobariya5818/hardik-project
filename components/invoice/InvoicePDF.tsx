import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import type { CompanySettings, Client, InvoiceItem, Invoice } from "@/lib/supabase/types"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Dark header section with gradient effect
  headerContainer: {
    backgroundColor: "#111827",
    padding: 30,
    color: "#ffffff",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  companyDetails: {
    fontSize: 10,
    color: "#D1D5DB",
    lineHeight: 1.6,
  },
  invoiceMetaBox: {
    backgroundColor: "#ffffff",
    padding: 15,
    width: 200,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    borderLeftStyle: "solid",
  },
  taxInvoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  originalText: {
    fontSize: 8,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 8,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderTopStyle: "solid",
  },
  metaLabel: {
    color: "#6B7280",
  },
  metaValue: {
    fontWeight: "bold",
    color: "#111827",
  },
  // Gradient footer for header
  headerGradient: {
    height: 3,
    backgroundColor: "#3B82F6",
  },
  // Main content area
  contentArea: {
    padding: 30,
  },
  // Billing sections
  billingRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  billingBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
  },
  billingHeader: {
    backgroundColor: "#111827",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
  },
  billingTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  billingContent: {
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  clientDetails: {
    fontSize: 9,
    color: "#6B7280",
    lineHeight: 1.6,
  },
  // Table styles
  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111827",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
    minHeight: 30,
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  colSr: {
    width: "10%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#374151",
    borderRightStyle: "solid",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 9,
  },
  colDesc: {
    width: "40%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#374151",
    borderRightStyle: "solid",
    justifyContent: "center",
    fontSize: 9,
  },
  colQty: {
    width: "15%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#374151",
    borderRightStyle: "solid",
    textAlign: "right",
    justifyContent: "center",
    fontSize: 9,
  },
  colRate: {
    width: "17%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#374151",
    borderRightStyle: "solid",
    textAlign: "right",
    justifyContent: "center",
    fontSize: 9,
  },
  colAmount: {
    width: "18%",
    padding: 8,
    textAlign: "right",
    justifyContent: "center",
    fontSize: 9,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 9,
    textTransform: "uppercase",
  },
  tableBodyRow: {
    backgroundColor: "#ffffff",
  },
  // Grand total row
  grandTotalRow: {
    flexDirection: "row",
    backgroundColor: "#111827",
    color: "#ffffff",
    minHeight: 35,
  },
  grandTotalLabel: {
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  grandTotalAmount: {
    fontWeight: "bold",
    fontSize: 12,
  },
  // Amount in words
  amountInWordsBox: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    borderLeftStyle: "solid",
    padding: 10,
    marginBottom: 15,
  },
  amountInWordsText: {
    fontSize: 10,
    color: "#1E3A8A",
  },
  amountInWordsLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 5,
  },
  // Declaration
  declarationBox: {
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    borderLeftStyle: "solid",
    padding: 10,
    marginBottom: 20,
  },
  declarationText: {
    fontSize: 8,
    color: "#78350F",
    lineHeight: 1.5,
  },
  declarationLabel: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  // Footer section
  footer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopStyle: "dashed",
    borderTopColor: "#E5E7EB",
  },
  bankSection: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
  },
  bankDetailsRow: {
    flexDirection: "row",
    fontSize: 9,
    marginBottom: 3,
  },
  bankLabel: {
    width: 80,
    color: "#6B7280",
  },
  bankValue: {
    color: "#111827",
    flex: 1,
  },
  upiValue: {
    color: "#111827",
    fontWeight: "bold",
  },
  qrSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  qrLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  qrCodeBox: {
    backgroundColor: "#ffffff",
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    marginBottom: 6,
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrAmount: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  signatureSection: {
    alignItems: "flex-end",
    paddingRight: 20,
  },
  companyFooterText: {
    fontSize: 9,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 35,
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 2,
    borderTopColor: "#111827",
    borderTopStyle: "solid",
    marginBottom: 5,
  },
  signatoryLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#111827",
    textTransform: "uppercase",
  },
  // Bottom gradient
  bottomGradient: {
    height: 8,
    backgroundColor: "#111827",
  },
})

interface InvoicePDFProps {
  invoice: Invoice & {
    clients?: Client
  }
  items: InvoiceItem[]
  client: Client | undefined
  companySettings: CompanySettings | undefined
}

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]

  if (num === 0) return "Zero"

  function convertLessThanThousand(n: number): string {
    if (n === 0) return ""
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "")
  }

  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const remainder = Math.floor(num % 1000)

  let result = ""
  if (crore > 0) result += convertLessThanThousand(crore) + " Crore "
  if (lakh > 0) result += convertLessThanThousand(lakh) + " Lakh "
  if (thousand > 0) result += convertLessThanThousand(thousand) + " Thousand "
  if (remainder > 0) result += convertLessThanThousand(remainder)

  return result.trim()
}

export function InvoicePDF({ invoice, items, client, companySettings }: InvoicePDFProps) {
  if (!invoice || !items || !client || !companySettings) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error: Missing invoice data</Text>
        </Page>
      </Document>
    )
  }

  const grandTotal = invoice.total_payable || 0
  const amountInWords = numberToWords(Math.floor(grandTotal))
  const fullAmountInWords = `${amountInWords} Rupees Only`

  const upiString = companySettings?.upi_id
    ? `upi://pay?pa=${companySettings.upi_id}&pn=${encodeURIComponent(companySettings.company_name || "")}&am=${grandTotal.toFixed(2)}&cu=INR`
    : ""
  const qrCodeUrl = upiString
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`
    : ""

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* DARK HEADER SECTION */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            {/* Company Info */}
            <View style={styles.companySection}>
              <Text style={styles.companyName}>{companySettings?.company_name || "Company Name"}</Text>
              <Text style={styles.companyDetails}>
                {companySettings?.address || "Company Address"}
                {"\n"}
                Phone: {companySettings?.phone || "N/A"} | Email: {companySettings?.email || "N/A"}
              </Text>
            </View>

            {/* Invoice Meta Box */}
            <View style={styles.invoiceMetaBox}>
              <Text style={styles.taxInvoiceTitle}>Tax Invoice</Text>
              <Text style={styles.originalText}>(Original for Recipient)</Text>
              <View style={styles.invoiceMetaRow}>
                <Text style={styles.metaLabel}>Invoice No:</Text>
                <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
              </View>
              <View style={styles.invoiceMetaRow}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaValue}>{new Date(invoice.created_at).toLocaleDateString("en-GB")}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Header gradient line */}
        <View style={styles.headerGradient} />

        {/* MAIN CONTENT */}
        <View style={styles.contentArea}>
          {/* BILLING & SHIPPING SECTION */}
          <View style={styles.billingRow}>
            {/* Billed To */}
            <View style={styles.billingBox}>
              <View style={styles.billingHeader}>
                <Text style={styles.billingTitle}>Billed To</Text>
              </View>
              <View style={styles.billingContent}>
                <Text style={styles.clientName}>{client?.name || "N/A"}</Text>
                <Text style={styles.clientDetails}>
                  {client?.address || "N/A"}
                  {"\n"}
                  {client?.city || ""}, {client?.state || "Gujarat"}
                  {client?.pincode ? ` - ${client.pincode}` : ""}
                  {"\n"}
                  Phone: {client?.phone || "N/A"}
                </Text>
              </View>
            </View>

            {/* Shipped To */}
            <View style={styles.billingBox}>
              <View style={styles.billingHeader}>
                <Text style={styles.billingTitle}>Shipped To</Text>
              </View>
              <View style={styles.billingContent}>
                <Text style={styles.clientName}>{client?.name || "N/A"}</Text>
                <Text style={styles.clientDetails}>
                  {client?.address || "N/A"}
                  {"\n"}
                  {client?.city || ""}, {client?.state || "Gujarat"}
                  {client?.pincode ? ` - ${client.pincode}` : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* ITEMS TABLE */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colSr, styles.tableHeaderText]}>Sr.</Text>
              <Text style={[styles.colDesc, styles.tableHeaderText]}>Description of Goods</Text>
              <Text style={[styles.colQty, styles.tableHeaderText]}>Qty (MT)</Text>
              <Text style={[styles.colRate, styles.tableHeaderText]}>Rate (₹/MT)</Text>
              <Text style={[styles.colAmount, styles.tableHeaderText]}>Amount (₹)</Text>
            </View>

            {/* Table Body */}
            {items.map((item, index) => {
              const quantity = Number(item.quantity) || 0
              const rate = Number(item.rate) || 0
              const amount = Number(item.amount) || 0

              return (
                <View
                  key={item.id}
                  style={[styles.tableRow, styles.tableBodyRow, index === items.length - 1 && styles.lastTableRow]}
                >
                  <Text style={styles.colSr}>{index + 1}</Text>
                  <Text style={styles.colDesc}>{item.description || "Material"}</Text>
                  <Text style={styles.colQty}>{quantity.toFixed(2)}</Text>
                  <Text style={styles.colRate}>{rate.toFixed(2)}</Text>
                  <Text style={styles.colAmount}>{amount.toFixed(2)}</Text>
                </View>
              )
            })}
          </View>

          {/* GRAND TOTAL ROW */}
          <View style={styles.grandTotalRow}>
            <Text style={[styles.colSr]}></Text>
            <Text style={[styles.colDesc, styles.grandTotalLabel]}>Grand Total</Text>
            <Text style={styles.colQty}></Text>
            <Text style={styles.colRate}></Text>
            <Text style={[styles.colAmount, styles.grandTotalAmount]}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          {/* AMOUNT IN WORDS */}
          <View style={styles.amountInWordsBox}>
            <Text style={styles.amountInWordsText}>
              <Text style={styles.amountInWordsLabel}>Amount in Words:</Text>
              {fullAmountInWords}
            </Text>
          </View>

          {/* DECLARATION */}
          <View style={styles.declarationBox}>
            <Text style={[styles.declarationText, styles.declarationLabel]}>Declaration:</Text>
            <Text style={styles.declarationText}>
              We declare that this invoice shows the actual price of the goods described and that all particulars are
              true and correct. This is a computer-generated invoice and does not require a physical signature. All
              disputes are subject to jurisdiction.
            </Text>
          </View>

          {/* FOOTER SECTION */}
          <View style={styles.footer}>
            {/* Bank Details */}
            <View style={styles.bankSection}>
              <Text style={styles.sectionTitle}>Bank Details</Text>
              <View style={styles.bankDetailsRow}>
                <Text style={styles.bankLabel}>Bank Name:</Text>
                <Text style={styles.bankValue}>{companySettings?.bank_name || "N/A"}</Text>
              </View>
              <View style={styles.bankDetailsRow}>
                <Text style={styles.bankLabel}>Account No:</Text>
                <Text style={styles.bankValue}>{companySettings?.bank_account || "N/A"}</Text>
              </View>
              <View style={styles.bankDetailsRow}>
                <Text style={styles.bankLabel}>IFSC Code:</Text>
                <Text style={styles.bankValue}>{companySettings?.bank_ifsc || "N/A"}</Text>
              </View>
              {companySettings?.upi_id && (
                <View style={styles.bankDetailsRow}>
                  <Text style={styles.bankLabel}>UPI ID:</Text>
                  <Text style={styles.upiValue}>{companySettings.upi_id}</Text>
                </View>
              )}
            </View>

            {/* QR Code Section */}
            {qrCodeUrl && (
              <View style={styles.qrSection}>
                <Text style={styles.qrLabel}>Scan to Pay</Text>
                <View style={styles.qrCodeBox}>
                  <Image src={qrCodeUrl || "/placeholder.svg"} style={styles.qrCode} />
                </View>
                <Text style={styles.qrAmount}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            )}

            {/* Signature Section */}
            <View style={styles.signatureSection}>
              <Text style={styles.companyFooterText}>For {companySettings?.company_name || "Company Name"}</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatoryLabel}>Authorized Signatory</Text>
            </View>
          </View>
        </View>

        {/* Bottom gradient bar */}
        <View style={styles.bottomGradient} />
      </Page>
    </Document>
  )
}
