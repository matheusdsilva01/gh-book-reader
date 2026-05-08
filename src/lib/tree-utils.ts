import { GitHubTreeItem } from "@/types/github"

export interface NestedTreeItem extends GitHubTreeItem {
  children: NestedTreeItem[];
}

export function buildNestedTree(items: GitHubTreeItem[]): NestedTreeItem[] {
  const itemMap: Record<string, NestedTreeItem> = {}
  const rootItems: NestedTreeItem[] = []

  // Initialize map and children arrays
  items.forEach((item) => {
    itemMap[item.path] = { ...item, children: [] }
  })

  items.forEach((item) => {
    const nestedItem = itemMap[item.path]
    const pathParts = item.path.split("/")

    if (pathParts.length === 1) {
      // Root level item
      rootItems.push(nestedItem)
    } else {
      // Try to find the parent path
      const parentPath = pathParts.slice(0, -1).join("/")
      const parent = itemMap[parentPath]

      if (parent && parent.type === "tree") {
        parent.children.push(nestedItem)
      } else {
        // If no explicit tree parent exists, treat as root
        rootItems.push(nestedItem)
      }
    }
  })


  // Sort: Folders first, then files, both alphabetically (case-sensitive)
  const sortItems = (list: NestedTreeItem[]) => {
    list.sort((a, b) => {
      if (a.type === b.type) {
        const nameA = a.path.split("/").pop() || ""
        const nameB = b.path.split("/").pop() || ""
        // GitHub style: case-sensitive alphabetical (uppercase comes before lowercase)
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
      }
      return a.type === "tree" ? -1 : 1
    })
    list.forEach((item) => {
      if (item.children.length > 0) {
        sortItems(item.children)
      }
    })
  }

  sortItems(rootItems)
  return rootItems
}
