import type { ComputedRef, InjectionKey } from 'vue'
import type { TreeNode, TreeTableColumn } from './TreeTable.vue'

export interface TreeTableSelection {
  isSelected: (node: TreeNode) => boolean
  toggleSelect: (node: TreeNode) => void
}

export const TREE_TABLE_COLUMNS_KEY: InjectionKey<ComputedRef<TreeTableColumn[]>> = Symbol('treeTableColumns')
export const TREE_TABLE_SELECTABLE_KEY: InjectionKey<ComputedRef<boolean>> = Symbol('treeTableSelectable')
export const TREE_TABLE_SELECTION_KEY: InjectionKey<TreeTableSelection> = Symbol('treeTableSelection')
export const TREE_TABLE_LOAD_CHILDREN_KEY: InjectionKey<
  ComputedRef<((node: TreeNode) => Promise<TreeNode[]>) | undefined>
> = Symbol('treeTableLoadChildren')
export const TREE_TABLE_NODE_KEY_KEY: InjectionKey<(node: TreeNode) => string | number> = Symbol(
  'treeTableNodeKey',
)
