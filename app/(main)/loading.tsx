import DramaCardSkeleton from "./_components/drama-card-skeleton"

export default function HomeLoading() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <DramaCardSkeleton key={i} />
      ))}
    </div>
  )
}
