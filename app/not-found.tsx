import Link from "next/link"
import { Flame, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-chart-2/15 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-2xl rounded-3xl  bg-card/85 p-8 text-center  backdrop-blur md:p-12">
        <p className="text-lg font-medium uppercase tracking-[0.35em] text-muted-foreground">Error - 404</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-2xl px-6">
            <Link href="/">
              <Home className="mr-2 size-4" />
              返回首页
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-2xl px-6">
            <Link href="/search">
              <Search className="mr-2 size-4" />
              去搜索
            </Link>
          </Button>

          <Button asChild variant="ghost" size="lg" className="rounded-2xl px-6">
            <Link href="/hot">
              <Flame className="mr-2 size-4" />
              热门内容
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
