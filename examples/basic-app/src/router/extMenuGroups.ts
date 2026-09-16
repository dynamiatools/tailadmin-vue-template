import { defaultMenuGroups } from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import type { MenuGroup } from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import { BoxCubeIcon } from '@dynamia-tools/tailadmin-vue/icons'

// Sidebar entries for the components/ext showcase pages. Kept out of the
// package's own defaultMenuGroups — these are demo-app routes, not part of
// the reusable layout shipped to consumers.
const extGroup: MenuGroup = {
  title: 'Ext Components',
  items: [
    {
      icon: BoxCubeIcon,
      name: 'Ext Components',
      subItems: [
        { name: 'Input', path: '/ext/input', pro: false },
        { name: 'Data', path: '/ext/data', pro: false },
        { name: 'Media', path: '/ext/media', pro: false },
        { name: 'Display', path: '/ext/display', pro: false },
        { name: 'Layouts', path: '/ext/layouts', pro: false },
        { name: 'Navigation', path: '/ext/navigation', pro: false },
        { name: 'Scheduling', path: '/ext/scheduling', pro: false },
        { name: 'Commerce', path: '/ext/commerce', pro: false },
        { name: 'Utilities', path: '/ext/utilities', pro: false },
      ],
    },
  ],
}

export const extMenuGroups: MenuGroup[] = [...defaultMenuGroups, extGroup]
