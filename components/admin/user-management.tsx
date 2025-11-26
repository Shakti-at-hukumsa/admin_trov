"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type User, mockUsers } from "@/data/users"

interface UserManagementProps {
  onViewProfile?: (userId: string) => void
}

const ITEMS_PER_PAGE = 8

export default function UserManagement({ onViewProfile }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [filterBookings, setFilterBookings] = useState<"all" | "0-5" | "5-10" | "10+">("all")
  const [filterTrips, setFilterTrips] = useState<"all" | "0-3" | "3-6" | "6+">("all")
  const [sortBy, setSortBy] = useState<"name" | "joined" | "bookings" | "trips">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesBookings =
      filterBookings === "all" ||
      (filterBookings === "0-5" && user.bookings <= 5) ||
      (filterBookings === "5-10" && user.bookings > 5 && user.bookings <= 10) ||
      (filterBookings === "10+" && user.bookings > 10)
    const matchesTrips =
      filterTrips === "all" ||
      (filterTrips === "0-3" && user.trips <= 3) ||
      (filterTrips === "3-6" && user.trips > 3 && user.trips <= 6) ||
      (filterTrips === "6+" && user.trips > 6)

    return matchesSearch && matchesStatus && matchesBookings && matchesTrips
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: any = a[sortBy as keyof User] || ""
    let bVal: any = b[sortBy as keyof User] || ""

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  const handleNameClick = (userId: string) => {
    onViewProfile?.(userId)
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
        <h2 className="text-3xl font-bold">Users</h2>
        <p className="text-muted-foreground mt-2">Manage and monitor all app users</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
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
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Status: All</option>
                <option value="active">Status: Active</option>
                <option value="inactive">Status: Inactive</option>
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

              <select
                value={filterTrips}
                onChange={(e) => {
                  setFilterTrips(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Trips: All</option>
                <option value="0-3">Trips: 0-3</option>
                <option value="3-6">Trips: 3-6</option>
                <option value="6+">Trips: 6+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{sortedUsers.length} users found</CardDescription>
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
                    Name <SortIcon field="name" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("joined")}
                  >
                    Joined <SortIcon field="joined" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("trips")}
                  >
                    Trips <SortIcon field="trips" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("bookings")}
                  >
                    Bookings <SortIcon field="bookings" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td
                      className="py-3 px-4 text-blue-600 cursor-pointer hover:underline font-medium"
                      onClick={() => handleNameClick(user.id.toString())}
                    >
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
                    <td className="py-3 px-4">{user.trips}</td>
                    <td className="py-3 px-4">{user.bookings}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
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
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Name</p>
                  <p className="text-sm mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Email</p>
                  <p className="text-sm mt-1 break-all">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Location</p>
                  <p className="text-sm mt-1">{selectedUser.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Joined Date</p>
                  <p className="text-sm mt-1">{selectedUser.joined}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Total Spent</p>
                  <p className="text-sm mt-1">{selectedUser.totalSpent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
