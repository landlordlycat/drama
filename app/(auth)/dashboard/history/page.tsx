import HistoryList from "./_components/history-list"

export default function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">历史记录</h1>
      </div>
      <HistoryList />
    </div>
  )
}
