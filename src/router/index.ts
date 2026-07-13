import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/', component: AdminLayout, redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据概览' } },
      { path: 'consultations', component: () => import('@/views/ConsultationList.vue'), meta: { title: '咨询管理' } },
    ],
  }],
})
