export interface Agent {
  id: number
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
}

export const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Himalayan Adventures India",
    email: "info@himalayanaventures.com",
    trips: 10,
    bookings: 20,
    rating: 4.5,
    status: "verified",
    phone: "+91 98765 43210",
    website: "https://himalayanaventures.com",
    joinedDate: "2022-01-01",
    totalRevenue: "₹50,00,000",
    description: "Premium tour operator specializing in Himalayan trekking and adventure tours.",
  },
  {
    id: 2,
    name: "Kerala Backwaters Tours",
    email: "contact@keralabackwaters.com",
    trips: 5,
    bookings: 15,
    rating: 3.8,
    status: "pending",
    phone: "+91 98765 54321",
    website: "https://keralabackwaters.com",
    joinedDate: "2022-02-01",
    totalRevenue: "₹25,00,000",
    description: "Specialized in Kerala backwater cruises and houseboat experiences.",
  },
  {
    id: 3,
    name: "Rajasthan Heritage Tours",
    email: "explore@rajasthanheritagetours.com",
    trips: 15,
    bookings: 35,
    rating: 4.8,
    status: "verified",
    phone: "+91 98765 65432",
    website: "https://rajasthanheritagetours.com",
    joinedDate: "2021-06-15",
    totalRevenue: "₹1,25,00,000",
    description: "Premier heritage tour company offering authentic Rajasthan palace tours.",
  },
  {
    id: 4,
    name: "Goa Beach & Culture Travels",
    email: "hello@goatravels.com",
    trips: 8,
    bookings: 28,
    rating: 4.6,
    status: "verified",
    phone: "+91 98765 76543",
    website: "https://goatravels.com",
    joinedDate: "2021-03-10",
    totalRevenue: "₹90,00,000",
    description: "Specialists in Goa beach vacations, water sports, and cultural experiences.",
  },
  {
    id: 5,
    name: "North East India Explorer",
    email: "tours@northeastindia.com",
    trips: 12,
    bookings: 32,
    rating: 4.7,
    status: "verified",
    phone: "+91 98765 87654",
    website: "https://northeastindia.com",
    joinedDate: "2021-08-20",
    totalRevenue: "₹1,10,00,000",
    description: "Expert guides for Assam, Meghalaya, and Northeast region tours.",
  },
]
