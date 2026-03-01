"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Loader2, Plus, MoreVertical, Star, Pencil, Trash2, Globe, Clock, MessageSquare, RefreshCw } from "lucide-react"
import type { Source, CreateSourceInput } from "@/lib/types/source"

type HealthStatus = "unknown" | "checking" | "healthy" | "unhealthy"

interface SourceWithHealth extends Source {
  health: HealthStatus
}

export function SourceManager() {
  const [sources, setSources] = useState<SourceWithHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 表单相关
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSource, setEditingSource] = useState<Source | null>(null)
  const [deletingSource, setDeletingSource] = useState<Source | null>(null)

  // 表单状态
  const [formData, setFormData] = useState<CreateSourceInput>({
    name: "",
    url: "",
    timeout: 10000,
    remark: "",
  })

  // 加载源列表
  useEffect(() => {
    loadSources()
  }, [])

  const loadSources = async () => {
    try {
      const res = await fetch("/api/admin/sources")
      const data = await res.json()
      if (data.data) {
        const sourcesWithHealth: SourceWithHealth[] = data.data.map((s: Source) => ({
          ...s,
          health: "unknown" as HealthStatus,
        }))
        setSources(sourcesWithHealth)
      }
    } catch (error) {
      toast.error("加载源列表失败")
    } finally {
      setLoading(false)
    }
  }

  // 健康检测
  const checkHealth = async (source: SourceWithHealth) => {
    // 更新状态为检测中
    setSources((prev) => prev.map((s) => (s.id === source.id ? { ...s, health: "checking" } : s)))

    try {
      // 通过 API 代理进行健康检测，避免 CORS 问题
      const res = await fetch(`/api/admin/sources/${source.id}/health?url=${encodeURIComponent(source.url)}&timeout=${source.timeout}`)
      const data = await res.json()

      if (data.healthy) {
        setSources((prev) => prev.map((s) => (s.id === source.id ? { ...s, health: "healthy" } : s)))
      } else {
        throw new Error(data.message || "检测失败")
      }
    } catch (error) {
      setSources((prev) => prev.map((s) => (s.id === source.id ? { ...s, health: "unhealthy" } : s)))
    }
  }

  // 重新检测所有源
  const checkAllHealth = () => {
    sources.forEach((s) => checkHealth(s))
  }

  // 打开添加对话框
  const openAddDialog = () => {
    setEditingSource(null)
    setFormData({ name: "", url: "", timeout: 10000, remark: "" })
    setDialogOpen(true)
  }

  // 打开编辑对话框
  const openEditDialog = (source: Source) => {
    setEditingSource(source)
    setFormData({
      name: source.name,
      url: source.url,
      timeout: source.timeout,
      remark: source.remark,
    })
    setDialogOpen(true)
  }

  // 打开删除确认对话框
  const openDeleteDialog = (source: Source) => {
    setDeletingSource(source)
    setDeleteDialogOpen(true)
  }

  // 提交表单（添加/编辑）
  const handleSubmit = async () => {
    if (!formData.name || !formData.url) {
      toast.error("请填写源名称和 URL")
      return
    }

    setSaving(true)
    try {
      if (editingSource) {
        // 编辑
        const res = await fetch(`/api/admin/sources/${editingSource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error()
        toast.success("更新成功")
      } else {
        // 添加
        const res = await fetch("/api/admin/sources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error()
        toast.success("添加成功")
      }
      setDialogOpen(false)
      loadSources()
    } catch (error) {
      toast.error(editingSource ? "更新失败" : "添加失败")
    } finally {
      setSaving(false)
    }
  }

  // 删除源
  const handleDelete = async () => {
    if (!deletingSource) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/sources/${deletingSource.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast.success("删除成功")
      setDeleteDialogOpen(false)
      loadSources()
    } catch (error) {
      toast.error("删除失败")
    } finally {
      setSaving(false)
    }
  }

  // 切换启用状态
  const toggleEnabled = async (source: Source) => {
    const newEnabled = source.is_enabled === 1 ? 0 : 1
    try {
      const res = await fetch(`/api/admin/sources/${source.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_enabled: newEnabled }),
      })
      if (!res.ok) throw new Error()
      // 乐观更新
      setSources((prev) => prev.map((s) => (s.id === source.id ? { ...s, is_enabled: newEnabled } : s)))
      toast.success(newEnabled === 1 ? "已启用" : "已禁用")
    } catch (error) {
      toast.error("操作失败")
    }
  }

  // 设为默认源
  const setDefault = async (source: Source) => {
    try {
      const res = await fetch(`/api/admin/sources/${source.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: 1 }),
      })
      if (!res.ok) throw new Error()
      // 更新本地状态
      setSources((prev) =>
        prev.map((s) => ({
          ...s,
          is_default: s.id === source.id ? 1 : 0,
        })),
      )
      toast.success(`已将 ${source.name} 设为默认源`)
    } catch (error) {
      toast.error("操作失败")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {sources.length} 个播放源，{sources.filter((s) => s.is_enabled === 1).length} 个已启用
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={checkAllHealth}>
              <RefreshCw className="mr-1 size-4" />
              重新检测
            </Button>
            <Button onClick={openAddDialog}>
              <Plus className="mr-1 size-4" />
              添加源
            </Button>
          </div>
        </div>

        {/* 源列表 */}
        <div className="grid gap-3">
          {sources.map((source) => (
            <Card key={source.id} className={source.is_enabled === 0 ? "opacity-60" : ""}>
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* 健康状态指示器 */}
                    <HealthIndicator status={source.health} />
                    <CardTitle className="text-base font-medium">{source.name}</CardTitle>
                    {source.is_default === 1 && (
                      <Badge variant="default" className="text-xs">
                        <Star className="mr-1 size-3" />
                        默认
                      </Badge>
                    )}
                    {source.is_enabled === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        已禁用
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{source.is_enabled === 1 ? "已启用" : "已禁用"}</span>
                    <Switch checked={source.is_enabled === 1} onCheckedChange={() => toggleEnabled(source)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => checkHealth(source)}>
                          <RefreshCw className="mr-2 size-4" />
                          重新检测
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(source)}>
                          <Pencil className="mr-2 size-4" />
                          编辑
                        </DropdownMenuItem>
                        {source.is_default !== 1 && (
                          <DropdownMenuItem onClick={() => setDefault(source)}>
                            <Star className="mr-2 size-4" />
                            设为默认
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openDeleteDialog(source)} className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="size-4" />
                    <span className="truncate" title={source.url}>
                      {source.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4" />
                    <span>超时: {source.timeout}ms</span>
                  </div>
                  {source.remark && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="size-4" />
                      <span className="truncate" title={source.remark}>
                        {source.remark}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {sources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p>暂无播放源</p>
              <Button variant="outline" className="mt-4" onClick={openAddDialog}>
                添加第一个源
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSource ? "编辑播放源" : "添加播放源"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">源名称 *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="例如: bfzy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">API 地址 *</Label>
              <Input id="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="例如: https://example.com/api.php/provide/vod/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">超时时间 (ms)</Label>
              <Input id="timeout" type="number" value={formData.timeout} onChange={(e) => setFormData({ ...formData, timeout: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">备注</Label>
              <Input id="remark" value={formData.remark} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} placeholder="例如: 暴风资源" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editingSource ? "保存" : "添加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            确定要删除播放源 <strong>{deletingSource?.name}</strong> 吗？此操作不可撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// 健康状态指示器组件
function HealthIndicator({ status }: { status: HealthStatus }) {
  switch (status) {
    case "checking":
      return (
        <div className="flex items-center justify-center w-3 h-3" title="检测中">
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
        </div>
      )
    case "healthy":
      return (
        <div className="flex items-center justify-center w-3 h-3" title="正常">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      )
    case "unhealthy":
      return (
        <div className="flex items-center justify-center w-3 h-3" title="异常">
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
      )
    default:
      return null
  }
}
