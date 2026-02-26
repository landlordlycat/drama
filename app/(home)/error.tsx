"use client"
interface HomeErrorProps {
  error: Error
  reset: () => void
}
export default function HomeError({ error, reset }: HomeErrorProps) {
  return <div>HomeError</div>
}
