import { Skeleton } from "@/components/ui/skeleton"

export default function DramaCardSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="aspect-2/3 w-full rounded-lg" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
