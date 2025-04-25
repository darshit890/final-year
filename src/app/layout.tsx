import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Byte Highlight",
  description: "Your source for the latest tech news and insights",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-slate-900 dark:text-white">
              The Byte Highlight
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/login" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
