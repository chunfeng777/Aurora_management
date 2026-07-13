import { http } from '@/api/http'
import { mockCreate, mockDelete, mockGetDetail, mockGetPage, mockUpdate } from '@/mocks/consultation'
import type {
  ApiResponse,
  ConsultationPageData,
  ConsultationPageParams,
  ConsultationForm,
  ConsultationRecord,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from '@/types/consultation'

const endpoint = '/v1/consultations'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

function unwrap<T>(response: ApiResponse<T>): T {
  const code = String(response.code)
  if (code !== '00000' && code !== '0' && code !== '200') throw new Error(response.msg || response.message || '请求失败')
  return response.data
}

export async function createConsultation(payload: CreateConsultationPayload): Promise<void> {
  if (useMock) return mockCreate(payload)
  const { data } = await http.post<ApiResponse<unknown>>(endpoint, payload)
  unwrap(data)
}

export async function updateConsultation(id: number, payload: UpdateConsultationPayload): Promise<void> {
  if (useMock) return mockUpdate(id, payload)
  const { data } = await http.put<ApiResponse<unknown>>(`${endpoint}/${id}`, {
    ...payload,
    id,
  })
  unwrap(data)
}

export async function getConsultationDetail(id: number): Promise<ConsultationForm> {
  if (useMock) return mockGetDetail(id)
  const { data } = await http.get<ApiResponse<ConsultationForm>>(`${endpoint}/${id}/form`)
  return unwrap(data)
}

export async function deleteConsultation(id: number): Promise<void> {
  return deleteConsultations(id)
}

/** 删除一个或多个咨询表，多个 ID 按后端约定使用英文逗号分隔。 */
export async function deleteConsultations(ids: number | readonly number[]): Promise<void> {
  const idList = typeof ids === 'number' ? [ids] : [...ids]
  if (idList.length === 0) return
  if (useMock) {
    await Promise.all(idList.map((id) => mockDelete(id)))
    return
  }
  const { data } = await http.delete<ApiResponse<unknown>>(`${endpoint}/${idList.join(',')}`)
  unwrap(data)
}

export async function getConsultationPage(params: ConsultationPageParams): Promise<ConsultationPageData> {
  if (useMock) return mockGetPage(params)
  const { data } = await http.get<ApiResponse<ConsultationPageData>>(`${endpoint}/page`, { params })
  return unwrap(data)
}
