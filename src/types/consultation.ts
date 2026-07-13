/** 咨询表数据模型，对应后端 ConsultationsForm / ConsultationsPageVO。 */
export interface ConsultationRecord {
  id: number
  preferredContactMethod: string
  email: string
  whatsapp: string
  wechat: string
  explore: string
  expectedContactTime: string
  currentLocation: string
  message: string
  fullName: string
  createTime: string | null
  createBy: number | null
  updateTime: string | null
  updateBy: number | null
}

export type ConsultationForm = ConsultationRecord
export type CreateConsultationPayload = ConsultationForm
export type UpdateConsultationPayload = ConsultationForm

export type SortOrder = 'asc' | 'desc'

export interface ConsultationPageParams {
  keywords?: string
  pageNum: number
  pageSize: number
  sortBy?: string
  order?: SortOrder
}

export interface ConsultationPageData {
  list: ConsultationRecord[]
  total: number
}

export interface ApiResponse<T> {
  code: string | number
  data: T
  msg: string
  message?: string
}
