import type { ComputedRef, InjectionKey, Slots } from 'vue'
import type { TreeMenuItem } from './TreeMenu.vue'

/** Shared state between `TreeMenu` and its recursive `TreeMenuItemRow`s. Internal. */
export interface TreeMenuContext {
  /** Id (stringified) of the active item, or null. */
  activeId: ComputedRef<string | null>
  /** Stringified ids of the active item and all of its ancestors. */
  activeBranch: ComputedRef<Set<string>>
  condensed: ComputedRef<boolean>
  /** Stringified ids of the expanded (inline) items. */
  openIds: ComputedRef<Set<string>>
  /** Stringified id of the item whose flyout is open (condensed mode), or null. */
  flyoutId: ComputedRef<string | null>
  iconMap: ComputedRef<Record<string, object>>
  defaultIcon: ComputedRef<object | undefined>
  /** The root's slots (`icon`, `label`), rendered by the rows. */
  slots: Slots
  toggle: (item: TreeMenuItem) => void
  select: (item: TreeMenuItem, event: MouseEvent) => void
  openFlyout: (item: TreeMenuItem, trigger: HTMLElement) => void
  toggleFlyout: (item: TreeMenuItem, trigger: HTMLElement) => void
  scheduleCloseFlyout: () => void
  cancelCloseFlyout: () => void
}

export const TREE_MENU_KEY: InjectionKey<TreeMenuContext> = Symbol('treeMenu')
