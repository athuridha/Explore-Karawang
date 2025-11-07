"use client"

import { AdminLogout } from "@/components/logout-button"
import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left: Page Title - extra padding on mobile for burger button */}
        <div className="flex-1 pl-12 md:pl-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 hidden sm:flex"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  Admin
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <AdminLogout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
