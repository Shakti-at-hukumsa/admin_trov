"use client"

import { useState } from "react"
import { Search, Download, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Payment, mockPayments } from "@/data/payments"

const ITEMS_PER_PAGE = 8

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [filterType, setFilterType] = useState<"all" | "booking" | "refund" | "payment">("all")
  const [filterMethod, setFilterMethod] = useState<"all" | "card" | "upi" | "netbanking" | "wallet">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "pending" | "failed">("all")
  const [filterAmount, setFilterAmount] = useState<"all" | "0-5000" | "5000-15000" | "15000+">("all")
  const [sortBy, setSortBy] = useState<"transactionId" | "user" | "amount" | "date" | "status">("transactionId")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || payment.type === filterType
    const matchesMethod = filterMethod === "all" || payment.method === filterMethod
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus

    const amount = Number.parseInt(payment.amount.replace(/[₹,]/g, ""))
    const matchesAmount =
      filterAmount === "all" ||
      (filterAmount === "0-5000" && amount <= 5000) ||
      (filterAmount === "5000-15000" && amount > 5000 && amount <= 15000) ||
      (filterAmount === "15000+" && amount > 15000)

    return matchesSearch && matchesType && matchesMethod && matchesStatus && matchesAmount
  })

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Payment] || ""
    let bVal: any = b[sortBy as keyof Payment] || ""

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

  const totalPages = Math.ceil(sortedPayments.length / ITEMS_PER_PAGE)
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDetailOpen(true)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "card":
        return "bg-blue-100 text-blue-800"
      case "upi":
        return "bg-purple-100 text-purple-800"
      case "netbanking":
        return "bg-green-100 text-green-800"
      case "wallet":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-green-100 text-green-800"
      case "refund":
        return "bg-red-100 text-red-800"
      case "payment":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = mockPayments
    .filter((p) => p.status === "success" && p.type !== "refund")
    .reduce((sum, p) => {
      const amount = Number.parseInt(p.amount.replace(/[₹,]/g, ""))
      return sum + amount
    }, 0)

  const successCount = mockPayments.filter((p) => p.status === "success").length
  const pendingCount = mockPayments.filter((p) => p.status === "pending").length

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
        <h2 className="text-3xl font-bold">Payments & Transactions</h2>
        <p className="text-muted-foreground mt-2">Monitor all payment transactions and financial activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-green-600">₹{(totalRevenue / 100000).toFixed(2)}L</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Successful Transactions</p>
              <p className="text-3xl font-bold text-green-600">{successCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Transactions</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-end">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or transaction ID..."
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
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Type: All</option>
                <option value="booking">Type: Booking</option>
                <option value="refund">Type: Refund</option>
                <option value="payment">Type: Payment</option>
              </select>

              <select
                value={filterMethod}
                onChange={(e) => {
                  setFilterMethod(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">Method: All</option>
                <option value="card">Method: Card</option>
                <option value="upi">Method: UPI</option>
                <option value="netbanking">Method: Net Banking</option>
                <option value="wallet">Method: Wallet</option>
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
                <option value="success">Status: Success</option>
                <option value="pending">Status: Pending</option>
                <option value="failed">Status: Failed</option>
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
                <option value="0-5000">Amount: ₹0-5K</option>
                <option value="5000-15000">Amount: ₹5K-15K</option>
                <option value="15000+">Amount: ₹15K+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>{sortedPayments.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("transactionId")}
                  >
                    Transaction ID <SortIcon field="transactionId" />
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("user")}
                  >
                    User <SortIcon field="user" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Trip</th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("amount")}
                  >
                    Amount <SortIcon field="amount" />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Method</th>
                  <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                  <th
                    className="text-left py-3 px-4 font-semibold whitespace-nowrap cursor-pointer hover:bg-muted"
                    onClick={() => toggleSort("date")}
                  >
                    Date <SortIcon field="date" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(payment)}
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">{payment.transactionId}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.user}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{payment.tripName || "-"}</td>
                    <td className="py-3 px-4 font-semibold">{payment.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getTypeColor(payment.type)}`}
                      >
                        {payment.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getMethodColor(payment.method)}`}
                      >
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                          payment.status === "success"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{payment.date}</td>
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
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Transaction ID</p>
                  <p className="text-sm mt-1 font-mono">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">User</p>
                  <p className="text-sm mt-1">{selectedPayment.user}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Amount</p>
                  <p className="text-sm mt-1 font-semibold">{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Type</p>
                  <p
                    className={`text-sm mt-1 font-semibold capitalize ${getTypeColor(selectedPayment.type).split(" ")[0]}`}
                  >
                    {selectedPayment.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Payment Method</p>
                  <p className="text-sm mt-1 capitalize">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <p
                    className={`text-sm mt-1 font-semibold capitalize ${
                      selectedPayment.status === "success"
                        ? "text-green-600"
                        : selectedPayment.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {selectedPayment.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground">Trip</p>
                  <p className="text-sm mt-1">{selectedPayment.tripName || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground">Date</p>
                  <p className="text-sm mt-1">{selectedPayment.date}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
