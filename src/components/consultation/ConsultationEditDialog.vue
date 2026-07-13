<template>
  <el-dialog
    :model-value="modelValue"
    title="修改咨询表"
    width="min(760px, 94vw)"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="close"
  >
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <div class="form-grid">
        <el-form-item label="全名" prop="fullName">
          <el-input v-model.trim="form.fullName" maxlength="80" placeholder="请输入全名" />
        </el-form-item>
        <el-form-item label="首选联系方式" prop="preferredContactMethod">
          <el-select v-model="form.preferredContactMethod" style="width: 100%" placeholder="请选择">
            <el-option label="邮箱" value="email" />
            <el-option label="WhatsApp" value="whatsapp" />
            <el-option label="微信" value="wechat" />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-grid form-grid--three">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="可选" />
        </el-form-item>
        <el-form-item label="WhatsApp" prop="whatsapp">
          <el-input v-model.trim="form.whatsapp" placeholder="可选" />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model.trim="form.wechat" placeholder="可选" />
        </el-form-item>
      </div>

      <div class="form-grid">
        <el-form-item label="正在探索什么" prop="explore">
          <el-input v-model.trim="form.explore" maxlength="200" />
        </el-form-item>
        <el-form-item label="期望联系时间" prop="expectedContactTime">
          <el-input v-model.trim="form.expectedContactTime" maxlength="100" />
        </el-form-item>
      </div>

      <el-form-item label="当前所在地" prop="currentLocation">
        <el-input v-model.trim="form.currentLocation" maxlength="150" />
      </el-form-item>
      <el-form-item label="情况说明" prop="message">
        <el-input v-model="form.message" type="textarea" :rows="5" maxlength="2000" show-word-limit />
      </el-form-item>

      <div v-if="form.createTime" class="audit-info">
        <span>咨询表 ID：{{ form.id }}</span>
        <span>创建时间：{{ formatDate(form.createTime) }}</span>
        <span v-if="form.updateTime">更新时间：{{ formatDate(form.updateTime) }}</span>
      </div>
    </el-form>

    <template #footer>
      <el-button :disabled="saving" @click="close">取消</el-button>
      <el-button type="primary" :loading="saving" :disabled="loading" @click="save">
        保存修改
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getConsultationDetail, updateConsultation } from '@/api/consultation'
import type { ConsultationForm, UpdateConsultationPayload } from '@/types/consultation'
import { getErrorMessage } from '@/utils/getErrorMessage'

const props = defineProps<{ modelValue: boolean; consultationId: number | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; saved: [] }>()
const formRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)

function createEmptyForm(): ConsultationForm {
  return {
    id: 0,
    preferredContactMethod: '',
    email: '',
    whatsapp: '',
    wechat: '',
    explore: '',
    expectedContactTime: '',
    currentLocation: '',
    message: '',
    fullName: '',
    createTime: '',
    createBy: 0,
    updateTime: '',
    updateBy: 0,
  }
}

const form = reactive<ConsultationForm>(createEmptyForm())
const rules: FormRules<ConsultationForm> = {
  fullName: [{ required: true, message: '请输入全名', trigger: 'blur' }],
  preferredContactMethod: [{ required: true, message: '请选择首选联系方式', trigger: 'change' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  message: [{ required: true, message: '请输入情况说明', trigger: 'blur' }],
}

watch(() => props.modelValue, (visible) => {
  if (visible && props.consultationId !== null) void loadDetail(props.consultationId)
})

async function loadDetail(id: number): Promise<void> {
  loading.value = true
  try {
    const detail = await getConsultationDetail(id)
    Object.assign(form, detail, { id })
  } catch (error: unknown) {
    ElMessage.error(getErrorMessage(error, '咨询详情加载失败'))
    close()
  } finally {
    loading.value = false
  }
}

async function save(): Promise<void> {
  if (!formRef.value || props.consultationId === null) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请检查表单填写内容')
    return
  }

  const payload: UpdateConsultationPayload = {
    ...form,
    id: props.consultationId,
  }

  saving.value = true
  try {
    await updateConsultation(props.consultationId, payload)
    ElMessage.success('咨询表修改成功')
    emit('saved')
    close()
  } catch (error: unknown) {
    ElMessage.error(getErrorMessage(error, '保存失败，请稍后重试'))
  } finally {
    saving.value = false
  }
}

function close(): void {
  emit('update:modelValue', false)
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
</script>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.form-grid--three { grid-template-columns: repeat(3, 1fr); }
.audit-info { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 12px 14px; border-radius: 9px; color: var(--el-text-color-secondary); font-size: 12px; background: var(--el-fill-color-light); }
@media (max-width: 680px) { .form-grid, .form-grid--three { grid-template-columns: 1fr; gap: 0; } }
</style>
