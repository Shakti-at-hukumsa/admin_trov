"use client"

import { useState } from "react"
import { MessageSquare, CheckCircle2, Clock, Search, Filter, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Ticket {
  id: string
  title: string
  user: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  date: string
  description: string
}

export default function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [resolution, setResolution] = useState("")

  // Mock data for tickets
  const tickets: Ticket[] = [
    {
      id: "TKT-001",
      title: "Login issues on mobile app",
      user: "John Doe",
      status: "open",
      priority: "high",
      date: "2023-11-10",
      description: "I'm unable to log in to the mobile app. I keep getting an error message saying 'Invalid credentials' even though I'm sure my password is correct."
    },
    {
      id: "TKT-002",
      title: "Payment not reflecting",
      user: "Sarah Johnson",
      status: "in-progress",
      priority: "high",
      date: "2023-11-09",
      description: "I made a payment 3 days ago but it's still not reflecting in my account. The amount has been deducted from my bank account."
    },
    {
      id: "TKT-003",
      title: "Need to update email address",
      user: "Michael Chen",
      status: "open",
      priority: "medium",
      date: "2023-11-08",
      description: "I need to update my registered email address as I no longer have access to the old one."
    },
    {
      id: "TKT-004",
      title: "Feature request: Dark mode",
      user: "Emily Wilson",
      status: "resolved",
      priority: "low",
      date: "2023-11-05",
      description: "It would be great to have a dark mode option in the app for better visibility at night."
    },
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>
      case 'in-progress':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">In Progress</Badge>
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleResolveTicket = (ticketId: string) => {
    // In a real app, you would update the ticket status in your database here
    console.log(`Resolving ticket ${ticketId} with resolution:`, resolution)
    // Show success message or update UI accordingly
    setSelectedTicket(null)
    setResolution("")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">View and manage user support requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold">Status</div>
                {['all', 'open', 'in-progress', 'resolved'].map((status) => (
                  <DropdownMenuItem 
                    key={status} 
                    onSelect={() => setStatusFilter(status as any)}
                    className="cursor-pointer"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
                <Separator className="my-1" />
                <div className="px-2 py-1.5 text-sm font-semibold">Priority</div>
                {['all', 'high', 'medium', 'low'].map((priority) => (
                  <DropdownMenuItem 
                    key={priority} 
                    onSelect={() => setPriorityFilter(priority as any)}
                    className="cursor-pointer"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{ticket.user}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{ticket.date}</span>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">No tickets found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-3">
          {selectedTicket ? (
            <div className="border rounded-lg overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedTicket.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {selectedTicket.user} • {selectedTicket.date}
                      </span>
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newStatus = selectedTicket.status === 'open' ? 'in-progress' : 'resolved'
                          // In a real app, you would update the ticket status in your database here
                          console.log(`Updating ticket ${selectedTicket.id} status to ${newStatus}`)
                          // For now, we'll just update the local state
                          setSelectedTicket({...selectedTicket, status: newStatus as any})
                        }}
                      >
                        {selectedTicket.status === 'open' ? (
                          <Clock className="w-4 h-4 mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        {selectedTicket.status === 'open' ? 'Mark as In Progress' : 'Mark as Resolved'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-auto">
                <h3 className="font-medium mb-4">Description</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{selectedTicket.description}</p>
                </div>

                {selectedTicket.status !== 'resolved' && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Resolution</h3>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <label htmlFor="resolution" className="text-sm font-medium leading-none">
                          Add a resolution note
                        </label>
                        <textarea
                          id="resolution"
                          rows={4}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe the resolution or steps taken..."
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setResolution("")}
                        >
                          Clear
                        </Button>
                        <Button 
                          onClick={() => handleResolveTicket(selectedTicket.id)}
                          disabled={!resolution.trim()}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve Ticket
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No ticket selected</h3>
              <p className="text-sm text-muted-foreground mb-4">Select a ticket from the list to view details</p>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Create New Ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
