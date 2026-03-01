import CollectList from "./_components/collect-list"

export default function CollectPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">收藏夹</h1>
      </div>
      <CollectList />
    </div>
  )
}
