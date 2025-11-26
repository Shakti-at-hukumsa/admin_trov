"use client"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Filter } from "lucide-react"

interface AgentProfile {
  id: string
  companyName: string
  email: string
  phone: string
  website: string
  joinedDate: string
  status: "verified" | "pending" | "suspended"
  description: string
  rating: number
  reviewCount: number
  totalBookings: number
  totalTrips: number
  totalRevenue: string
  documentsVerified: {
    businessLicense: boolean
    taxId: boolean
    insurance: boolean
    bankDetails: boolean
  }
  kyc: {
    status: "verified" | "pending" | "rejected"
    submittedDate: string
    verifiedDate?: string
    legalName: string
    registrationNumber: string
    country: string
  }
  trips: Array<{
    id: string
    name: string
    destination: string
    startDate: string
    bookings: number
    revenue: string
  }>
}

const mockAgentProfile: AgentProfile = {
  id: "1",
  companyName: "Adventure Tours Co",
  email: "info@adventuretours.com",
  phone: "+1 (555) 123-4567",
  website: "www.adventuretours.com",
  joinedDate: "2023-06-15",
  status: "verified",
  description: "Premium adventure tour operator specializing in alpine and coastal experiences",
  rating: 4.8,
  reviewCount: 156,
  totalBookings: 156,
  totalTrips: 12,
  totalRevenue: "45,320",
  documentsVerified: {
    businessLicense: true,
    taxId: true,
    insurance: true,
    bankDetails: true,
  },
  kyc: {
    status: "verified",
    submittedDate: "2023-06-10",
    verifiedDate: "2023-06-15",
    legalName: "Adventure Tours Co LLC",
    registrationNumber: "REG-2023-987654",
    country: "United States",
  },
  trips: [
    {
      id: "T-001",
      name: "Alpine Hiking",
      destination: "Switzerland",
      startDate: "2024-06-01",
      bookings: 24,
      revenue: "12,450",
    },
    {
      id: "T-002",
      name: "Coastal Adventure",
      destination: "Portugal",
      startDate: "2024-07-15",
      bookings: 18,
      revenue: "9,800",
    },
    {
      id: "T-003",
      name: "Mountain Expedition",
      destination: "Nepal",
      startDate: "2024-08-01",
      bookings: 15,
      revenue: "8,320",
    },
  ],
}

interface AgentProfileProps {
  onViewTripOverview: (tripId: string) => void
  onBack: () => void
  agentId?: string
}

