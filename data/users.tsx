export interface User {
  id: number
  name: string
  email: string
  joined: string
  trips: number
  status: "active" | "inactive"
  bookings: number
  phone: string
  location: string
  totalSpent: string
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    joined: "2024-01-15",
    trips: 5,
    status: "active",
    bookings: 12,
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    totalSpent: "₹3,12,250",
  },
  {
    id: 2,
    name: "Rajesh Patel",
    email: "rajesh.patel@example.com",
    joined: "2024-02-20",
    trips: 3,
    status: "active",
    bookings: 7,
    phone: "+91 98765 54321",
    location: "Bangalore, Karnataka",
    totalSpent: "₹1,57,500",
  },
  {
    id: 3,
    name: "Anjali Verma",
    email: "anjali.verma@example.com",
    joined: "2024-03-10",
    trips: 0,
    status: "inactive",
    bookings: 0,
    phone: "+91 98765 65432",
    location: "Delhi, NCR",
    totalSpent: "₹0",
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    joined: "2024-01-25",
    trips: 8,
    status: "active",
    bookings: 18,
    phone: "+91 98765 76543",
    location: "Gurgaon, Haryana",
    totalSpent: "₹4,45,000",
  },
  {
    id: 5,
    name: "Sneha Desai",
    email: "sneha.desai@example.com",
    joined: "2024-04-05",
    trips: 2,
    status: "active",
    bookings: 4,
    phone: "+91 98765 87654",
    location: "Pune, Maharashtra",
    totalSpent: "₹90,000",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    email: "arjun.kapoor@example.com",
    joined: "2024-02-10",
    trips: 4,
    status: "active",
    bookings: 9,
    phone: "+91 98765 98765",
    location: "Hyderabad, Telangana",
    totalSpent: "₹2,25,000",
  },
  {
    id: 7,
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    joined: "2024-03-20",
    trips: 6,
    status: "active",
    bookings: 14,
    phone: "+91 98765 01234",
    location: "Kolkata, West Bengal",
    totalSpent: "₹3,60,000",
  },
]
