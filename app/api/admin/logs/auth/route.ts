import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeOperationLog } from "@/lib/operation-log.server"

const ALLOWED_OPERATIONS = new Set(["LOGIN", "LOGOUT", "CHANGE_PASSWORD"])
const ALLOWED_RESULTS = new Set(["SUCCESS", "FAILURE"])

interface Body {
  operation?: string
  content?: string
  result?: string
  fallbackUserName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json()
    const operation = body.operation?.trim() || ""
    const content = body.content?.trim() || "-"
    const result = body.result?.trim() || ""

    if (!ALLOWED_OPERATIONS.has(operation)) {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }
    if (!ALLOWED_RESULTS.has(result)) {
      return NextResponse.json({ error: "Invalid result" }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: request.headers })
    const userId = session?.user?.id ?? null
    const userName = session?.user?.name ?? session?.user?.email ?? body.fallbackUserName?.trim() ?? "unknown"

    await writeOperationLog({
      userId,
      userName,
      operation,
      content,
      result: result as "SUCCESS" | "FAILURE",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to write auth operation log", error)
    return NextResponse.json({ error: "Failed to write auth operation log" }, { status: 500 })
  }
}

