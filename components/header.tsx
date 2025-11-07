"use client"

import Link from "next/link"
import { Menu, Navigation } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 h-16 relative flex items-center justify-between">
        {/* Logo */}
        <a href="/">
        <div className="flex items-center gap-2 min-w-0 z-10">
            <img src="/logogram.png" alt="Explore Karawang Logo" className="h-10 w-10 object-contain" />
            <span className="text-base md:text-xl font-bold truncate">Explore Karawang</span>
          </div>
        </a>

        {/* Desktop Navigation - Absolutely Centered */}
        <nav className="hidden md:flex gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="#destinations" className="text-sm font-medium hover:text-emerald-600 transition-colors whitespace-nowrap">
            Destinations
          </Link>
          <Link href="#culinary" className="text-sm font-medium hover:text-emerald-600 transition-colors whitespace-nowrap">
            Culinary
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-emerald-600 transition-colors whitespace-nowrap">
            Contact
          </Link>
        </nav>

        {/* Mobile Navigation - Burger Menu */}
        <div className="flex-shrink-0 z-10">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="#destinations"
                  className="text-lg font-medium hover:text-emerald-600 transition-colors py-2 border-b"
                >
                  Destinations
                </Link>
                <Link
                  href="#culinary"
                  className="text-lg font-medium hover:text-emerald-600 transition-colors py-2 border-b"
                >
                  Culinary
                </Link>
                <Link
                  href="#contact"
                  className="text-lg font-medium hover:text-emerald-600 transition-colors py-2 border-b"
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
