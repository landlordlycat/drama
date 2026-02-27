"use client"

import { Button } from "@/components/ui/button"

interface HomeErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: HomeErrorProps) {
  return (
    <div className="min-h-screen  flex items-center text-3xl justify-center flex-col gap-2">
      <span>ERROR - {error.message && "Something went wrong"}</span>
      <Button variant="default" className=" px-4 py-2 rounded-md" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
