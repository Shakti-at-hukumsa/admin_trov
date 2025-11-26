"use client"

import { BarChart3, Users, UserCheck, MapPin, BookOpen, CheckCircle, Bell, X, LogOut, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

type ActiveTab = "dashboard" | "users" | "agents" | "trips" | "bookings" | "approvals" | "notifications" | "payments" | "user-profile" | "agent-profile" | "trip-overview" | "trip-overview-agent" | "support"

interface SidebarProps {
  open: boolean
  onClose: () => void
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

export default function Sidebar({ open, onClose, activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "agents", label: "Agents", icon: UserCheck },
    { id: "trips", label: "Trips", icon: MapPin },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "approvals", label: "Approvals", icon: CheckCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: BarChart3 },
    { id: "support", label: "Support & Tickets", icon: MessageSquare },
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/login")
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-50 md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Trov Admin</h1>
          </div>
          <button className="md:hidden text-sidebar-foreground" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
