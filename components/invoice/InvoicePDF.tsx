import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import type { CompanySettings, Client, Order } from "@/types"

const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingBottom: 80,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  headerFixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderBottom: 2,
    borderBottomColor: "#000",
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  companyDetails: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#555",
  },
  invoiceHeader: {
    textAlign: "right",
    paddingLeft: 20,
  },
  invoiceTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 3,
  },
  originalCopy: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 8,
  },
  invoiceDetails: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  footerFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8f9fa",
    borderTop: 2,
    borderTopColor: "#000",
    padding: 20,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bankSection: {
    flex: 1,
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  bankText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#333",
  },
  qrSection: {
    alignItems: "center",
    paddingLeft: 15,
    borderLeft: 1,
    borderLeftColor: "#ddd",
  },
  qrCode: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  qrLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  signatureSection: {
    paddingLeft: 15,
    borderLeft: 1,
    borderLeftColor: "#ddd",
    textAlign: "center",
  },
  signatureLine: {
    borderTop: 1,
    borderTopColor: "#000",
    width: 120,
    marginTop: 35,
    marginBottom: 5,
  },
  content: {
    minHeight: 400,
  },
  billingRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#e0e0e0",
  },
  billingCol: {
    width: "50%",
    paddingRight: 10,
  },
  billingTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1a1a1a",
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  clientName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#1a1a1a",
  },
  clientDetails: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#333",
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2c3e50",
    borderTop: 2,
    borderBottom: 2,
    borderColor: "#000",
    fontWeight: "bold",
    fontSize: 9,
    color: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#ddd",
    minHeight: 25,
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  col5: { width: "5%", padding: 5, borderRight: 1, borderColor: "#ddd", justifyContent: "center" },
  col20: { width: "20%", padding: 5, borderRight: 1, borderColor: "#ddd", justifyContent: "center" },
  col15: { width: "15%", padding: 5, borderRight: 1, borderColor: "#ddd", justifyContent: "center" },
  col10: {
    width: "10%",
    padding: 5,
    borderRight: 1,
    borderColor: "#ddd",
    textAlign: "right",
    justifyContent: "center",
  },
  col18: {
    width: "18%",
    padding: 5,
    borderRight: 1,
    borderColor: "#ddd",
    textAlign: "right",
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#34495e",
    fontWeight: "bold",
    borderTop: 2,
    borderBottom: 2,
    borderColor: "#000",
    color: "#fff",
    minHeight: 30,
  },
  declaration: {
    fontSize: 7,
    marginTop: 10,
    fontStyle: "italic",
    color: "#666",
    lineHeight: 1.4,
  },
})

interface InvoicePDFProps {
  company: CompanySettings | undefined
  client: Client
  orders: Order[]
  invoiceNumber: string
  invoiceDate: string
}

