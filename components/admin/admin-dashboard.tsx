"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"
import DashboardOverview from "./dashboard-overview"
import UserManagement from "./user-management"
import AgentManagement from "./agent-management"
import TripManagement from "./trip-management"
import Bookings from "./bookings"
import Approvals from "./approvals"
import NotificationsHub from "./notifications-hub"
import UserProfile from "./user-profile"
import AgentProfile from "./agent-profile"
import TripOverview from "./trip-overview"
import Payments from "./payments"
import Support from "./support"
 
type ActiveTab = "dashboard" | "users" | "agents" | "trips" | "bookings" | "approvals" | "notifications" | "payments" | "user-profile" | "agent-profile" | "trip-overview" | "trip-overview-agent" | "support";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)

  const handleViewUserProfile = (userId: string) => {
    setSelectedUserId(userId)
    setActiveTab("user-profile")
  }

  const handleViewAgentProfile = (agentId: string) => {
    setSelectedAgentId(agentId)
    setActiveTab("agent-profile")
  }

  const handleViewTripOverview = (tripId: string) => {
    setSelectedTripId(tripId)
    if(activeTab==="agent-profile"){
      setActiveTab("trip-overview-agent")
    }
    else{
      setActiveTab("trip-overview")
    }
    
  }

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement onViewProfile={handleViewUserProfile} />
      case "agents":
        return <AgentManagement onViewProfile={handleViewAgentProfile} />
      case "trips":
        return (
          <TripManagement onViewAgentProfile={handleViewAgentProfile} onViewTripOverview={handleViewTripOverview} />
        )
      case "bookings":
        return <Bookings onViewUserProfile={handleViewUserProfile} />
      case "approvals":
        return <Approvals onViewAgentProfile={handleViewAgentProfile} />
      case "notifications":
        return <NotificationsHub />
      case "payments":
        return <Payments />
      case "user-profile":
        return <UserProfile userId={selectedUserId || "1"} onBack={() => setActiveTab("users")} />
      case "agent-profile":
        return <AgentProfile agentId={selectedAgentId || "1"}  onViewTripOverview={handleViewTripOverview}  onBack={() => setActiveTab("agents")} />
      case "trip-overview":
        return <TripOverview tripId={selectedTripId || "1"} onBack={() => setActiveTab("trips")} />
      case "trip-overview-agent":
        return <TripOverview tripId={selectedTripId || "1"} onBack={() => setActiveTab("agent-profile")} />
      case "support":
        return <Support />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto bg-background">{renderContent()}</main>
      </div>
    </div>
  )
}
