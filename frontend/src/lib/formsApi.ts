export type ApiResponse = {
  ok: boolean
  id: string
  message: string
}

export type MedicalRecordRequestPayload = {
  fullName: string
  hn: string
  citizenId: string
  phone: string
  email: string
  address: string
  reason: string
  consent: boolean
  idCardFile?: File | null
}

export type DonationPayload = {
  donorName: string
  amount: number
  channel: 'cash' | 'bank' | 'promptpay'
  phone: string
  email: string
  note?: string
}

export type SatisfactionSurveyPayload = {
  scoreOverall: number
  scoreWaitTime: number
  scoreStaff: number
  comment?: string
  serviceDate: string
}

export type HealthRiderApplicationPayload = {
  fullName: string
  hn: string
  address: string
  district: string
  province: string
  zipcode: string
  phone: string
  lineId?: string
  consent: boolean
}

export type ValidationErrors = Record<string, string[]>

export class FormApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly fieldErrors?: ValidationErrors) {
    super(message)
    this.name = 'FormApiError'
  }
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

let csrfToken: string | null = null

const resolveUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = API_BASE || origin
  return base ? `${base}${path}` : path
}

const ensureCsrfToken = async (): Promise<string> => {
  if (csrfToken) {
    return csrfToken
  }

  const response = await fetch(resolveUrl('/api/security/csrf-token'), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  if (!response.ok) {
    throw new Error('ไม่สามารถดึง CSRF token ได้')
  }

  const data = (await response.json()) as { csrfToken?: string }
  if (!data.csrfToken) {
    throw new Error('ไม่พบ CSRF token จากเซิร์ฟเวอร์')
  }

  csrfToken = data.csrfToken
  return csrfToken
}

const parseError = async (response: Response): Promise<FormApiError> => {
  let message = 'ไม่สามารถส่งข้อมูลได้'
  let fieldErrors: ValidationErrors | undefined

  try {
    const data = await response.json()
    if (typeof data?.message === 'string') {
      message = data.message
    }
    if (data && typeof data === 'object' && data.errors && typeof data.errors === 'object') {
      fieldErrors = data.errors as ValidationErrors
    }
  } catch (error) {
    // ignore JSON parse errors
  }

  return new FormApiError(message, response.status, fieldErrors)
}

const requestJson = async (path: string, init: RequestInit): Promise<ApiResponse> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })

  const token = await ensureCsrfToken()
  headers.set('X-CSRF-Token', token)

  const response = await fetch(resolveUrl(path), {
    method: 'POST',
    headers,
    credentials: 'include',
    ...init
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  return (await response.json()) as ApiResponse
}

const requestFormData = async (path: string, formData: FormData): Promise<ApiResponse> => {
  const token = await ensureCsrfToken()

  const response = await fetch(resolveUrl(path), {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token
    }
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  return (await response.json()) as ApiResponse
}

export const formsApi = {
  async submitMedicalRecordRequest(payload: MedicalRecordRequestPayload): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('full_name', payload.fullName)
    formData.append('hn', payload.hn)
    formData.append('citizen_id', payload.citizenId)
    formData.append('phone', payload.phone)
    formData.append('email', payload.email)
    formData.append('address', payload.address)
    formData.append('reason', payload.reason)
    formData.append('consent', payload.consent ? '1' : '0')

    if (payload.idCardFile) {
      formData.append('idcard_file', payload.idCardFile)
    }

    return requestFormData('/api/forms/medical-record-request', formData)
  },

  async submitDonation(payload: DonationPayload): Promise<ApiResponse> {
    return requestJson('/api/forms/donation', {
      body: JSON.stringify({
        donor_name: payload.donorName,
        amount: payload.amount,
        channel: payload.channel,
        phone: payload.phone,
        email: payload.email,
        note: payload.note ?? ''
      })
    })
  },

  async submitSatisfactionSurvey(payload: SatisfactionSurveyPayload): Promise<ApiResponse> {
    return requestJson('/api/forms/satisfaction', {
      body: JSON.stringify({
        score_overall: payload.scoreOverall,
        score_waittime: payload.scoreWaitTime,
        score_staff: payload.scoreStaff,
        comment: payload.comment ?? '',
        service_date: payload.serviceDate
      })
    })
  },

  async submitHealthRiderApplication(payload: HealthRiderApplicationPayload): Promise<ApiResponse> {
    return requestJson('/api/programs/health-rider/apply', {
      body: JSON.stringify({
        full_name: payload.fullName,
        hn: payload.hn,
        address: payload.address,
        district: payload.district,
        province: payload.province,
        zipcode: payload.zipcode,
        phone: payload.phone,
        line_id: payload.lineId ?? '',
        consent: payload.consent ? true : false
      })
    })
  }
}
