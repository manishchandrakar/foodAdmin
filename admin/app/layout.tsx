import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import QueryProvider from "@/components/providers/QueryProvider"
import "./globals.css"

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryProvider>
    </body>
  </html>
)

export default RootLayout