"use client"

import { useState } from "react"
import { Search, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Trip, mockTrips } from "@/data/trips"

interface TripManagementProps {
  onViewAgentProfile?: (agentId: string) => void
  onViewTripOverview?: (tripId: string) => void
}

const ITEMS_PER_PAGE = 8

export default function TripManagement({ onViewAgentProfile, onViewTripOverview }: TripManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterAgent, setFilterAgent] = useState("all")
  const [filterDestination, setFilterDestination] = useState("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [filterCapacity, setFilterCapacity] = useState<"all" | "low" | "medium" | "high">("all")
  const [filterBookings, setFilterBookings] = useState<"all" | "0-5" | "5-10" | "10+">("all")
  const [sortBy, setSortBy] = useState<"title" | "agent" | "destination" | "startDate" | "price">("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAgent = filterAgent === "all" || trip.agent === filterAgent
    const matchesDestination = filterDestination === "all" || trip.destination === filterDestination
    const matchesStatus = filterStatus === "all" || trip.status === filterStatus

    const capacityPercent = (trip.bookings / trip.participants) * 100
    const matchesCapacity =
      filterCapacity === "all" ||
      (filterCapacity === "low" && capacityPercent < 50) ||
      (filterCapacity === "medium" && capacityPercent >= 50 && capacityPercent < 80) ||
      (filterCapacity === "high" && capacityPercent >= 80)

    const matchesBookings =
      filterBookings === "all" ||
      (filterBookings === "0-5" && trip.bookings <= 5) ||
      (filterBookings === "5-10" && trip.bookings > 5 && trip.bookings <= 10) ||
      (filterBookings === "10+" && trip.bookings > 10)

    return matchesSearch && matchesAgent && matchesDestination && matchesStatus && matchesCapacity && matchesBookings
  })

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Trip] || ""
    let bVal: any = b[sortBy as keyof Trip] || ""

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    } else if (typeof aVal === "number") {
      // Keep numeric values as is
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedTrips.length / ITEMS_PER_PAGE)
  const paginatedTrips = sortedTrips.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const uniqueAgents = ["all", ...new Set(mockTrips.map((t) => t.agent))]
  const uniqueDestinations = ["all", ...new Set(mockTrips.map((t) => t.destination))]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleViewTripOverview = (tripId: string) => {
    onViewTripOverview?.(tripId)
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Trips</h2>
        <p className="text-muted-foreground mt-2">Monitor and manage all group trips</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-end">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by trip name or destination..."
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
                value={filterAgent}
                onChange={(e) => {
                  setFilterAgent(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {uniqueAgents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent === "all" ? "Agent: All" : `Agent: ${agent}`}
                  </option>
                ))}
              </select>

              <select
                value={filterDestination}
                onChange={(e) => {
                  setFilterDestination(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {uniqueDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest === "all" ? "Destination: All" : `Destination: ${dest}`}
                  </option>
                ))}
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
                <option value="approved">Status: Approved</option>
                <option value="pending">Status: Pending</option>
              </select>

              <select
                value={filterCapacity}
                onChange={(e) => {
                  setFilterCapacity(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Capacity: All</option>
                <option value="low">Capacity: Low (&lt;50%)</option>
                <option value="medium">Capacity: Medium (50-80%)</option>
                <option value="high">Capacity: High (80%+)</option>
              </select>

              <select
                value={filterBookings}
                onChange={(e) => {
                  setFilterBookings(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Bookings: All</option>
                <option value="0-5">Bookings: 0-5</option>
                <option value="5-10">Bookings: 5-10</option>
                <option value="10+">Bookings: 10+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trips</CardTitle>
          <CardDescription>{sortedTrips.length} trips found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("title")}
                  >
                    Trip Name <SortIcon field="title" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("agent")}
                  >
                    Agent <SortIcon field="agent" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("destination")}
                  >
                    Destination <SortIcon field="destination" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("startDate")}
                  >
                    Date <SortIcon field="startDate" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Capacity</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 font-medium max-w-xs truncate">{trip.title}</td>
                    <td
                      className="py-3 px-4 text-blue-600 cursor-pointer hover:underline whitespace-nowrap"
                      onClick={() => onViewAgentProfile?.(trip.agentId.toString())}
                    >
                      {trip.agent}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{trip.destination}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs">{trip.startDate}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {trip.bookings}/{trip.participants}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          trip.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewTripOverview(trip.id.toString())}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="View trip overview"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
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
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Description</p>
                <p className="text-sm mt-2">{selectedTrip.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Trip Title</p>
                  <p className="text-sm mt-1">{selectedTrip.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Agent</p>
                  <p
                    className="text-sm mt-1 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onViewAgentProfile?.(selectedTrip.agentId.toString())}
                  >
                    {selectedTrip.agent}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Price per Person</p>
                  <p className="text-sm mt-1 font-semibold">{selectedTrip.price}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Duration</p>
                  <p className="text-sm mt-1">{selectedTrip.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Difficulty</p>
                  <p className={`text-sm mt-1 font-semibold capitalize ${getDifficultyColor(selectedTrip.difficulty)}`}>
                    {selectedTrip.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Start Date</p>
                  <p className="text-sm mt-1">{selectedTrip.startDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Capacity</p>
                  <p className="text-sm mt-1">
                    {selectedTrip.bookings}/{selectedTrip.participants}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTrip.highlights.map((highlight, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary/10 text-xs rounded text-primary">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
