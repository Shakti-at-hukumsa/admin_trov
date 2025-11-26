"use client"

import { useState } from "react"
import { Search, Check, X, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockBookings = [
  {
    id: "BR-001",
    user: "Sarah Johnson",
    trip: "Italian Coastline",
    amount: "$1,299",
    date: "2024-05-15",
    status: "pending",
    type: "booking",
    email: "sarah@example.com",
    participants: 2,
    notes: "First-time user with excellent profile",
  },
  {
    id: "BR-002",
    user: "Michael Chen",
    trip: "Alpine Hiking",
    amount: "$899",
    date: "2024-05-14",
    status: "approved",
    type: "booking",
    email: "michael@example.com",
    participants: 1,
    notes: "Verified user, multiple bookings",
  },
  {
    id: "RF-001",
    user: "Emily Rodriguez",
    trip: "Greek Islands",
    amount: "$1,500",
    date: "2024-05-13",
    status: "pending",
    type: "refund",
    email: "emily@example.com",
    participants: 3,
    notes: "Cancellation due to medical emergency",
  },
  {
    id: "BR-003",
    user: "David Kumar",
    trip: "Bali Beach",
    amount: "$1,199",
    date: "2024-05-12",
    status: "approved",
    type: "booking",
    email: "david@example.com",
    participants: 2,
    notes: "Premium member",
  },
  {
    id: "RF-002",
    user: "Lisa Anderson",
    trip: "Provence Wine",
    amount: "$599",
    date: "2024-05-11",
    status: "rejected",
    type: "refund",
    email: "lisa@example.com",
    participants: 1,
    notes: "Refund rejected - outside cancellation window",
  },
  {
    id: "BR-004",
    user: "James Wilson",
    trip: "Tokyo Modern",
    amount: "$2,199",
    date: "2024-05-10",
    status: "pending",
    type: "booking",
    email: "james@example.com",
    participants: 4,
    notes: "Large group booking",
  },
]

interface Booking {
  id: string
  user: string
  trip: string
  amount: string
  date: string
  status: "pending" | "approved" | "rejected"
  type: "booking" | "refund"
  email: string
  participants: number
  notes: string
}

export default function BookingApprovals() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterBy, setFilterBy] = useState<"all" | "user" | "agent">("all")
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const handleApprove = (bookingId: string) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b)))
  }

  const handleReject = (bookingId: string) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "rejected" } : b)))
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailOpen(true)
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const approvedCount = bookings.filter((b) => b.status === "approved").length
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Bookings & Approvals</h2>
        <p className="text-muted-foreground mt-2">Review and manage all booking requests and refunds</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Require your action</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">This period</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              <p className="text-xs text-muted-foreground">This period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col md:flex-row md:items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by booking ID or user..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as "all" | "user" | "agent")}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground flex items-center gap-2"
            >
              <option value="all">All Bookings</option>
              <option value="user">User Bookings</option>
              <option value="agent">Agent Bookings</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings & Refunds</CardTitle>
          <CardDescription>{filteredBookings.length} items found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Trip</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 font-medium">{booking.id}</td>
                    <td className="py-3 px-4">{booking.user}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{booking.trip}</td>
                    <td className="py-3 px-4 font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.type === "booking" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {booking.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span
                          className={
                            booking.status === "pending"
                              ? "text-yellow-600"
                              : booking.status === "approved"
                                ? "text-green-600"
                                : "text-red-600"
                          }
                        >
                          {booking.status}
                        </span>
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
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="p-2 hover:bg-green-100 rounded transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="p-2 hover:bg-red-100 rounded transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Review booking information and notes</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-3">{selectedBooking.user}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Booking ID</p>
                    <p className="font-mono text-primary">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="capitalize">{selectedBooking.type}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Email</p>
                  <p className="text-sm mt-1 break-all">{selectedBooking.email}</p>
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
                  <p className="text-xs font-semibold text-muted-foreground">Date Submitted</p>
                  <p className="text-sm mt-1">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <p className="text-sm mt-1 capitalize">
                    <span
                      className={
                        selectedBooking.status === "pending"
                          ? "text-yellow-600"
                          : selectedBooking.status === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                      }
                    >
                      {selectedBooking.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Notes</p>
                <p className="text-sm bg-muted p-3 rounded text-muted-foreground">{selectedBooking.notes}</p>
              </div>

              {selectedBooking.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      handleApprove(selectedBooking.id)
                      setIsDetailOpen(false)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedBooking.id)
                      setIsDetailOpen(false)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
