import type React from "react"
import type { Metadata } from "next"
import { GeistSans, GeistMono } from "geist/font"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "Explore Karawang - Tourism & Culinary Guide",
  description: "Discover the best tourism destinations and culinary delights in Karawang, West Java",
  icons: {
    icon: [
      {
        url: "/logogram.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    shortcut: "/logogram.png",
    apple: {
      url: "/logogram.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