export default function AgentProfile({ onViewTripOverview, onBack, agentId }: AgentProfileProps) {
  const [profile] = useState<AgentProfile>(mockAgentProfile)
  const [selectedTrip, setSelectedTrip] = useState<(typeof mockAgentProfile.trips)[0] | null>(null)
  const [sortConfig, setSortConfig] = useState<{key: keyof (typeof profile.trips)[0]; direction: 'asc' | 'desc'} | null>(null)
  const [filters, setFilters] = useState({
    name: '',
    destination: '',
    minBookings: '',
    minRevenue: ''
  })

  const DocumentStatus = ({ verified }: { verified: boolean }) =>
    verified ? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Verified</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-yellow-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Pending</span>
      </div>
    )

  const handleSort = (key: keyof (typeof profile.trips)[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTrips = useMemo(() => {
    let filteredTrips = [...profile.trips];

    // Apply filters
    if (filters.name) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.destination) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    if (filters.minBookings) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.bookings >= Number(filters.minBookings)
      );
    }
    if (filters.minRevenue) {
      filteredTrips = filteredTrips.filter(trip => 
        Number(trip.revenue.replace(/,/g, '')) >= Number(filters.minRevenue)
      );
    }

    // Apply sorting
    if (sortConfig !== null) {
      filteredTrips.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric values
        if (typeof aValue === 'string' && aValue.includes(',')) {
          aValue = aValue.replace(/,/g, '');
          bValue = bValue;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredTrips;
  }, [profile.trips, filters, sortConfig]);

  const SortableHeader = ({ columnKey, children }: { columnKey: keyof (typeof profile.trips)[0], children: React.ReactNode }) => (
    <th 
      className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig?.key === columnKey && (
          <ArrowUpDown className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Go back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-bold">{profile.companyName}</h2>
          <p className="text-muted-foreground">Agent Profile</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{profile.totalBookings}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Trips</p>
                <p className="text-2xl font-bold">{profile.totalTrips}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{profile.totalRevenue}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{profile.rating}</span>
                  <span className="text-sm text-muted-foreground">/5.0</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Business details and contact information</CardDescription>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : profile.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                  <p className="text-sm mt-1">{profile.companyName}</p>
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
                  <label className="text-xs font-semibold text-muted-foreground">Website</label>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
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

              {/* Description */}
              <div className="border-t pt-4">
                <label className="text-xs font-semibold text-muted-foreground">Company Description</label>
                <p className="text-sm mt-2 text-muted-foreground">{profile.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KYC & Documents */}
      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* KYC Tab */}
        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Know Your Customer (KYC)
                  </CardTitle>
                  <CardDescription>Identity and business verification</CardDescription>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile.kyc.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : profile.kyc.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {profile.kyc.status.charAt(0).toUpperCase() + profile.kyc.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Legal Name</label>
                  <p className="text-sm mt-2">{profile.kyc.legalName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Registration Number</label>
                  <p className="text-sm mt-2 font-mono">{profile.kyc.registrationNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Country</label>
                  <p className="text-sm mt-2">{profile.kyc.country}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Submitted Date</label>
                  <p className="text-sm mt-2">{profile.kyc.submittedDate}</p>
                </div>
                {profile.kyc.verifiedDate && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Verified Date</label>
                    <p className="text-sm mt-2">{profile.kyc.verifiedDate}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents & Verification
              </CardTitle>
              <CardDescription>Required business documents status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Business License</p>
                    <p className="text-xs text-muted-foreground">Official business registration</p>
                  </div>
                  <DocumentStatus verified={profile.documentsVerified.businessLicense} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Tax ID / VAT Number</p>
                    <p className="text-xs text-muted-foreground">Tax registration document</p>
                  </div>
                  <DocumentStatus verified={profile.documentsVerified.taxId} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Insurance Certificate</p>
                    <p className="text-xs text-muted-foreground">Current liability insurance</p>
                  </div>
                  <DocumentStatus verified={profile.documentsVerified.insurance} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Bank Details</p>
                    <p className="text-xs text-muted-foreground">Verified payment account</p>
                  </div>
                  <DocumentStatus verified={profile.documentsVerified.bankDetails} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trips</CardTitle>
          <CardDescription>{profile.trips.length} trips running</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted/20 rounded-lg">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Trip Name</label>
                <Input 
                  placeholder="Filter by name" 
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Destination</label>
                <Input 
                  placeholder="Filter by destination" 
                  value={filters.destination}
                  onChange={(e) => setFilters({...filters, destination: e.target.value})}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Min Bookings</label>
                <Input 
                  type="number" 
                  placeholder="Min bookings" 
                  value={filters.minBookings}
                  onChange={(e) => setFilters({...filters, minBookings: e.target.value})}
                  className="h-8"
                  min="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Min Revenue (₹)</label>
                <Input 
                  type="number" 
                  placeholder="Min revenue" 
                  value={filters.minRevenue}
                  onChange={(e) => setFilters({...filters, minRevenue: e.target.value})}
                  className="h-8"
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-full"
                  onClick={() => setFilters({name: '', destination: '', minBookings: '', minRevenue: ''})}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <SortableHeader columnKey="name">Trip Name</SortableHeader>
                    <SortableHeader columnKey="destination">Destination</SortableHeader>
                    <SortableHeader columnKey="startDate">Start Date</SortableHeader>
                    <SortableHeader columnKey="bookings">Bookings</SortableHeader>
                    <SortableHeader columnKey="revenue">Revenue</SortableHeader>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
              <tbody>
                {filteredAndSortedTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-3 px-4 font-medium">{trip.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{trip.destination}</td>
                    <td className="py-3 px-4">{trip.startDate}</td>
                    <td className="py-3 px-4">{trip.bookings}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">₹{trip.revenue}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                         onViewTripOverview(trip.id);
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
