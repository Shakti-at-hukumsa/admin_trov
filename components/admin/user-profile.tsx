"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, TrendingUp, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  location: string
  joinedDate: string
  profileImage: string
  bio: string
  status: "active" | "inactive"
  verificationStatus: "verified" | "pending" | "unverified"
  totalBookings: number
  totalTrips: number
  totalSpent: string
  averageRating: number
  reviewCount: number
  bookingHistory: Array<{
    id: string
    tripName: string
    date: string
    amount: string
    status: "completed" | "upcoming" | "cancelled"
  }>
}

const mockUserProfile: UserProfile = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  joinedDate: "2024-01-15",
  profileImage: "/diverse-profile-avatars.png",
  bio: "Travel enthusiast and adventure seeker. Love exploring new cultures and meeting people.",
  status: "active",
  verificationStatus: "verified",
  totalBookings: 12,
  totalTrips: 5,
  totalSpent: "$6,245",
  averageRating: 4.8,
  reviewCount: 8,
  bookingHistory: [
    { id: "BR-001", tripName: "Italian Coastline", date: "2024-05-15", amount: "$1,299", status: "upcoming" },
    { id: "BR-002", tripName: "Alpine Hiking", date: "2024-04-10", amount: "$899", status: "completed" },
    { id: "BR-003", tripName: "Greek Islands", date: "2024-03-20", amount: "$1,500", status: "completed" },
  ],
}

interface UserProfileProps {
  onBack: () => void
  userId?: string
}

export default function UserProfile({ onBack, userId }: UserProfileProps) {
  const [profile] = useState<UserProfile>(mockUserProfile)
  const [selectedBooking, setSelectedBooking] = useState<(typeof mockUserProfile.bookingHistory)[0] | null>(null)
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Go back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <p className="text-muted-foreground">User Profile</p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                  <p className="text-sm mt-1">{profile.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        profile.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {profile.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {profile.phone}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {profile.location}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Joined Date</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {profile.joinedDate}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground">Bio</label>
                <p className="text-sm mt-2 text-muted-foreground">{profile.bio}</p>
              </div>

              {/* Verification Status */}
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground">Verification Status</label>
                <p className="text-sm mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profile.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : profile.verificationStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="text-2xl font-bold">{profile.totalBookings}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(profile.totalBookings / 20) * 100}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Trips</span>
                  <span className="text-2xl font-bold">{profile.totalTrips}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{profile.totalSpent}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                  <span className="text-muted-foreground">Average Rating</span>
                </div>
                <p className="text-lg font-bold">{profile.averageRating}/5.0</p>
                <p className="text-xs text-muted-foreground">{profile.reviewCount} reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Booking History
          </CardTitle>
          <CardDescription>{profile.bookingHistory.length} bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Trip Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {profile.bookingHistory.map((booking) => (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4">{booking.tripName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.date}</td>
                    <td className="py-3 px-4 font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setIsBookingDetailOpen(true)
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isBookingDetailOpen} onOpenChange={setIsBookingDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>{selectedBooking?.tripName}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Booking ID</label>
                  <p className="text-sm mt-1 font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Trip</label>
                  <p className="text-sm mt-1">{selectedBooking.tripName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Date</label>
                  <p className="text-sm mt-1">{selectedBooking.date}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Amount</label>
                  <p className="text-sm mt-1 font-semibold">{selectedBooking.amount}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedBooking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedBooking.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
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
