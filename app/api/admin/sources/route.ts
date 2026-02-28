import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { SourcesResponse, SourceResponse, CreateSourceInput } from "@/lib/types/source"

const API_BASE = process.env.API_BASE_URL || "https://api.bff.cc.cd"
const API_KEY = process.env.API_ADMIN_KEY || ""

// 获取所有源
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const res = await fetch(`${API_BASE}/sources`, {
      headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
    })
    const data: SourcesResponse = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("获取源列表失败:", error)
    return NextResponse.json({ error: "获取源列表失败" }, { status: 500 })
  }
}

// 创建新源
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body: CreateSourceInput = await request.json()

    const res = await fetch(`${API_BASE}/sources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(error, { status: res.status })
    }

    const data: SourceResponse = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("创建源失败:", error)
    return NextResponse.json({ error: "创建源失败" }, { status: 500 })
  }
}
