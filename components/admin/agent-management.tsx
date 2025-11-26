"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockAgents } from "@/data/agents"

interface AgentManagementProps {
  onViewProfile?: (agentId: string) => void
}

const ITEMS_PER_PAGE = 8

export default function AgentManagement({ onViewProfile }: AgentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAgent, setSelectedAgent] = useState<(typeof mockAgents)[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterCity, setFilterCity] = useState("all")
  const [filterTrips, setFilterTrips] = useState<"all" | "0-5" | "5-10" | "10+">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "pending">("all")
  const [sortBy, setSortBy] = useState<"name" | "city" | "trips" | "status">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const agents = mockAgents

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = filterCity === "all" || agent.name.toLowerCase().includes(filterCity.toLowerCase())
    const matchesTrips =
      filterTrips === "all" ||
      (filterTrips === "0-5" && agent.trips <= 5) ||
      (filterTrips === "5-10" && agent.trips > 5 && agent.trips <= 10) ||
      (filterTrips === "10+" && agent.trips > 10)
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus

    return matchesSearch && matchesCity && matchesTrips && matchesStatus
  })

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let aVal: any = a[sortBy as keyof (typeof mockAgents)[0]] || ""
    let bVal: any = b[sortBy as keyof (typeof mockAgents)[0]] || ""

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedAgents.length / ITEMS_PER_PAGE)
  const paginatedAgents = sortedAgents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const uniqueCities = ["all", ...new Set(agents.map((a) => a.name.split(" ")[0]))]

  const totalBookings = agents.reduce((sum, agent) => sum + agent.bookings, 0)
  const activeTrips = agents.reduce((sum, agent) => sum + agent.trips, 0)
  const inactiveAgents = agents.filter((a) => a.status === "pending").length
  const completeTrips = Math.floor(totalBookings * 0.85)
  const monthlyRevenue = agents.reduce((sum, agent) => {
    const revenue = Number.parseInt(agent.totalRevenue.replace(/[₹,]/g, ""))
    return sum + revenue
  }, 0)

  const handleNameClick = (agentId: number) => {
    onViewProfile?.(agentId.toString())
  }

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return <span className="text-xs ml-1 text-muted-foreground">↕</span>
    return <span className="text-xs ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString()}`
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Agents</h2>
        <p className="text-muted-foreground mt-2">Manage trip operators and tour companies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">Total Bookings</p>
              <p className="text-2xl font-bold mt-2">{totalBookings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">Active Trips</p>
              <p className="text-2xl font-bold mt-2">{activeTrips}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">Inactive Agents</p>
              <p className="text-2xl font-bold mt-2">{inactiveAgents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">Complete Trips</p>
              <p className="text-2xl font-bold mt-2">{completeTrips}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(monthlyRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCity}
                onChange={(e) => {
                  setFilterCity(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city === "all" ? "Company: All" : `Company: ${city}`}
                  </option>
                ))}
              </select>

              <select
                value={filterTrips}
                onChange={(e) => {
                  setFilterTrips(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Trips: All</option>
                <option value="0-5">Trips: 0-5</option>
                <option value="5-10">Trips: 5-10</option>
                <option value="10+">Trips: 10+</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Status: All</option>
                <option value="verified">Status: Verified</option>
                <option value="pending">Status: Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
          <CardDescription>{sortedAgents.length} agents found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("name")}
                  >
                    Company <SortIcon field="name" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Bookings</th>
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("trips")}
                  >
                    Trips <SortIcon field="trips" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("status")}
                  >
                    Status <SortIcon field="status" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAgents.map((agent) => (
                  <tr key={agent.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td
                      className="py-3 px-4 font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleNameClick(agent.id)}
                    >
                      {agent.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs break-all">{agent.email}</td>
                    <td className="py-3 px-4">{agent.bookings}</td>
                    <td className="py-3 px-4">{agent.trips}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          agent.status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Description</p>
                <p className="text-sm mt-2">{selectedAgent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Company Name</p>
                  <p className="text-sm mt-1">{selectedAgent.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Email</p>
                  <p className="text-sm mt-1 break-all text-xs">{selectedAgent.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{selectedAgent.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Rating</p>
                  <p className="text-sm mt-1">{selectedAgent.rating} ⭐</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Trips</p>
                  <p className="text-sm mt-1">{selectedAgent.trips}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <p className="text-sm mt-1 capitalize">{selectedAgent.status}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
