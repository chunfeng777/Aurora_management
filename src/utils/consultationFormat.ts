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

const locationAliases: Record<string, string> = {
  '美国': '美国',
  'united states': '美国',
  'usa': '美国',
  'us': '美国',
  '中国大陆': '中国大陆',
  'mainland china': '中国大陆',
  'china mainland': '中国大陆',
  '中国香港': '中国香港',
  '香港': '中国香港',
  'hong kong': '中国香港',
  '澳门': '澳门',
  'macao': '澳门',
  'macau': '澳门',
  '台湾地区': '台湾地区',
  '中国台湾': '台湾地区',
  '台湾': '台湾地区',
  'taiwan': '台湾地区',
  '其他国家或地区': '其他国家或地区',
  '其他': '其他国家或地区',
  'other': '其他国家或地区',
  'other countries / regions': '其他国家或地区',
  'other countries/regions': '其他国家或地区',
  'other countries or regions': '其他国家或地区',
}

export interface LocationTag {
  key: string
  label: string
}

export function getLocationTags(value: string): LocationTag[] {
  const seen = new Set<string>()
  return value
    .split(/[,，;；]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => locationAliases[item.toLowerCase()] ?? item)
    .filter((label) => {
      if (seen.has(label)) return false
      seen.add(label)
      return true
    })
    .slice(0, 6)
    .map((label) => ({ key: label, label }))
}

export type ConsultationOptionType = 'timeline' | 'explore'

const timelineAliases: Record<string, string> = {
  'within 3 months': '3个月内',
  '3-6 months': '3–6个月',
  '3–6 months': '3–6个月',
  '6-12 months': '6–12个月',
  '6–12 months': '6–12个月',
  'just exploring': '暂时了解',
  '3个月内': '3个月内',
  '3–6个月': '3–6个月',
  '6–12个月': '6–12个月',
  '暂时了解': '暂时了解',
}

const exploreAliases: Record<string, string> = {
  'fertility & ivf': '生育咨询与试管（IVF）',
  'fertility and ivf': '生育咨询与试管（IVF）',
  'surrogacy': '代孕',
  'not sure yet/exploring options': '暂未确定，希望先了解不同方案',
  'not sure yet / exploring options': '暂未确定，希望先了解不同方案',
  '生育与试管婴儿': '生育咨询与试管（IVF）',
  '生育咨询与试管（ivf）': '生育咨询与试管（IVF）',
  '代孕': '代孕',
  '尚未确定 / 了解选项': '暂未确定，希望先了解不同方案',
  '暂未确定，希望先了解不同方案': '暂未确定，希望先了解不同方案',
}

export interface LocalizedOptionTag {
  key: string
  label: string
}

export function getLocalizedOptionTags(value: string, type: ConsultationOptionType): LocalizedOptionTag[] {
  const aliases = type === 'timeline' ? timelineAliases : exploreAliases
  const seen = new Set<string>()
  return value
    .split(/[,，;；]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => aliases[item.toLowerCase()] ?? item)
    .filter((label) => {
      if (seen.has(label)) return false
      seen.add(label)
      return true
    })
    .slice(0, type === 'timeline' ? 4 : 3)
    .map((label) => ({ key: label, label }))
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
