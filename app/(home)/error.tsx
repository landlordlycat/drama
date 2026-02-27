"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface HomeErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: HomeErrorProps) {
  const router = useRouter()
  return (
    <div className="min-h-screen  flex items-center text-3xl justify-center flex-col gap-2">
      <span>ERROR - {error.message && "Something went wrong"} </span>
      <Button variant="default" className=" px-4 py-2 rounded-md" onClick={() => reset()}>
        Try again
      </Button>
      <Button variant="link" onClick={() => router.replace("/")}>
        <Home /> Go Home
      </Button>
    </div>
  )
}
