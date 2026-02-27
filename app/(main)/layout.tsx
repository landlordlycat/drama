export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen max-w-300 mx-auto pb-16 md:pb-0">
      {children}
    </div>
  )
}
