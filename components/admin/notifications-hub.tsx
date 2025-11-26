"use client"

import { useState } from "react"
import { Trash2, Bell, Mail, AlertTriangle, Info, CheckCircle, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockNotifications = [
  {
    id: 1,
    type: "approval",
    title: "New trip approval request",
    description: "Greek Islands Cruise needs your review",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "booking",
    title: "New booking received",
    description: "Sarah Johnson booked Italian Coastline Adventure",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Agent verification needed",
    description: "Wanderlust Journeys account is pending verification",
    time: "3 hours ago",
    read: false,
  },
]

export default function NotificationsHub() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filterType, setFilterType] = useState("all")
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [sendToApp, setSendToApp] = useState<"user" | "agent" | "both">("both")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "unread") return !n.read
    if (filterType === "read") return n.read
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <Bell className="w-4 h-4 text-blue-600" />
      case "booking":
        return <Mail className="w-4 h-4 text-green-600" />
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "approval":
        return "bg-blue-50 border-blue-200"
      case "booking":
        return "bg-green-50 border-green-200"
      case "alert":
        return "bg-yellow-50 border-yellow-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleSendNotification = () => {
    if (notificationMessage.trim()) {
      alert(`Notification sent to ${sendToApp === "both" ? "both apps" : `${sendToApp} app`}: ${notificationMessage}`)
      setNotificationMessage("")
      setIsSendOpen(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Notifications</h2>
        <p className="text-muted-foreground mt-2">System alerts and push notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>Broadcast notifications to user or agent apps</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsSendOpen(true)} className="gap-2">
            <Send className="w-4 h-4" />
            Send Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>{unreadCount} unread notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filterType === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("unread")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filterType === "unread"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilterType("read")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filterType === "read"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Read
            </button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${getNotificationColor(
                    notification.type,
                  )} ${!notification.read ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNotification(notification.id)
                    }}
                    className="p-2 hover:bg-black/10 rounded transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>Broadcast a message to user or agent app</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Send To</label>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSendToApp("user")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sendToApp === "user" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  User App
                </button>
                <button
                  onClick={() => setSendToApp("agent")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sendToApp === "agent"
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Agent App
                </button>
                <button
                  onClick={() => setSendToApp("both")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sendToApp === "both" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Both Apps
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <textarea
                placeholder="Enter notification message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="w-full mt-2 p-3 border border-border rounded-lg text-sm resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSendOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
