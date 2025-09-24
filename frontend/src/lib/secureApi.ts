export type Role = 'admin' | 'doctor' | 'nurse' | 'staff'

export type AuthenticatedUser = {
  id: string
  username: string
  role: Role
  acceptedPolicies: boolean
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: AuthenticatedUser
}

const API_BASE = import.meta.env.VITE_SECURE_API ?? 'http://localhost:4000/api'

let csrfToken: string | null = null

const ensureCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken
  }
  const response = await fetch(`${API_BASE}/security/csrf-token`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('ไม่สามารถดึง CSRF token ได้')
  }
  const data = await response.json()
  csrfToken = data.csrfToken
  return csrfToken
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  accessToken?: string | null
  csrf?: boolean
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }
  if (options.csrf) {
    const token = await ensureCsrfToken()
    headers.set('X-CSRF-Token', token)
  }
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (response.status === 204) {
    return {} as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = (data as { message?: string }).message ?? 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'
    throw new Error(message)
  }

  return data as T
}

export const secureApi = {
  async login(payload: { username: string; password: string; acceptPolicies: boolean }): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', { method: 'POST', body: payload, csrf: true })
  },
  async refresh(refreshToken: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      csrf: true
    })
  },
  async logout(refreshToken: string | null, accessToken: string | null): Promise<void> {
    await request('/auth/logout', {
      method: 'POST',
      body: refreshToken ? { refreshToken } : {},
      accessToken,
      csrf: true
    })
  },
  async fetchDoctorPatients(accessToken: string) {
    return request<{ patients: { id: string; name: string; diagnosis: string; updatedAt: string }[] }>(
      '/doctor/patients',
      {
        accessToken
      }
    )
  },
  async fetchNurseSchedules(accessToken: string) {
    return request<{ schedules: { id: string; shiftDate: string; shiftType: string }[] }>('/nurse/schedules', {
      accessToken
    })
  },
  async fetchStaffNews(accessToken: string) {
    return request<{ news: { id: string; title: string; content: string; publishedAt: string }[] }>(
      '/staff/news',
      {
        accessToken
      }
    )
  },
  async listUsers(accessToken: string) {
    return request<{ users: AuthenticatedUser[] }>('/users', { accessToken })
  },
  async createUser(accessToken: string, payload: { username: string; password: string; role: Role }) {
    return request<{ user: AuthenticatedUser }>('/users', {
      method: 'POST',
      accessToken,
      body: payload,
      csrf: true
    })
  },
  async updateUser(accessToken: string, userId: string, payload: Partial<{ password: string; role: Role; acceptedPolicies: boolean }>) {
    return request<{ user: AuthenticatedUser }>(`/users/${userId}`, {
      method: 'PUT',
      accessToken,
      body: payload,
      csrf: true
    })
  },
  async deleteUser(accessToken: string, userId: string) {
    await request(`/users/${userId}`, {
      method: 'DELETE',
      accessToken,
      csrf: true
    })
  },
  async listAuditLogs(accessToken: string) {
    return request<{ logs: { id: string; action: string; ip: string | null; createdAt: string; username: string | null }[] }>(
      '/users/logs/audit',
      {
        accessToken
      }
    )
  },
  async deleteAccount(accessToken: string, payload: { password: string }) {
    await request('/account', {
      method: 'DELETE',
      accessToken,
      body: payload,
      csrf: true
    })
  },
  async fetchPrivacyPolicy() {
    return request<{ policy: string }>('/policies/privacy')
  },
  async fetchTerms() {
    return request<{ terms: string }>('/policies/terms')
  }
}
