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
  Tags,
  ChevronDown,
  Settings,
  Star,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  href?: string
  label: string
  icon: React.ReactNode
  children?: NavItem[]
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
    label: "Destinations",
    icon: <MapPin className="w-5 h-5" />,
    children: [
      {
        href: "/admin/destinations",
        label: "All Destinations",
        icon: <MapPin className="w-4 h-4" />,
      },
      {
        href: "/admin/destinations/categories",
        label: "Categories",
        icon: <Tags className="w-4 h-4" />,
      },
      {
        href: "/admin/destinations/submissions",
        label: "Submissions",
        icon: <MapPin className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Culinary",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    children: [
      {
        href: "/admin/culinary",
        label: "All Restaurants",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        href: "/admin/culinary/categories",
        label: "Categories",
        icon: <Tags className="w-4 h-4" />,
      },
      {
        href: "/admin/culinary/submissions",
        label: "Submissions",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
    ],
  },
  {
    href: "/admin/ratings",
    label: "Ratings & Reviews",
    icon: <Star className="w-5 h-5" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
]

function NavItemComponent({
  item,
  isExpanded,
  onToggle,
  isActive,
  onNavigate,
  pathname,
}: {
  item: NavItem
  isExpanded: boolean
  onToggle: () => void
  isActive: boolean
  onNavigate: () => void
  pathname: string
}) {
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            isActive
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/50"
              : "text-slate-300 hover:bg-slate-700 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded ? "rotate-180" : ""
            )}
          />
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1 ml-2 pl-4 border-l border-slate-700">
            {item.children && item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href || "#"}
                onClick={onNavigate}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm",
                    pathname === child.href
                      ? "bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-400"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  )}
                >
                  {child.icon}
                  <span className="font-medium">{child.label}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.href || "#"} onClick={onNavigate}>
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
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const checkIfActive = (item: NavItem): boolean => {
    if (item.href) {
      return item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.href || (child.href && pathname.startsWith(child.href)))
    }
    return false
  }

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
          {navItems.map((item) => (
            <NavItemComponent
              key={item.label}
              item={item}
              isExpanded={expandedItems.has(item.label)}
              onToggle={() => toggleExpand(item.label)}
              isActive={checkIfActive(item)}
              onNavigate={() => setIsOpen(false)}
              pathname={pathname}
            />
          ))}
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
