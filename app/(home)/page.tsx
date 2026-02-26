import DramaHeader from "@/components/layout/drama-header"
import { Suspense } from "react"
import HomeList from "./_components/home-list"
import HomeLoading from "./loading"

export default async function Home() {
  return (
    <main className="min-h-screen ">
      <div className="relative z-10">
        {/* header */}
        <DramaHeader />
        {/* drama content */}
        <section className="px-6 sm:px-10 py-10">
          <Suspense fallback={<HomeLoading />}>
            <HomeList />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
