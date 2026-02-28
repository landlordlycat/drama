import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { SourceResponse, UpdateSourceInput } from "@/lib/types/source"

const API_BASE = process.env.API_BASE_URL || "https://api.bff.cc.cd"
const API_KEY = process.env.API_ADMIN_KEY || ""

// 更新源
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: UpdateSourceInput = await request.json()

    const res = await fetch(`${API_BASE}/sources/${id}`, {
      method: "PUT",
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
    console.error("更新源失败:", error)
    return NextResponse.json({ error: "更新源失败" }, { status: 500 })
  }
}

// 删除源
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const res = await fetch(`${API_BASE}/sources/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(error, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除源失败:", error)
    return NextResponse.json({ error: "删除源失败" }, { status: 500 })
  }
}
