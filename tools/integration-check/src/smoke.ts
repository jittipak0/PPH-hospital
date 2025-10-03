import fs from 'node:fs'
import path from 'node:path'

export type SmokeResult = {
  method: string
  path: string
  category?: string
  attempted: boolean
  status?: number
  ok: boolean
  detail?: string
  startedAt: string
  completedAt?: string
}

type ContractFile = {
  endpoints: Array<{
    path: string
    method: string
    category?: string
  }>
}

type EnvMap = Record<string, string>

const parseEnvFile = (filePath: string): EnvMap => {
  if (!fs.existsSync(filePath)) {
    return {}
  }
  const result: EnvMap = {}
  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const [key, ...rest] = trimmed.split('=')
    const value = rest.join('=')
    if (key) {
      result[key.trim()] = value?.trim()?.replace(/^"|"$/g, '') ?? ''
    }
  }
  return result
}

const resolveBaseUrl = (projectRoot: string): string => {
  const envFromProcess: EnvMap = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string') {
      envFromProcess[key] = value
    }
  }
  const envFromFile = parseEnvFile(path.join(projectRoot, 'frontend/.env.local'))
  const merged = { ...envFromFile, ...envFromProcess }
  const base = merged.VITE_API_BASE_URL || merged.INTEGRATION_BASE_URL || 'http://localhost:8000'
  return base.replace(/\/$/, '')
}

const shouldSkip = (category?: string, method?: string): string | null => {
  if (!category) {
    return null
  }
  if (category.startsWith('staff') || category === 'auth') {
    return 'requires authenticated staff token which is not configured in smoke test'
  }
  if (category === 'public-form' && method && method.toUpperCase() !== 'GET') {
    return 'requires CSRF cookie + human consent; skipped to avoid unintended submissions'
  }
  return null
}

export const runSmokeTests = async (projectRoot: string): Promise<SmokeResult[]> => {
  const contractPath = path.join(projectRoot, 'docs/api.contract.json')
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8')) as ContractFile
  const baseUrl = resolveBaseUrl(projectRoot)

  const results: SmokeResult[] = []

  for (const endpoint of contract.endpoints) {
    const method = endpoint.method.toUpperCase()
    const startedAt = new Date().toISOString()
    const skipReason = shouldSkip(endpoint.category, method)
    if (skipReason) {
      results.push({
        method,
        path: endpoint.path,
        category: endpoint.category,
        attempted: false,
        ok: false,
        detail: skipReason,
        startedAt
      })
      continue
    }

    const url = `${baseUrl}${endpoint.path}`
    const headers: Record<string, string> = {
      Accept: 'application/json'
    }

    const init: RequestInit = {
      method,
      headers
    }

    let ok = false
    let status: number | undefined
    let detail: string | undefined
    try {
      const response = await fetch(url, init)
      status = response.status
      ok = response.ok
      detail = `Response status ${response.status}`
    } catch (error) {
      detail = error instanceof Error ? error.message : String(error)
    }

    results.push({
      method,
      path: endpoint.path,
      category: endpoint.category,
      attempted: true,
      ok,
      status,
      detail,
      startedAt,
      completedAt: new Date().toISOString()
    })
  }

  const outputPath = path.join(projectRoot, 'reports/smoke_results.json')
  fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl,
    results
  }, null, 2))

  return results
}
