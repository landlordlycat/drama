import CategoryManager from "./_components/category-manager"

export default function CategoriesManagePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">分类管理</h1>
      </div>
      <CategoryManager />
    </div>
  )
}
