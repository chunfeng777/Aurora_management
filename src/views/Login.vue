<template>
  <main class="login-page">
    <section class="brand-panel" aria-label="Aurora 品牌介绍">
      <div class="brand-panel__glow brand-panel__glow--one" />
      <div class="brand-panel__glow brand-panel__glow--two" />

      <div class="brand-panel__content">
        <img class="brand-panel__logo" :src="auroraLogo" alt="Aurora" />

        <div class="brand-panel__message">
          <span class="brand-panel__badge">CONSULTATION MANAGEMENT</span>
          <h1>让每一份咨询<br />都被认真看见</h1>
          <p>安全、高效地管理客户咨询信息，及时跟进每一段家庭旅程。</p>
        </div>

        <div class="brand-panel__features">
          <div class="brand-feature">
            <span><el-icon><Lock /></el-icon></span>
            <div><strong>安全访问</strong><small>管理员专属入口</small></div>
          </div>
          <div class="brand-feature">
            <span><el-icon><DataAnalysis /></el-icon></span>
            <div><strong>数据清晰</strong><small>咨询趋势一目了然</small></div>
          </div>
        </div>
      </div>
    </section>

    <section class="form-panel">
      <div class="login-card">
        <img class="login-card__logo" :src="auroraLogo" alt="Aurora" />
        <div class="login-card__eyebrow"><span /> 管理员入口</div>
        <h2>欢迎回来</h2>
        <p class="login-card__subtitle">请输入管理员账号和密码进入咨询管理系统</p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model.trim="form.username"
              size="large"
              autocomplete="username"
              placeholder="请输入管理员账号"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              size="large"
              type="password"
              autocomplete="current-password"
              placeholder="请输入登录密码"
              :prefix-icon="Key"
              show-password
            />
          </el-form-item>

          <el-button
            native-type="submit"
            size="large"
            class="login-button"
            :loading="loading"
          >
            <span>{{ loading ? '正在登录...' : '登录管理后台' }}</span>
            <el-icon v-if="!loading"><ArrowRight /></el-icon>
          </el-button>
        </el-form>

        <div class="login-card__hint">
          <el-icon><CircleCheckFilled /></el-icon>
          登录后令牌将自动用于咨询数据接口鉴权
        </div>
      </div>

      <p class="form-panel__footer">Aurora 咨询管理中心 · 安全登录</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowRight, CircleCheckFilled, DataAnalysis, Key, Lock, User } from '@element-plus/icons-vue'
import auroraLogo from '@/assets/aurora-logo.svg'
import { login } from '@/api/auth'
import type { LoginRequest } from '@/types/auth'
import { saveAuthSession } from '@/utils/authStorage'
import { getErrorMessage } from '@/utils/getErrorMessage'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<LoginRequest>({
  username: '',
  password: '',
})

const rules: FormRules<LoginRequest> = {
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
}

function getRedirectTarget(): string {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) return redirect
  return '/dashboard'
}

