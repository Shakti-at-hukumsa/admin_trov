"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, Bell, User, Search, X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export default function Header({ sidebarOpen, onSidebarToggle }: HeaderProps) {
  const router = useRouter()
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onSidebarToggle} className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users, trips, bookings..."
              className="border-0 bg-transparent placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
            {showCreateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    router.push('/users/create')
                    setShowCreateDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Create User
                </button>
                <button
                  onClick={() => {
                    router.push('/agents/create')
                    setShowCreateDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Create Agent
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowNotificationModal(true)}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          <button onClick={() => setShowAdminModal(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notification Settings</h2>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Email Notifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm">New user registrations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm">New trip approvals needed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm">New booking requests</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm">System alerts</span>
                </label>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="font-medium text-sm">Push Notifications</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm">Enable push notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Mute during business hours (5 PM - 9 AM)</span>
                </label>
              </div>

              <div className="border-t border-border pt-4">
                <Button onClick={() => setShowNotificationModal(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Admin Profile</h2>
              <button onClick={() => setShowAdminModal(false)} className="p-1 hover:bg-muted rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Admin User</h3>
                <p className="text-sm text-muted-foreground">admin@trov.com</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Admin ID</label>
                  <p className="text-sm font-medium">ADM-2024-001</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <p className="text-sm font-medium">Super Administrator</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Login Time</label>
                  <p className="text-sm font-medium">Today at 9:30 AM</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Last Active</label>
                  <p className="text-sm font-medium">5 minutes ago</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Two-Factor Auth
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setShowAdminModal(false)
                  // Add logout logic here
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
