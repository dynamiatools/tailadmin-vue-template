import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'eCommerce Dashboard' },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Calendar.vue'),
      meta: { title: 'Calendar' },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/UserProfile.vue'),
      meta: { title: 'Profile' },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/FormElements.vue'),
      meta: { title: 'Form Elements' },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/BasicTables.vue'),
      meta: { title: 'Basic Tables' },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/LineChart.vue'),
      meta: { title: 'Line Chart' },
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/BarChart.vue'),
      meta: { title: 'Bar Chart' },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/Alerts.vue'),
      meta: { title: 'Alerts' },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/Avatars.vue'),
      meta: { title: 'Avatars' },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/Badges.vue'),
      meta: { title: 'Badge' },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/Buttons.vue'),
      meta: { title: 'Buttons' },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/Images.vue'),
      meta: { title: 'Images' },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/Videos.vue'),
      meta: { title: 'Videos' },
    },
    {
      // Upstream's own "Blank Page" nav item — intentionally minimal, not a
      // stand-in for an unimplemented page. See views/BlankPage.vue.
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/BlankPage.vue'),
      meta: { title: 'Blank' },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Signin.vue'),
      meta: { title: 'Signin' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Signup.vue'),
      meta: { title: 'Signup' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title ?? 'Example'} | @dynamia-tools/tailadmin-vue`
  next()
})

export default router
