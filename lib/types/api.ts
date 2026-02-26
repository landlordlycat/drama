// API 类型定义

export interface Episode {
  name: string
  url: string
}

export interface DramaDetail {
  id: number
  title: string
  introduction: string
  actors: string
  director: string
  total: number
  area: string
  year: string
  language: string
  cover: string
  typeId: number
  typeName: string
  status: number
  remarks: string
  doubanUrl: string
  doubanScore: string
  time: string
  episodes: Episode[]
}

export interface DramaList {
  id: number
  title: string
  typeId: number
  time: string
  remarks: string
}

export interface ListParams {
  page?: number
  limit?: number
  typeId?: number
  source?: string
}

export interface SearchParams {
  wd: string
  page?: number | string
  limit?: number | string
  source?: string
}

export interface DetailParams {
  id: number
  source?: string
}

export interface ListResponse {
  page: number
  pageCount: number
  total: number
  typeName: string
  list: DramaList[]
}

export type TypesParams = Pick<DetailParams, "source">

export interface TypeChild {
  id: number
  typeName: string
}

// 主分类类型（可能有子分类，也可能没有）
export interface TypeItem {
  id: number
  typeName: string
  children?: TypeChild[]
}

// 分类列表响应类型
export interface TypesResponse {
  total: number
  types: TypeItem[]
}

export type HotParams = ListParams
export type HotResponse = DramaList[]
export type SearchResponse = ListResponse
export type DetailResponse = DramaDetail
