"use client"

// Redirecting to use the existing /media page

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DataMediaPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/media")
  }, [router])

  return null
}
