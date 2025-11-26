"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!adminLoggedIn) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <AdminDashboard /> : null
}
