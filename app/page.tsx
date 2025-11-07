"use client"

import * as React from "react"
// Page-level imports trimmed; component-specific icons and utilities were removed because local component implementations were deleted.

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
// Local prop interfaces removed; shared components encapsulate their own props.

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DestinationsSection } from "@/components/destinations-section"
import { CulinarySection } from "@/components/culinary-section"
import { CallToActionSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function KarawangTourism() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <DestinationsSection />
        <CulinarySection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}

// Using shared components from components/* files for sections and footer.

// Removed unused local card components in favor of shared components to satisfy lint rules.
