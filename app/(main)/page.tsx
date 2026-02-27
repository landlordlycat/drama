import DramaHeader from "@/components/layout/drama-header"
import { Suspense } from "react"
import HomeList from "./_components/home-list"
import HomeLoading from "./loading"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Drama - 精彩短剧在线观看",
  description: "Drama 是一个优质的短剧观看平台，提供海量热门短剧、精选推荐、分类浏览，让您随时随地享受精彩内容。",
}
export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const currentPage = page ? Number(page) : 1

  return (
    <main className="min-h-screen ">
      <div className="relative z-10">
        {/* header */}
        <DramaHeader />
        {/* drama content */}
        <section className="px-6 sm:px-10 py-10">
          <Suspense fallback={<HomeLoading />}>
            <HomeList page={currentPage} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
