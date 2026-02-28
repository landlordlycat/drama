import { dramaApiService } from "@/lib/services/drama-api"
import { getHiddenTypeIds } from "@/lib/category-visibility.server"
import CategoryTree from "./category-tree"

export default async function CategoryManager() {
  const defaultSource = await dramaApiService.getDefaultSource()
  const { types } = await dramaApiService.getTypes({ source: defaultSource.name })
  const hiddenTypeIds = await getHiddenTypeIds(defaultSource.name)

  return <CategoryTree types={types} sourceName={defaultSource.name} initialHiddenTypeIds={hiddenTypeIds} />
}
