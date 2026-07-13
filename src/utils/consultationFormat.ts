import type { ConsultationRecord } from '@/types/consultation'

const contactMethodLabels: Record<string, string> = {
  email: '邮箱',
  phone: '手机',
  whatsapp: 'WhatsApp',
  wechat: '微信',
}

export function splitContactMethods(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function formatContactMethods(value: string): string {
  const methods = splitContactMethods(value)
  if (methods.length === 0) return '未指定'
  return methods.map((item) => contactMethodLabels[item] ?? item).join(' / ')
}

export interface ContactMethodTag {
  key: string
  label: string
}

export function getContactMethodTags(value: string): ContactMethodTag[] {
  return splitContactMethods(value)
    .slice(0, 4)
    .map((key) => ({ key, label: contactMethodLabels[key] ?? key }))
}

export function getPrimaryContact(record: ConsultationRecord): string {
  return record.wechat || record.whatsapp || record.email || '-'
}

export function formatConsultationDate(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
