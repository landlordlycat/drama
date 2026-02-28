// 播放源类型定义

export interface Source {
  id: number
  name: string
  url: string
  is_enabled: 0 | 1
  is_default: 0 | 1
  timeout: number
  remark: string
  created_at: number
  updated_at: number
}

export interface CreateSourceInput {
  name: string
  url: string
  timeout?: number
  remark?: string
}

export interface UpdateSourceInput {
  name?: string
  url?: string
  is_enabled?: 0 | 1
  is_default?: 0 | 1
  timeout?: number
  remark?: string
}

export interface SourcesResponse {
  success: boolean
  data: Source[]
  total: number
}

export interface SourceResponse {
  success: boolean
  data: Source
}
