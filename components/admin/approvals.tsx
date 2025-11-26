"use client"

import { useState } from "react"
import { Search, Check, X, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockApprovals = [
  {
    id: "APR-001",
    agentName: "Adventure Tours Co",
    type: "trip",
    title: "Greek Islands Cruise",
    status: "pending",
    date: "2024-05-15",
    description: "Island-hop through the Greek islands with luxury cruise accommodations",
    agentId: "agent-001",
  },
  {
    id: "APR-002",
    agentName: "Wanderlust Journeys",
    type: "trip",
    title: "Bali Beach Escape",
    status: "pending",
    date: "2024-05-14",
    description: "Relax on pristine beaches and explore ancient temples",
    agentId: "agent-002",
  },
  {
    id: "APR-003",
    agentName: "Global Adventures",
    type: "agent_verification",
    title: "Agent Verification Request",
    status: "pending",
    date: "2024-05-13",
    description: "KYC and business verification for Global Adventures",
    agentId: "agent-003",
  },
]

interface Approval {
  id: string
  agentName: string
  type: "trip" | "agent_verification"
  title: string
  status: "pending" | "approved" | "rejected"
  date: string
  description: string
  agentId: string
}

interface ApprovalsProps {
  onViewAgentProfile?: (agentId: string) => void
}

export default function Approvals({ onViewAgentProfile }: ApprovalsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals)
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterType, setFilterType] = useState<"all" | "trip" | "agent_verification">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [sortBy, setSortBy] = useState<"id" | "agentName" | "title" | "date">("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || approval.type === filterType
    const matchesStatus = filterStatus === "all" || approval.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Approval] || ""
    let bVal: any = b[sortBy as keyof Approval] || ""

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder === "asc" ? comparison : -comparison
  })

  const pendingCount = approvals.filter((a) => a.status === "pending").length

  const handleApprove = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "approved" } : a)))
    setIsDetailOpen(false)
  }

  const handleReject = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "rejected" } : a)))
    setIsDetailOpen(false)
  }

  const handleViewDetails = (approval: Approval) => {
    setSelectedApproval(approval)
    setIsDetailOpen(true)
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
        <h2 className="text-3xl font-bold">Approvals</h2>
        <p className="text-muted-foreground mt-2">Review and approve agent trips and verifications</p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Require your action</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by agent name or title..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Type: All</option>
                <option value="trip">Type: Trip</option>
                <option value="agent_verification">Type: Verification</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Status: All</option>
                <option value="pending">Status: Pending</option>
                <option value="approved">Status: Approved</option>
                <option value="rejected">Status: Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Approvals</CardTitle>
          <CardDescription>
            {sortedApprovals.filter((a) => a.status === "pending").length} items pending
          </CardDescription>
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
                    ID <SortIcon field="id" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("agentName")}
                  >
                    Agent <SortIcon field="agentName" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Type</th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("title")}
                  >
                    Title <SortIcon field="title" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("date")}
                  >
                    Date <SortIcon field="date" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedApprovals.map((approval) => (
                  <tr key={approval.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 font-medium">{approval.id}</td>
                    <td
                      className="py-3 px-4 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => onViewAgentProfile?.(approval.agentId)}
                    >
                      {approval.agentName}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                        {approval.type === "trip" ? "Trip" : "Verification"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{approval.title}</td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{approval.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          approval.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : approval.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {approval.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(approval)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {approval.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="p-2 hover:bg-green-100 rounded transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
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
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>Review and approve this request</DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">{selectedApproval.title}</p>
                <p className="text-xs text-muted-foreground">{selectedApproval.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Approval ID</p>
                  <p className="text-sm mt-1">{selectedApproval.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Agent</p>
                  <p className="text-sm mt-1">{selectedApproval.agentName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Type</p>
                  <p className="text-sm mt-1 capitalize">{selectedApproval.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Date Submitted</p>
                  <p className="text-sm mt-1">{selectedApproval.date}</p>
                </div>
              </div>

              {selectedApproval.status === "pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
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
