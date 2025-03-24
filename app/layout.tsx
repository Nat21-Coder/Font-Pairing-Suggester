import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Font Pairing Suggester",
  description: "Find complementary font pairings for your design projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
            <Toaster />
        {children}
        </Suspense>
      </body>
    </html>
  )
}

