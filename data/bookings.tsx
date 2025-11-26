export interface Booking {
  id: string
  user: string
  trip: string
  amount: string
  date: string
  status: "completed" | "pending"
  email: string
  participants: number
  userId: string
}

export const mockBookings: Booking[] = [
  {
    id: "BR-001",
    user: "Priya Sharma",
    trip: "Manali-Leh Motorcycle",
    amount: "₹64,950",
    date: "2024-05-15",
    status: "completed",
    email: "priya.sharma@example.com",
    participants: 2,
    userId: "user-001",
  },
  {
    id: "BR-002",
    user: "Rajesh Patel",
    trip: "Kerala Backwater Cruise",
    amount: "₹49,950",
    date: "2024-05-14",
    status: "completed",
    email: "rajesh.patel@example.com",
    participants: 1,
    userId: "user-002",
  },
  {
    id: "BR-003",
    user: "Vikram Singh",
    trip: "Goa Beach Experience",
    amount: "₹89,900",
    date: "2024-05-12",
    status: "pending",
    email: "vikram.singh@example.com",
    participants: 2,
    userId: "user-004",
  },
  {
    id: "BR-004",
    user: "Sneha Desai",
    trip: "Rajasthan Golden Triangle",
    amount: "₹79,950",
    date: "2024-05-10",
    status: "completed",
    email: "sneha.desai@example.com",
    participants: 1,
    userId: "user-005",
  },
  {
    id: "BR-005",
    user: "Arjun Kapoor",
    trip: "Meghalaya Waterfalls Trek",
    amount: "₹57,450",
    date: "2024-05-08",
    status: "completed",
    email: "arjun.kapoor@example.com",
    participants: 3,
    userId: "user-006",
  },
]
