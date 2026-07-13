import type {
  ConsultationPageData,
  ConsultationPageParams,
  ConsultationRecord,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from '@/types/consultation'

const STORAGE_KEY = 'aurora-consultations-v2'
const names = ['陈雨桐', '林知夏', '周景明', '许安然', '沈星河', '江晚晴']
const topics = ['生育咨询', '方案评估', '服务流程', '费用与周期', '专家预约']

function createSeedData(): ConsultationRecord[] {
  return Array.from({ length: 36 }, (_, index) => {
    const time = new Date(Date.now() - index * 25_200_000).toISOString()
    return {
      id: 1001 + index,
      preferredContactMethod: index % 3 === 0 ? 'wechat' : index % 3 === 1 ? 'email' : 'whatsapp',
      email: index % 3 === 1 ? `contact${index + 1}@example.com` : '',
      whatsapp: index % 3 === 2 ? `+86 138${String(24000000 + index * 731).slice(-8)}` : '',
      wechat: index % 3 === 0 ? `aurora_${1001 + index}` : '',
      explore: topics[index % topics.length],
      expectedContactTime: index % 2 === 0 ? '工作日 09:00-18:00' : '周末全天',
      currentLocation: index % 2 === 0 ? '中国大陆' : '美国',
      message: `希望进一步了解${topics[index % topics.length]}的详细流程与服务周期。`,
      fullName: names[index % names.length],
      createTime: time,
      createBy: null,
      updateTime: time,
      updateBy: null,
    }
  })
}

function readRecords(): ConsultationRecord[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved) as ConsultationRecord[]
  const seed = createSeedData()
  writeRecords(seed)
  return seed
}

function writeRecords(records: ConsultationRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function wait(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 250))
}

export async function mockGetPage(params: ConsultationPageParams): Promise<ConsultationPageData> {
  await wait()
  const keyword = params.keywords?.trim().toLowerCase()
  const filtered = readRecords().filter((item) => !keyword || [
    item.fullName, item.email, item.whatsapp, item.wechat, item.explore, item.message,
  ].some((value) => value.toLowerCase().includes(keyword)))
  const start = (params.pageNum - 1) * params.pageSize
  return { list: filtered.slice(start, start + params.pageSize), total: filtered.length }
}

export async function mockGetDetail(id: number): Promise<ConsultationRecord> {
  await wait()
  const record = readRecords().find((item) => item.id === id)
  if (!record) throw new Error('咨询记录不存在')
  return { ...record }
}

export async function mockCreate(payload: CreateConsultationPayload): Promise<void> {
  await wait()
  const records = readRecords()
  const now = new Date().toISOString()
  writeRecords([{ ...payload, id: Math.max(0, ...records.map((item) => item.id)) + 1, createTime: now }, ...records])
}

export async function mockUpdate(id: number, payload: UpdateConsultationPayload): Promise<void> {
  await wait()
  const records = readRecords()
  const index = records.findIndex((item) => item.id === id)
  if (index < 0) throw new Error('咨询记录不存在')
  records[index] = { ...payload, id, updateTime: new Date().toISOString() }
  writeRecords(records)
}

export async function mockDelete(id: number): Promise<void> {
  await wait()
  const records = readRecords()
  if (!records.some((item) => item.id === id)) throw new Error('咨询记录不存在')
  writeRecords(records.filter((item) => item.id !== id))
}
