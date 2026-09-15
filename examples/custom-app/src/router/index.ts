import { createRouter, createWebHistory } from 'vue-router'

// Every route below renders the same single page (src/views/CustomLayoutDemo.vue) —
// this example exists to show the layout's slots/props, not to be a multi-page
// demo app. Multiple paths exist only so the sidebar's active-item state has
// something real to reflect when you click between menu items.
const page = () => import('../views/CustomLayoutDemo.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Overview', component: page, meta: { title: 'Overview' } },
    { path: '/team', name: 'Team', component: page, meta: { title: 'Team' } },
    { path: '/projects', name: 'Projects', component: page, meta: { title: 'Projects' } },
    {
      path: '/integrations',
      name: 'Integrations',
      component: page,
      meta: { title: 'Integrations' },
    },
    { path: '/settings', name: 'Settings', component: page, meta: { title: 'Settings' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title ?? 'Example'} | @dynamia-tools/tailadmin-vue`
  next()
})

export default router