export default function InvoicePDF({ company, client, orders, invoiceNumber, invoiceDate }: InvoicePDFProps) {
  // Calculate totals
  const grandTotal = orders.reduce((sum, order) => sum + Number(order.total), 0)

  const upiString = company?.upi_id
    ? `upi://pay?pa=${company.upi_id}&pn=${encodeURIComponent(company.company_name || "")}&am=${grandTotal.toFixed(2)}&cu=INR`
    : ""
  const qrCodeUrl = upiString
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`
    : ""

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerFixed} fixed>
          <View style={styles.headerContent}>
            <View style={styles.logoSection}>
              <Image src="/icon-192x192.jpg" style={styles.logo} />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{company?.company_name || "Company Name"}</Text>
                <Text style={styles.companyDetails}>
                  {company?.address || "Company Address"}
                  {"\n"}
                  Phone: {company?.phone || "N/A"} | Email: {company?.email || "N/A"}
                  {"\n"}
                  GSTIN: {company?.gst_number || "N/A"} | PAN: {company?.pan_number || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceTitleText}>TAX INVOICE</Text>
              <Text style={styles.originalCopy}>(Original for Recipient)</Text>
              <Text style={styles.invoiceDetails}>
                Invoice No: {invoiceNumber}
                {"\n"}
                Invoice Date: {invoiceDate}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* BILLING & SHIPPING DETAILS */}
          <View style={styles.billingRow}>
            <View style={styles.billingCol}>
              <Text style={styles.billingTitle}>Billed To:</Text>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientDetails}>
                {client.address || "N/A"}
                {"\n"}
                {client.city || ""}, {client.state || "Gujarat"} - {client.pincode || ""}
                {"\n"}
                Party PAN: {client.pan_number || "N/A"}
                {"\n"}
                Mobile: {client.phone}
                {"\n"}
                GSTIN: {client.gst_number || "Unregistered"}
              </Text>
            </View>
            <View style={styles.billingCol}>
              <Text style={styles.billingTitle}>Shipped To:</Text>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientDetails}>
                {client.address || "N/A"}
                {"\n"}
                {client.city || ""}, {client.state || "Gujarat"} - {client.pincode || ""}
              </Text>
            </View>
          </View>

          {/* ORDER ITEMS TABLE */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col5}>Sr.</Text>
              <Text style={styles.col20}>Description of Goods</Text>
              <Text style={styles.col15}>HSN/SAC Code</Text>
              <Text style={styles.col15}>Quantity (MT)</Text>
              <Text style={styles.col18}>Rate (₹/MT)</Text>
              <Text style={styles.col18}>Amount (₹)</Text>
            </View>

            {orders.map((order, index) => (
              <View key={order.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                <Text style={styles.col5}>{index + 1}</Text>
                <Text style={styles.col20}>
                  {order.material || "Material"}
                  {"\n"}
                  {/* <Text style={{ fontSize: 7, color: "#666" }}>Order #{order.order_number}</Text> */}
                </Text>
                <Text style={styles.col15}>2517</Text>
                <Text style={styles.col15}>{Number(order.quantity).toFixed(2)}</Text>
                <Text style={styles.col18}>{Number(order.rate).toFixed(2)}</Text>
                <Text style={styles.col18}>{Number(order.total).toFixed(2)}</Text>
              </View>
            ))}

            {/* GRAND TOTAL */}
            <View style={styles.totalRow}>
              <Text style={{ ...styles.col5 }}></Text>
              <Text style={{ ...styles.col20, fontWeight: "bold", padding: 8 }}>GRAND TOTAL</Text>
              <Text style={styles.col15}></Text>
              <Text style={styles.col15}></Text>
              <Text style={styles.col18}></Text>
              <Text style={{ ...styles.col18, fontWeight: "bold", fontSize: 11, padding: 8 }}>
                ₹ {grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* DECLARATION */}
          <Text style={styles.declaration}>
            Declaration: We declare that this invoice shows the actual price of the goods described and that all
            particulars are true and correct. This is a computer-generated invoice and does not require a physical
            signature.
          </Text>
        </View>

        <View style={styles.footerFixed} fixed>
          <View style={styles.footerContent}>
            {/* BANK DETAILS */}
            <View style={styles.bankSection}>
              <Text style={styles.sectionTitle}>Bank Details:</Text>
              <Text style={styles.bankText}>
                Bank Name: {company?.bank_name || "N/A"}
                {"\n"}
                Account Number: {company?.bank_account || "N/A"}
                {"\n"}
                IFSC Code: {company?.bank_ifsc || "N/A"}
                {"\n"}
                {company?.upi_id && `UPI ID: ${company.upi_id}`}
              </Text>
            </View>

            {/* QR CODE FOR PAYMENT */}
            {qrCodeUrl && (
              <View style={styles.qrSection}>
                <Text style={styles.qrLabel}>Scan to Pay</Text>
                <Image src={qrCodeUrl || "/placeholder.svg"} style={styles.qrCode} />
                <Text style={{ fontSize: 7, marginTop: 3 }}>₹ {grandTotal.toFixed(2)}</Text>
              </View>
            )}

            {/* AUTHORIZED SIGNATORY */}
            <View style={styles.signatureSection}>
              <Text style={{ fontSize: 9, marginBottom: 3 }}>For {company?.company_name || "Company Name"}</Text>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 8, fontWeight: "bold" }}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
