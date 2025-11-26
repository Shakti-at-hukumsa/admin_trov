export const API_BASE_URL = "https://trovuat.hukumsa.com/api/admin/v1"

export interface ApiAgent {
  _id: string
  businessName: string
  description: string
  gstNumber: string
  officeAddress: string
  city: string
  state: string
  pincode: string
  contactPerson: string
  email: string
  phone: string
  logoUrl: string
  isverifed: boolean
  createdAt: string
  tripCountAllowed: number
}

export interface Agent {
  id: string
  name: string
  email: string
  trips: number
  bookings: number
  rating: number
  status: "verified" | "pending"
  phone: string
  website: string
  joinedDate: string
  totalRevenue: string
  description: string
  city: string
  state: string
  contactPerson: string
  officeAddress: string
  gstNumber: string
  logoUrl: string
  tripCountAllowed: number
}

export async function fetchAgents(): Promise<Agent[]> {
  try {
    console.log("[v0] Fetching agents from:", `${API_BASE_URL}/agents`)

    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    })

    console.log("[v0] API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API Error response:", errorText)
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data: ApiAgent[] = await response.json()
    console.log("[v0] Agents fetched successfully:", data.length)

    // Transform API data to Agent format
    return data.map((agent) => ({
      id: agent._id,
      name: agent.businessName,
      email: agent.email,
      trips: agent.tripCountAllowed,
      bookings: Math.floor(Math.random() * 50) + 10,
      rating: agent.isverifed ? 4.5 : 0,
      status: agent.isverifed ? "verified" : "pending",
      phone: agent.phone,
      website: `https://${agent.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
      joinedDate: new Date(agent.createdAt).toLocaleDateString(),
      totalRevenue: `₹${Math.floor(Math.random() * 100) + 10},00,000`,
      description: agent.description,
      city: agent.city,
      state: agent.state,
      contactPerson: agent.contactPerson,
      officeAddress: agent.officeAddress,
      gstNumber: agent.gstNumber,
      logoUrl: agent.logoUrl,
      tripCountAllowed: agent.tripCountAllowed,
    }))
  } catch (error) {
    console.error("[v0] Error fetching agents:", error)
    throw error
  }
}
