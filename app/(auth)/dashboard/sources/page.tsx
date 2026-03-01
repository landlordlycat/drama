"use client"

import { SourceManager } from "./_components/source-manager"

export default function SourcesPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold w-full max-w-4xl mx-auto">播放源管理</h1>
      </div>
      <SourceManager />
    </div>
  )
}
