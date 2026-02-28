import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// 健康检测
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // const session = await auth.api.getSession({ headers: request.headers })
  // if (!session) {
  //   return NextResponse.json({ error: "未授权" }, { status: 401 })
  // }

  try {
    const { searchParams } = new URL(request.url)
    const sourceUrl = searchParams.get("url")
    const timeout = searchParams.get("timeout") || "10000"

    if (!sourceUrl) {
      return NextResponse.json({ error: "缺少源 URL 参数" }, { status: 400 })
    }

    // 调用源 API 进行健康检测
    const testUrl = sourceUrl.endsWith("/") ? `${sourceUrl}?wd=` : `${sourceUrl}/?wd=`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), parseInt(timeout))

    const healthRes = await fetch(testUrl, {
      method: "GET",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const text = await healthRes.text()

    // 尝试解析 JSON
    try {
      const json = JSON.parse(text)
      const isValidResponse = json && (json.code !== undefined || json.list !== undefined || json.class !== undefined || json.total !== undefined)

      return NextResponse.json({
        healthy: isValidResponse,
        message: isValidResponse ? "API 正常" : "响应格式无效",
      })
    } catch (parseError) {
      return NextResponse.json({
        healthy: false,
        message: "响应不是有效的 JSON",
      })
    }
  } catch (error) {
    return NextResponse.json({
      healthy: false,
      message: error instanceof Error && error.name === "AbortError" ? "请求超时" : "检测失败",
    })
  }
}
