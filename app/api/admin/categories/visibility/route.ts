import { NextRequest, NextResponse } from "next/server"
import { getHiddenTypeIds, setManyTypesVisible, setTypeVisible } from "@/lib/category-visibility.server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const sourceName = request.nextUrl.searchParams.get("sourceName") || ""
    if (!sourceName) {
      return NextResponse.json({ error: "sourceName is required" }, { status: 400 })
    }

    const hiddenTypeIds = await getHiddenTypeIds(sourceName)
    return NextResponse.json({ success: true, data: { hiddenTypeIds } })
  } catch (error) {
    console.error("Failed to get category visibility", error)
    return NextResponse.json({ error: "Failed to get category visibility" }, { status: 500 })
  }
}

interface UpdateVisibilityBody {
  sourceName: string
  typeId?: number
  typeIds?: number[]
  visible: boolean
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body: UpdateVisibilityBody = await request.json()
    const sourceName = body.sourceName?.trim()

    if (!sourceName) {
      return NextResponse.json({ error: "sourceName is required" }, { status: 400 })
    }

    if (Array.isArray(body.typeIds)) {
      await setManyTypesVisible(sourceName, body.typeIds.map((id) => Number(id)), body.visible)
      return NextResponse.json({ success: true })
    }

    const typeId = Number(body.typeId)
    if (!Number.isInteger(typeId) || typeId <= 0) {
      return NextResponse.json({ error: "typeId must be a positive integer" }, { status: 400 })
    }

    await setTypeVisible(sourceName, typeId, body.visible)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update category visibility", error)
    return NextResponse.json({ error: "Failed to update category visibility" }, { status: 500 })
  }
}
