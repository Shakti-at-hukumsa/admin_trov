"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, MapPin, BookOpen, AlertCircle } from "lucide-react"

const statsData = [
  { label: "Total Users", value: "2,584", icon: Users, change: "+12%" },
  { label: "Active Agents", value: "384", icon: UserCheck, change: "+8%" },
  { label: "Active Trips", value: "1,249", icon: MapPin, change: "+23%" },
  { label: "Total Bookings", value: "5,620", icon: BookOpen, change: "+15%" },
]

const chartData = [
  { month: "Jan", users: 4000, bookings: 2400 },
  { month: "Feb", users: 3000, bookings: 1398 },
  { month: "Mar", users: 2000, bookings: 9800 },
  { month: "Apr", users: 2780, bookings: 3908 },
  { month: "May", users: 1890, bookings: 4800 },
  { month: "Jun", users: 2390, bookings: 3800 },
]

const pieData = [
  { name: "Approved", value: 60 },
  { name: "Pending", value: 30 },
  { name: "Rejected", value: 10 },
]

const colors = ["#10b981", "#f59e0b", "#ef4444"]

export default function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
            <CardDescription>Users and bookings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Approvals Status</CardTitle>
            <CardDescription>Trip approvals distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </div>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "Trip Approval", description: "Italy Coastline Adventure waiting approval", time: "2 hours ago" },
              { type: "Agent Verification", description: "New agent registration from John Doe", time: "4 hours ago" },
              { type: "Booking Issue", description: "Refund request for booking #BR-2024-001", time: "1 day ago" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
