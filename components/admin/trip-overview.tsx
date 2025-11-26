"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Users, Calendar, DollarSign, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TripOverviewProps {
  tripId: string
  onBack?: () => void
}

// Mock trip data - in production, fetch from API based on tripId
const mockTripData = {
  id: 1,
  title: "Italian Coastline Adventure",
  agent: "Adventure Tours Co",
  destination: "Italy",
  startDate: "2024-06-15",
  endDate: "2024-06-22",
  participants: 24,
  bookings: 18,
  price: "$1,299",
  duration: "7 days",
  description: "Experience the stunning Italian Riviera with guided tours of coastal towns and beaches",
  highlights: ["Cinque Terre", "Amalfi Coast", "Positano"],
  difficulty: "moderate",
  images: [
    "/italian-coastline.jpg",
    "/amalfi-coast.jpg",
    "/positano-beach.jpg",
    "/cinque-terre-villages.jpg",
  ],
  bookingData: [
    { id: 1, userName: "John Doe", email: "john@example.com", date: "2024-05-01", status: "confirmed", seats: 2 },
    { id: 2, userName: "Jane Smith", email: "jane@example.com", date: "2024-05-05", status: "confirmed", seats: 1 },
    { id: 3, userName: "Robert Johnson", email: "robert@example.com", date: "2024-05-10", status: "pending", seats: 4 },
    { id: 4, userName: "Emily Brown", email: "emily@example.com", date: "2024-05-12", status: "confirmed", seats: 2 },
    {
      id: 5,
      userName: "Michael Davis",
      email: "michael@example.com",
      date: "2024-05-15",
      status: "confirmed",
      seats: 3,
    },
    { id: 6, userName: "Sarah Wilson", email: "sarah@example.com", date: "2024-05-18", status: "confirmed", seats: 2 },
  ],
  activities: [
    { date: "Day 1", activity: "Arrival in Genoa", description: "Check-in at hotel, welcome dinner" },
    {
      date: "Day 2",
      activity: "Cinque Terre Exploration",
      description: "Guided hiking tour through the five villages",
    },
    { date: "Day 3", activity: "Amalfi Coast Drive", description: "Scenic drive along the stunning coastline" },
    { date: "Day 4", activity: "Positano Beach Day", description: "Relax on pristine beaches and local markets" },
    { date: "Day 5", activity: "Island Boat Tour", description: "Visit nearby islands with snorkeling" },
    { date: "Day 6", activity: "Wine Tasting", description: "Regional wine tasting at a local vineyard" },
    { date: "Day 7", activity: "Departure", description: "Final breakfast and departure" },
  ],
}

export default function TripOverview({ tripId, onBack }: TripOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const trip = mockTripData

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">{trip.title}</h2>
          <p className="text-muted-foreground mt-1">Trip ID: {trip.id}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-semibold">{trip.destination}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{trip.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <p className="font-semibold">
                  {trip.bookings}/{trip.participants}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold">{trip.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{trip.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.highlights.map((highlight, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-sm rounded-full text-primary">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Agent</p>
                  <p className="font-medium">{trip.agent}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Difficulty</p>
                  <p
                    className={`font-medium capitalize ${trip.difficulty === "hard" ? "text-red-600" : trip.difficulty === "moderate" ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {trip.difficulty}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">
                  Total Bookings: <span className="text-primary">{trip.bookings}</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">User Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Booking Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Seats</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trip.bookingData.map((booking) => (
                      <tr key={booking.id} className="border-b border-border hover:bg-muted transition-colors">
                        <td className="py-3 px-4 text-blue-600 cursor-pointer hover:underline">{booking.userName}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs break-all">{booking.email}</td>
                        <td className="py-3 px-4">{booking.date}</td>
                        <td className="py-3 px-4 font-medium">{booking.seats}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trip.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Trip image ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                {trip.activities.map((item, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.date}</p>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Start Date</p>
                  <p className="font-medium">{trip.startDate}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">End Date</p>
                  <p className="font-medium">{trip.endDate}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Total Capacity</p>
                  <p className="font-medium">{trip.participants} people</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Available Seats</p>
                  <p className="font-medium">{trip.participants - trip.bookings} seats</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Price per Person</p>
                <p className="font-semibold text-lg">{trip.price}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
