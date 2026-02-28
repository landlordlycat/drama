import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/auth"
import { listOperationLogs } from "@/lib/operation-log.server"

function formatTime(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("zh-CN", { hour12: false })
}

function buildHref(q: string, page: number) {
  const params = new URLSearchParams()
  if (q) params.set("q", q)
  params.set("page", String(page))
  return `/dashboard/logs?${params.toString()}`
}

function mapOperationText(operation: string) {
  if (operation === "LOGIN") return "登录"
  if (operation === "LOGOUT") return "退出登录"
  if (operation === "CHANGE_PASSWORD") return "修改密码"
  return operation
}

function mapResultText(result: string) {
  if (result === "SUCCESS") return "成功"
  if (result === "FAILURE") return "失败"
  return result
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/sign-in")
  }

  const { q = "", page = "1" } = await searchParams
  const currentPage = Math.max(Number(page) || 1, 1)
  const result = await listOperationLogs({
    q,
    page: currentPage,
    pageSize: 20,
    operations: ["LOGIN", "LOGOUT", "CHANGE_PASSWORD"],
    userId: session.user.id,
    userName: session.user.email || session.user.name,
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">日志管理</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">搜索日志</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2">
            <Input name="q" defaultValue={q} placeholder="搜索用户/操作/内容/结果" />
            <Button type="submit">搜索</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">操作日志</CardTitle>
        </CardHeader>
        <CardContent>
          {result.rows.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground">暂无日志数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-2 py-3 font-medium">时间</th>
                    <th className="px-2 py-3 font-medium">用户</th>
                    <th className="px-2 py-3 font-medium">操作</th>
                    <th className="px-2 py-3 font-medium">内容</th>
                    <th className="px-2 py-3 font-medium">结果</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((log) => (
                    <tr key={log.id} className="border-b align-top last:border-b-0">
                      <td className="px-2 py-3 whitespace-nowrap">{formatTime(log.createdAt)}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{log.userName || "-"}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{mapOperationText(log.operation)}</td>
                      <td className="px-2 py-3 break-words">{log.content}</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <Badge variant={log.result === "SUCCESS" ? "default" : "destructive"}>{mapResultText(log.result)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              第 {result.page} / {result.totalPages} 页，共 {result.total} 条
            </span>
            <div className="flex gap-2">
              {result.page <= 1 ? (
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildHref(q, result.page - 1)}>上一页</Link>
                </Button>
              )}
              {result.page >= result.totalPages ? (
                <Button variant="outline" size="sm" disabled>
                  下一页
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildHref(q, result.page + 1)}>下一页</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
