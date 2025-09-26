export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>

  constructor(errors: Record<string, string[]>) {
    super('Validation failed')
    this.name = 'ValidationError'
    this.errors = errors
  }
}

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

let csrfPromise: Promise<void> | null = null

const ensureCsrfToken = async (): Promise<void> => {
  if (getCookie('XSRF-TOKEN')) {
    return
  }

  if (!csrfPromise) {
    csrfPromise = fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include'
    }).then(() => undefined)
  }

  await csrfPromise
}

const withXsrfHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getCookie('XSRF-TOKEN')
  return token ? { ...headers, 'X-XSRF-TOKEN': token } : headers
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.clone().json().catch(() => undefined)) as T & { errors?: Record<string, string[]>; message?: string }

  if (!response.ok) {
    if (response.status === 422 && data?.errors) {
      throw new ValidationError(data.errors)
    }

    const message = data?.message ?? 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง'
    throw new Error(message)
  }

  return data as T
}

export const http = {
  async postJson<T>(url: string, payload: unknown): Promise<T> {
    await ensureCsrfToken()

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: withXsrfHeader({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    })

    return handleResponse<T>(response)
  },

  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    await ensureCsrfToken()

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: withXsrfHeader(),
      body: formData
    })

    return handleResponse<T>(response)
  }
}
