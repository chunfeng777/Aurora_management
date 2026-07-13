import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteConsultation, getConsultationPage } from '@/api/consultation'
import type { ConsultationPageParams, ConsultationRecord } from '@/types/consultation'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function useConsultationList() {
  const loading = ref(false)
  const deletingId = ref<number | null>(null)
  const records = ref<ConsultationRecord[]>([])
  const total = ref(0)
  const query = reactive<ConsultationPageParams>({
    pageNum: 1,
    pageSize: 10,
    keywords: '',
    sortBy: 'createTime',
    order: 'desc',
  })

  async function load(): Promise<void> {
    loading.value = true
    try {
      const result = await getConsultationPage({ ...query })
      records.value = result.list
      total.value = result.total
    } catch (error: unknown) {
      ElMessage.error(getErrorMessage(error, '咨询列表加载失败'))
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number): Promise<void> {
    deletingId.value = id
    try {
      await deleteConsultation(id)
      ElMessage.success('咨询记录已删除')
      if (records.value.length === 1 && query.pageNum > 1) query.pageNum -= 1
      await load()
    } catch (error: unknown) {
      ElMessage.error(getErrorMessage(error, '删除失败，请稍后重试'))
    } finally {
      deletingId.value = null
    }
  }

  function search(): void {
    query.pageNum = 1
    void load()
  }

  function reset(): void {
    query.keywords = ''
    query.pageNum = 1
    void load()
  }

  return { loading, deletingId, records, total, query, load, remove, search, reset }
}
