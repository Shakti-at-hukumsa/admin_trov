export interface Trip {
  id: number
  title: string
  agent: string
  destination: string
  startDate: string
  endDate: string
  participants: number
  bookings: number
  status: "approved" | "pending"
  price: string
  duration: string
  description: string
  highlights: string[]
  difficulty: "easy" | "moderate" | "hard"
  agentId: number
}

export const mockTrips: Trip[] = [
  {
    id: 1,
    title: "Manali-Leh Motorcycle Adventure",
    agent: "Himalayan Adventures India",
    destination: "Ladakh",
    startDate: "2024-06-15",
    endDate: "2024-06-22",
    participants: 24,
    bookings: 18,
    status: "approved",
    price: "₹64,950",
    duration: "7 days",
    description: "Experience the thrilling Manali-Leh highway on motorcycle through the stunning Himalayas.",
    highlights: ["Rohtang Pass", "Leh Palace", "Pangong Lake", "Khardung La"],
    difficulty: "hard",
    agentId: 1,
  },
  {
    id: 2,
    title: "Kerala Backwater Houseboat Cruise",
    agent: "Kerala Backwaters Tours",
    destination: "Kottayam, Kerala",
    startDate: "2024-07-10",
    endDate: "2024-07-15",
    participants: 12,
    bookings: 9,
    status: "approved",
    price: "₹49,950",
    duration: "5 days",
    description: "Relax on a traditional houseboat in the serene backwaters of Kerala.",
    highlights: ["Backwater Cruise", "Ayurvedic Massage", "Local Cuisine", "Village Tours"],
    difficulty: "easy",
    agentId: 2,
  },
  {
    id: 3,
    title: "Rajasthan Golden Triangle Tour",
    agent: "Rajasthan Heritage Tours",
    destination: "Jaipur, Agra, Delhi",
    startDate: "2024-08-01",
    endDate: "2024-08-09",
    participants: 35,
    bookings: 22,
    status: "pending",
    price: "₹79,950",
    duration: "8 days",
    description: "Explore the magnificent palaces and monuments of India's most iconic destinations.",
    highlights: ["Taj Mahal", "City Palace", "Hawa Mahal", "Fort Agra"],
    difficulty: "easy",
    agentId: 3,
  },
  {
    id: 4,
    title: "Goa Beach & Dive Experience",
    agent: "Goa Beach & Culture Travels",
    destination: "North Goa",
    startDate: "2024-07-22",
    endDate: "2024-07-28",
    participants: 20,
    bookings: 8,
    status: "pending",
    price: "₹44,975",
    duration: "6 days",
    description: "Enjoy pristine beaches, water sports, and vibrant nightlife in Goa.",
    highlights: ["Beach Resorts", "Scuba Diving", "Water Sports", "Beach Parties"],
    difficulty: "easy",
    agentId: 4,
  },
  {
    id: 5,
    title: "Meghalaya Waterfalls & Caves Trek",
    agent: "North East India Explorer",
    destination: "Meghalaya",
    startDate: "2024-09-05",
    endDate: "2024-09-09",
    participants: 15,
    bookings: 12,
    status: "approved",
    price: "₹57,450",
    duration: "4 days",
    description: "Trek through the lush green hills of Meghalaya and explore breathtaking waterfalls.",
    highlights: ["Khasi Hills", "Living Root Bridges", "Waterfalls", "Local Villages"],
    difficulty: "moderate",
    agentId: 5,
  },
]
