import { API_CONFIG } from "@/config/index"
import { DetailParams, DetailResponse, HotParams, HotResponse, ListParams, ListResponse, SearchParams, SearchResponse, TypesParams, TypesResponse } from "../types/api"
import { Source } from "../types/source"
import { da } from "date-fns/locale"

export class ApiService {
  private buildUrl(path: string, params?: object): string {
    const url = new URL(`${API_CONFIG.BASE_API}${path}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value))
        }
      })
    }
    return url.toString()
  }
  //获取列表
  async getList(params?: ListParams): Promise<ListResponse> {
    const defaultSource = await this.getDefaultSource()
    const url = this.buildUrl("/list", { ...params, source: defaultSource.name })
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    return res.json()
  }
  //搜索视频
  async search(params: SearchParams): Promise<SearchResponse> {
    const defaultSource = await this.getDefaultSource()
    const url = this.buildUrl("/search", { ...params, source: defaultSource.name })
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    return res.json()
  }
  //获取视频详情
  async getDetail(params: DetailParams): Promise<DetailResponse> {
    const url = this.buildUrl(`/detail/${params.id}`, {
      source: params.source,
    })
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    return res.json()
  }

  async getHot(params?: HotParams): Promise<HotResponse> {
    const defaultSource = await this.getDefaultSource()

    const url = this.buildUrl("/hot", { ...params, source: defaultSource.name })
    const res = await fetch(url, {
      next: { revalidate: 1800 },
    })

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    return res.json()
  }

  async getTypes(params?: TypesParams): Promise<TypesResponse> {
    const defaultSource = await this.getDefaultSource()
    const url = this.buildUrl("/types", { ...params, source: defaultSource.name })
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // 类型数据缓存时间更长
    })

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }

    return res.json()
  }

  //获取默认源
  async getDefaultSource(): Promise<Source> {
    const url = this.buildUrl("/sources/default")
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`)
    }
    const { data } = await res.json()

    return data
  }
}

export const dramaApiService = new ApiService()
