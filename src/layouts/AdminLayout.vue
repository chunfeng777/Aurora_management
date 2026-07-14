<template>
  <div class="shell">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="brand">
        <span class="brand-mark"><img :src="auroraMark" alt="" /></span>
        <div v-if="!collapsed" class="brand-copy">
          <img class="brand-logo" :src="auroraLogo" alt="Aurora" />
          <small>咨询管理中心</small>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/dashboard" class="nav-item"><el-icon class="nav-icon"><DataAnalysis /></el-icon><span v-if="!collapsed">数据概览</span></RouterLink>
        <RouterLink to="/consultations" class="nav-item"><el-icon class="nav-icon"><Tickets /></el-icon><span v-if="!collapsed">咨询管理</span></RouterLink>
      </nav>
      <div class="sidebar-foot" v-if="!collapsed"><span class="live-dot"></span>系统运行正常</div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="collapse-button" type="button" :title="collapsed ? '展开侧栏' : '收起侧栏'" @click="collapsed = !collapsed">
          <el-icon><Expand v-if="collapsed" /><Fold v-else /></el-icon>
        </button>
        <div class="breadcrumb">工作台 <span>/</span> {{ route.meta.title }}</div>
        <div class="profile">
          <div><strong>管理员</strong><small>{{ username }}</small></div>
          <span class="avatar"><el-icon><UserFilled /></el-icon></span>
          <button class="logout-button" type="button" title="退出登录" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
          </button>
        </div>
      </header>
      <main class="content"><RouterView /></main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { DataAnalysis, Expand, Fold, SwitchButton, Tickets, UserFilled } from '@element-plus/icons-vue'
import auroraLogo from '@/assets/aurora-logo.svg'
import auroraMark from '@/assets/aurora-mark.svg'
import { clearAuthSession, getAuthSession } from '@/utils/authStorage'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const username = getAuthSession()?.username || 'admin'

async function handleLogout(): Promise<void> {
  clearAuthSession()
  ElMessage.success('已安全退出登录')
  await router.replace('/login')
}
</script>

<style scoped>
.shell { display: flex; min-height: 100vh; }
.sidebar { position: fixed; z-index: 10; display: flex; width: 244px; height: 100vh; flex-direction: column; color: #d8d7ef; background: #17162d; transition: width .25s ease; }
.sidebar.collapsed { width: 82px; }
.brand { display: flex; height: 82px; align-items: center; gap: 13px; padding: 0 22px; border-bottom: 1px solid rgba(255,255,255,.07); }
.brand-mark { display: grid; width: 40px; height: 40px; flex: 0 0 40px; place-items: center; overflow: hidden; border: 1px solid rgba(255,255,255,.16); border-radius: 13px; color: white; background: linear-gradient(145deg,#91ddc0,#70c9a6); box-shadow: 0 8px 22px rgba(131,212,179,.24); }
.brand-mark img { width: 22px; height: 22px; color: inherit; }
.brand-copy,.brand-copy small { display: block; white-space: nowrap; }.brand-logo { display: block; width: 112px; height: 21px; object-fit: contain; }.brand-copy small { margin-top: 5px; color: #858fa1; font-size: 11px; letter-spacing: .08em; }
.nav { display: flex; flex: 1; flex-direction: column; gap: 8px; padding: 24px 14px; }
.nav-item { display: flex; height: 48px; align-items: center; gap: 13px; padding: 0 17px; border-radius: 12px; color: #aaa8c5; text-decoration: none; white-space: nowrap; transition: .2s; }
.nav-item:hover { color: white; background: rgba(255,255,255,.06); }.nav-item.router-link-active { color: white; background: linear-gradient(90deg,rgba(108,92,231,.35),rgba(108,92,231,.12)); box-shadow: inset 3px 0 #8b7cf8; }
.nav-icon { width: 20px; font-size: 19px; text-align: center; }.sidebar-foot { padding: 22px; color: #8885aa; font-size: 12px; }.live-dot { display: inline-block; width: 7px; height: 7px; margin-right: 8px; border-radius: 50%; background: #00d2a0; box-shadow: 0 0 0 4px rgba(0,210,160,.1); }
.main-area { width: calc(100% - 244px); min-height: 100vh; margin-left: 244px; transition: .25s; }.sidebar.collapsed + .main-area { width: calc(100% - 82px); margin-left: 82px; }
.topbar { position: sticky; z-index: 8; top: 0; display: flex; height: 72px; align-items: center; padding: 0 30px; border-bottom: 1px solid #ececf3; background: rgba(255,255,255,.9); backdrop-filter: blur(16px); }
.collapse-button { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 10px; color: #4f4d64; font-size: 19px; background: transparent; cursor: pointer; transition: .2s; }.collapse-button:hover { color: #56ad89; background: #edf8f3; }.breadcrumb { margin-left: 14px; color: #656378; font-size: 14px; }.breadcrumb span { margin: 0 8px; color: #c2c0ce; }
.profile { display: flex; align-items: center; gap: 11px; margin-left: auto; text-align: right; }.profile strong,.profile small { display: block; }.profile strong { color: #29273a; font-size: 13px; }.profile small { margin-top: 2px; color: #9b99aa; font-size: 11px; }.avatar { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 12px; color: #4faa85; font-size: 18px; background: #e8f7f1; }.logout-button { display: grid; width: 34px; height: 34px; margin-left: 3px; place-items: center; border: 0; border-radius: 10px; color: #9996aa; font-size: 17px; background: transparent; cursor: pointer; transition: .2s; }.logout-button:hover { color: #e45d66; background: #fff0f1; }
.content { min-height: calc(100vh - 72px); padding: 30px; background: #f5f6fa; }
@media (max-width: 760px) { .sidebar { width: 82px; }.sidebar .brand>div,.sidebar .nav-item span:last-child,.sidebar-foot { display: none; }.main-area,.sidebar.collapsed + .main-area { width: calc(100% - 82px); margin-left: 82px; }.content { padding: 18px; }.breadcrumb { display: none; } }
</style>
