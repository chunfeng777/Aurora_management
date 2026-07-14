import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { isAuthenticated } from '@/utils/authStorage'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '管理员登录', public: true },
    },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据概览' } },
        { path: 'consultations', component: () => import('@/views/ConsultationList.vue'), meta: { title: '咨询管理' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to) => {
  const loggedIn = isAuthenticated()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)

  if (requiresAuth && !loggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && loggedIn) return '/dashboard'
  return true
})