async function handleLogin(): Promise<void> {
  if (!formRef.value || loading.value) return
  await formRef.value.validate()

  loading.value = true
  try {
    const token = await login({ username: form.username, password: form.password })
    saveAuthSession(form.username, token)
    ElMessage.success('登录成功，欢迎回来')
    await router.replace(getRedirectTarget())
  } catch (error: unknown) {
    ElMessage.error(getErrorMessage(error, '登录失败，请检查账号和密码'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(460px, 1.08fr) minmax(480px, .92fr);
  background: #f7fbf9;
}

.brand-panel {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 82% 18%, rgba(255,255,255,.22), transparent 28%),
    linear-gradient(145deg, #70c9a6 0%, #83d4b3 52%, #92ddc0 100%);
}

.brand-panel::before {
  position: absolute;
  right: -130px;
  bottom: -150px;
  width: 470px;
  height: 470px;
  border: 1px solid rgba(255,255,255,.24);
  border-radius: 50%;
  box-shadow: 0 0 0 70px rgba(255,255,255,.055), 0 0 0 140px rgba(255,255,255,.035);
  content: '';
}

.brand-panel__glow {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.12);
  filter: blur(2px);
}

.brand-panel__glow--one { top: 17%; right: 9%; width: 82px; height: 82px; }
.brand-panel__glow--two { bottom: 24%; left: -42px; width: 128px; height: 128px; }

.brand-panel__content {
  position: relative;
  z-index: 1;
  display: flex;
  width: min(620px, calc(100% - 96px));
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;
  padding: 64px 0 58px;
}

.brand-panel__logo { width: 158px; height: auto; filter: brightness(0) invert(1); }
.brand-panel__message { margin: auto 0; }
.brand-panel__badge {
  display: inline-flex;
  padding: 7px 12px;
  border: 1px solid rgba(255,255,255,.34);
  border-radius: 999px;
  color: rgba(255,255,255,.86);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .13em;
  background: rgba(255,255,255,.09);
}

.brand-panel h1 { margin: 28px 0 20px; font-size: clamp(42px, 4vw, 64px); line-height: 1.16; letter-spacing: -.035em; }
.brand-panel__message p { max-width: 500px; margin: 0; color: rgba(255,255,255,.82); font-size: 17px; line-height: 1.9; }
.brand-panel__features { display: flex; gap: 42px; }
.brand-feature { display: flex; align-items: center; gap: 12px; }
.brand-feature > span { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(255,255,255,.24); border-radius: 13px; font-size: 18px; background: rgba(255,255,255,.13); }
.brand-feature strong,.brand-feature small { display: block; }.brand-feature strong { font-size: 13px; }.brand-feature small { margin-top: 4px; color: rgba(255,255,255,.66); font-size: 11px; }

.form-panel {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 48px;
  background:
    radial-gradient(circle at 12% 8%, rgba(131,212,179,.12), transparent 24%),
    #f8fbfa;
}

.login-card {
  width: min(100%, 460px);
  padding: 46px 44px 40px;
  border: 1px solid rgba(49,89,78,.09);
  border-radius: 28px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 30px 80px rgba(43,91,76,.12), 0 3px 14px rgba(43,91,76,.05);
}

.login-card__logo { display: none; width: 132px; height: auto; margin-bottom: 36px; }
.login-card__eyebrow { display: flex; align-items: center; gap: 9px; color: #62b994; font-size: 12px; font-weight: 700; letter-spacing: .11em; }
.login-card__eyebrow span { width: 24px; height: 3px; border-radius: 3px; background: #83d4b3; }
.login-card h2 { margin: 14px 0 10px; color: #203832; font-size: 34px; line-height: 1.2; letter-spacing: -.03em; }
.login-card__subtitle { margin: 0; color: #879690; font-size: 14px; line-height: 1.7; }
.login-form { margin-top: 34px; }
.login-form :deep(.el-form-item) { margin-bottom: 24px; }
.login-form :deep(.el-form-item__label) { padding-bottom: 9px; color: #40554f; font-size: 13px; font-weight: 600; }
.login-form :deep(.el-input__wrapper) { min-height: 52px; padding: 0 16px; border-radius: 13px; background: #f8faf9; box-shadow: 0 0 0 1px #dfe8e4 inset; transition: .2s ease; }
.login-form :deep(.el-input__wrapper:hover) { box-shadow: 0 0 0 1px #b8d9cc inset; }
.login-form :deep(.el-input__wrapper.is-focus) { background: #fff; box-shadow: 0 0 0 1px #72c7a6 inset, 0 0 0 4px rgba(131,212,179,.12); }
.login-form :deep(.el-input__prefix) { color: #70bfa1; font-size: 18px; }

.login-button {
  display: flex;
  width: 100%;
  height: 54px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #72cba8, #5db58f);
  box-shadow: 0 13px 28px rgba(93,181,143,.25);
  transition: transform .2s ease, box-shadow .2s ease;
}
.login-button:hover,.login-button:focus { color: #fff; background: linear-gradient(135deg, #68c49f, #52aa84); transform: translateY(-1px); box-shadow: 0 16px 32px rgba(93,181,143,.31); }
.login-card__hint { display: flex; margin-top: 26px; align-items: center; justify-content: center; gap: 7px; color: #98a6a1; font-size: 11px; }
.login-card__hint .el-icon { color: #69bd9a; font-size: 15px; }
.form-panel__footer { margin: 24px 0 0; color: #a0aca8; font-size: 11px; letter-spacing: .04em; }

@media (max-width: 980px) {
  .login-page { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
  .form-panel { padding: 30px 22px; }
  .login-card__logo { display: block; }
}

@media (max-width: 520px) {
  .form-panel { justify-content: flex-start; padding: 28px 16px; }
  .login-card { margin-top: 6vh; padding: 36px 24px 30px; border-radius: 22px; }
  .login-card h2 { font-size: 30px; }
}
</style>
