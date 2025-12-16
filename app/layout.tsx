import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { QueryProvider } from "@/components/providers/QueryProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
