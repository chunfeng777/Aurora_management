import { http } from '@/api/http'
import type { AuthenticationToken, AuthApiResponse, LoginRequest } from '@/types/auth'

const loginEndpoint = '/v1/auth/login'

function unwrapToken(response: AuthApiResponse<AuthenticationToken>): AuthenticationToken {
  const code = String(response.code)
  if (code !== '00000' && code !== '0' && code !== '200') {
    throw new Error(response.msg || response.message || '账号或密码错误')
  }
  if (!response.data?.accessToken) throw new Error('登录响应中缺少访问令牌')
  return response.data
}

export async function login(payload: LoginRequest): Promise<AuthenticationToken> {
  const { data } = await http.post<AuthApiResponse<AuthenticationToken>>(loginEndpoint, payload)
  return unwrapToken(data)
}
