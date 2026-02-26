import DramaHeader from "./_components/drama-header"
import { Suspense } from "react"
import HomeList from "./_components/home-list"
import HomeLoading from "./loading"

export default async function Home() {
  return (
    <main className="min-h-screen px-30">
      <div className="relative z-10">
        {/* header */}
        <DramaHeader />
        {/* drama content */}
        <section className="py-10">
          <Suspense fallback={<HomeLoading />}>
            <HomeList />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
