import { NextResponse } from "next/server"
import { unstable_noStore as noStore } from "next/cache"

const API_BASE = process.env.API_BASE_URL || "https://api.bff.cc.cd"

// 获取默认源
export async function GET() {
  noStore()

  try {
    const res = await fetch(`${API_BASE}/sources/default`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      return NextResponse.json({ error: "获取默认源失败" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("获取默认源失败:", error)
    return NextResponse.json({ error: "获取默认源失败" }, { status: 500 })
  }
}
