export interface Payment {
  id: string
  transactionId: string
  user: string
  amount: string
  type: "booking" | "refund" | "payment"
  method: "card" | "upi" | "netbanking" | "wallet"
  status: "success" | "pending" | "failed"
  date: string
  tripName?: string
}

export const mockPayments: Payment[] = [
  {
    id: "1",
    transactionId: "TXN-20240515-001",
    user: "Priya Sharma",
    amount: "₹64,950",
    type: "booking",
    method: "card",
    status: "success",
    date: "2024-05-15",
    tripName: "Manali-Leh Motorcycle",
  },
  {
    id: "2",
    transactionId: "TXN-20240514-002",
    user: "Rajesh Patel",
    amount: "₹49,950",
    type: "booking",
    method: "upi",
    status: "success",
    date: "2024-05-14",
    tripName: "Kerala Backwater Cruise",
  },
  {
    id: "3",
    transactionId: "TXN-20240513-003",
    user: "Anjali Verma",
    amount: "₹15,000",
    type: "refund",
    method: "card",
    status: "success",
    date: "2024-05-13",
    tripName: "Goa Beach Experience",
  },
  {
    id: "4",
    transactionId: "TXN-20240512-004",
    user: "Vikram Singh",
    amount: "₹89,900",
    type: "booking",
    method: "netbanking",
    status: "pending",
    date: "2024-05-12",
    tripName: "Goa Beach Experience",
  },
  {
    id: "5",
    transactionId: "TXN-20240511-005",
    user: "Neha Gupta",
    amount: "₹25,000",
    type: "payment",
    method: "wallet",
    status: "success",
    date: "2024-05-11",
    tripName: "Rajasthan Golden Triangle",
  },
  {
    id: "6",
    transactionId: "TXN-20240510-006",
    user: "Sneha Desai",
    amount: "₹79,950",
    type: "booking",
    method: "card",
    status: "success",
    date: "2024-05-10",
    tripName: "Rajasthan Golden Triangle",
  },
  {
    id: "7",
    transactionId: "TXN-20240509-007",
    user: "Arjun Kapoor",
    amount: "₹57,450",
    type: "booking",
    method: "upi",
    status: "success",
    date: "2024-05-08",
    tripName: "Meghalaya Waterfalls Trek",
  },
  {
    id: "8",
    transactionId: "TXN-20240507-008",
    user: "Priya Sharma",
    amount: "₹20,000",
    type: "refund",
    method: "card",
    status: "success",
    date: "2024-05-07",
    tripName: "Manali-Leh Motorcycle",
  },
]
