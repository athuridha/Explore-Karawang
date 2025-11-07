"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  UtensilsCrossed,
  Menu,
  X,
  Computer,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/carousel",
    label: "Carousel",
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    href: "/admin/destinations",
    label: "Destinations",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    href: "/admin/culinary",
    label: "Culinary",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 left-3 z-50 md:hidden bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo / Branding */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all">
              <Computer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Explore Karawang</h2>
              <p className="text-xs text-emerald-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            // Exact match for dashboard, startsWith for others
            const isActive = item.href === "/admin" 
              ? pathname === "/admin"
              : pathname.startsWith(item.href)

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/50"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            © 2025 Explore Karawang Admin
          </p>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
