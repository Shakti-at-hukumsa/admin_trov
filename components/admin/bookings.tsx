"use client"

import { useState } from "react"
import { Search, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Booking, mockBookings } from "@/data/bookings"

interface BookingsProps {
  onViewUserProfile?: (userId: string) => void
}

const ITEMS_PER_PAGE = 8

export default function Bookings({ onViewUserProfile }: BookingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookings] = useState<Booking[]>(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterUser, setFilterUser] = useState("all")
  const [filterTrip, setFilterTrip] = useState("all")
  const [filterAmount, setFilterAmount] = useState<"all" | "0-10000" | "10000-25000" | "25000+">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [sortBy, setSortBy] = useState<"id" | "user" | "trip" | "amount" | "date" | "status">("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = filterUser === "all" || booking.user === filterUser
    const matchesTrip = filterTrip === "all" || booking.trip === filterTrip
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus

    const amount = Number.parseInt(booking.amount.replace(/[₹,]/g, ""))
    const matchesAmount =
      filterAmount === "all" ||
      (filterAmount === "0-10000" && amount <= 10000) ||
      (filterAmount === "10000-25000" && amount > 10000 && amount <= 25000) ||
      (filterAmount === "25000+" && amount > 25000)

    return matchesSearch && matchesUser && matchesTrip && matchesStatus && matchesAmount
  })

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Booking] || ""
    let bVal: any = b[sortBy as keyof Booking] || ""

    if (sortBy === "amount") {
      aVal = Number.parseInt(a.amount.replace(/[₹,]/g, ""))
      bVal = Number.parseInt(b.amount.replace(/[₹,]/g, ""))
    } else if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const paginatedBookings = sortedBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE)

  const uniqueUsers = ["all", ...new Set(bookings.map((b) => b.user))]
  const uniqueTrips = ["all", ...new Set(bookings.map((b) => b.trip))]

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailOpen(true)
  }

  const completedCount = bookings.filter((b) => b.status === "completed").length
  const pendingCount = bookings.filter((b) => b.status === "pending").length

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
        <h2 className="text-3xl font-bold">Bookings</h2>
        <p className="text-muted-foreground mt-2">View all user bookings and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Completed Bookings</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
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
                  placeholder="Search by user name or booking ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filterUser}
                onChange={(e) => {
                  setFilterUser(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {uniqueUsers.map((user) => (
                  <option key={user} value={user}>
                    {user === "all" ? "User: All" : `User: ${user}`}
                  </option>
                ))}
              </select>

              <select
                value={filterTrip}
                onChange={(e) => {
                  setFilterTrip(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                {uniqueTrips.map((trip) => (
                  <option key={trip} value={trip}>
                    {trip === "all" ? "Trip: All" : `Trip: ${trip}`}
                  </option>
                ))}
              </select>

              <select
                value={filterAmount}
                onChange={(e) => {
                  setFilterAmount(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Amount: All</option>
                <option value="0-10000">Amount: ₹0-10K</option>
                <option value="10000-25000">Amount: ₹10K-25K</option>
                <option value="25000+">Amount: ₹25K+</option>
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
                <option value="completed">Status: Completed</option>
                <option value="pending">Status: Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>{sortedBookings.length} bookings found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("id")}
                  >
                    Booking ID <SortIcon field="id" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("user")}
                  >
                    User <SortIcon field="user" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("trip")}
                  >
                    Trip <SortIcon field="trip" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount <SortIcon field="amount" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("date")}
                  >
                    Date <SortIcon field="date" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("status")}
                  >
                    Status <SortIcon field="status" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 font-medium">{booking.id}</td>
                    <td
                      className="py-3 px-4 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => onViewUserProfile?.(booking.userId)}
                    >
                      {booking.user}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.trip}</td>
                    <td className="py-3 px-4 font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
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

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Booking ID</p>
                  <p className="text-sm mt-1">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">User</p>
                  <p className="text-sm mt-1">{selectedBooking.user}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Trip</p>
                  <p className="text-sm mt-1">{selectedBooking.trip}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Amount</p>
                  <p className="text-sm mt-1 font-semibold">{selectedBooking.amount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Participants</p>
                  <p className="text-sm mt-1">{selectedBooking.participants}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <p
                    className={`text-sm mt-1 font-semibold ${selectedBooking.status === "completed" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {selectedBooking.status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
