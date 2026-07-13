import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getConsultationPage } from '@/api/consultation'
import type { ConsultationRecord } from '@/types/consultation'
import type { DashboardChannelStat, DashboardMetric, DashboardRankingItem } from '@/types/dashboard'
import { splitContactMethods } from '@/utils/consultationFormat'
import { getErrorMessage } from '@/utils/getErrorMessage'

const channelDefinitions = [
  { key: 'email', label: '邮箱', color: '#6c5ce7' },
  { key: 'phone', label: '电话', color: '#0984e3' },
  { key: 'whatsapp', label: 'WhatsApp', color: '#00b894' },
  { key: 'wechat', label: '微信', color: '#e6a23c' },
] as const

export function useConsultationDashboard() {
  const loading = ref(false)
  const totalConsultations = ref(0)
  const consultations = ref<ConsultationRecord[]>([])

  const todayCount = computed(() => {
    const today = new Date().toDateString()
    return consultations.value.filter((item) => item.createTime && new Date(item.createTime).toDateString() === today).length
  })

  const multipleChannelCount = computed(() => consultations.value.filter(
    (item) => splitContactMethods(item.preferredContactMethod).length > 1,
  ).length)

  const locationCount = computed(() => new Set(
    consultations.value.map((item) => item.currentLocation.trim()).filter(Boolean),
  ).size)

  const metrics = computed<DashboardMetric[]>(() => [
    { label: '总咨询量', value: totalConsultations.value, note: '来自分页接口 total', icon: 'analytics', color: '#6c5ce7', background: '#efedff' },
    { label: '今日新增', value: todayCount.value, note: '按创建时间统计', icon: 'calendar', color: '#00a980', background: '#e7faf5' },
    { label: '多渠道联系', value: multipleChannelCount.value, note: '选择两种及以上渠道', icon: 'connection', color: '#e59118', background: '#fff5e1' },
    { label: '客户所在地', value: locationCount.value, note: '不同所在地数量', icon: 'location', color: '#2586e8', background: '#e9f3ff' },
  ])

  const channelStats = computed<DashboardChannelStat[]>(() => channelDefinitions.map((channel) => {
    const count = consultations.value.filter((item) => splitContactMethods(item.preferredContactMethod).includes(channel.key)).length
    return {
      ...channel,
      count,
      percentage: consultations.value.length === 0 ? 0 : Math.round(count / consultations.value.length * 100),
    }
  }))

  const topicStats = computed(() => createRanking(
    consultations.value.flatMap((item) => item.explore.split(',').map((value) => value.trim()).filter(Boolean)),
  ))

  const locationStats = computed(() => createRanking(
    consultations.value.map((item) => item.currentLocation.trim()).filter(Boolean),
  ))

  async function refresh(): Promise<void> {
    loading.value = true
    try {
      const result = await getConsultationPage({
        pageNum: 1,
        pageSize: 200,
        sortBy: 'createTime',
        order: 'desc',
      })
      consultations.value = result.list
      totalConsultations.value = result.total
    } catch (error: unknown) {
      ElMessage.error(getErrorMessage(error, '数据概览加载失败'))
    } finally {
      loading.value = false
    }
  }

  onMounted(() => void refresh())

  return {
    loading,
    consultations,
    totalConsultations,
    metrics,
    channelStats,
    topicStats,
    locationStats,
    refresh,
  }
}

function createRanking(values: string[]): DashboardRankingItem[] {
  const counts = new Map<string, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  const maximum = Math.max(0, ...counts.values())
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      count,
      percentage: maximum === 0 ? 0 : Math.round(count / maximum * 100),
    }))
}
