import fs from 'node:fs'
import path from 'node:path'

export type ContractEndpoint = {
  path: string
  method: string
  headers?: string[]
  query?: Record<string, unknown>
  body?: {
    type: string
    fields?: Record<string, { type?: string; required?: boolean; [key: string]: unknown }>
  } | null
  responses?: Record<string, unknown>
  errors?: Record<string, unknown>
}

export type FrontendEndpoint = {
  path: string
  method: string
  headers?: string[]
  query?: Record<string, unknown>
  body?: {
    type: string
    fields?: Record<string, { type?: string; required?: boolean; [key: string]: unknown }>
  } | null
  responses?: Record<string, unknown>
  response?: Record<string, unknown>
}

export type RouteDiffResult = {
  missing: Array<{ method: string; path: string }>
  extra: Array<{ method: string; path: string; source?: string }>
  mismatched: Array<{
    method: string
    path: string
    issues: string[]
  }>
}

const normalizeHeaders = (headers?: string[]): string[] => {
  if (!headers) return []
  return headers.map((header) => header.toLowerCase()).sort()
}

const stableStringify = (value: unknown): string => {
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value !== 'object') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))
  return `{${entries.map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`).join(',')}}`
}

const compareFields = (
  contractFields: Record<string, { type?: string; required?: boolean }> | undefined,
  frontendFields: Record<string, { type?: string; required?: boolean }> | undefined
): string[] => {
  const issues: string[] = []
  const contractKeys = new Set(Object.keys(contractFields ?? {}))
  const frontendKeys = new Set(Object.keys(frontendFields ?? {}))

  for (const key of contractKeys) {
    if (!frontendKeys.has(key)) {
      issues.push(`ขาด field \`${key}\` ตามสัญญา`)
      continue
    }
    const c = contractFields?.[key] ?? {}
    const f = frontendFields?.[key] ?? {}
    if (Boolean(c.required) !== Boolean(f.required)) {
      issues.push(`เงื่อนไข required ของ \`${key}\` ไม่ตรง (contract=${Boolean(c.required)}, frontend=${Boolean(f.required)})`)
    }
    if ((c.type ?? '').toLowerCase() !== (f.type ?? '').toLowerCase()) {
      issues.push(`ชนิดข้อมูลของ \`${key}\` ไม่ตรง (contract=${c.type}, frontend=${f.type})`)
    }
  }

  for (const key of frontendKeys) {
    if (!contractKeys.has(key)) {
      issues.push(`frontend ส่ง field เกินสัญญา \`${key}\``)
    }
  }

  return issues
}

const compareBodies = (
  contractBody: ContractEndpoint['body'],
  frontendBody: FrontendEndpoint['body']
): string[] => {
  const issues: string[] = []
  if (!contractBody && !frontendBody) {
    return issues
  }
  if (!contractBody && frontendBody) {
    issues.push('contract ไม่ต้องมี body แต่ frontend ส่ง body')
    return issues
  }
  if (contractBody && !frontendBody) {
    issues.push('contract บังคับ body แต่ frontend ไม่ส่ง')
    return issues
  }
  if (!contractBody || !frontendBody) {
    return issues
  }

  if ((contractBody.type ?? '').toLowerCase() !== (frontendBody.type ?? '').toLowerCase()) {
    issues.push(`ชนิด body ไม่ตรง (contract=${contractBody.type}, frontend=${frontendBody.type})`)
  }

  issues.push(...compareFields(contractBody.fields, frontendBody.fields))

  return issues
}

const compareResponses = (
  contractResponses: Record<string, unknown> | undefined,
  frontendResponses: Record<string, unknown> | undefined
): string[] => {
  const issues: string[] = []
  const contractStatuses = new Set(Object.keys(contractResponses ?? {}))
  const frontendStatuses = new Set(Object.keys(frontendResponses ?? {}))

  for (const status of contractStatuses) {
    if (!frontendStatuses.has(status)) {
      issues.push(`frontend ไม่รองรับ response สถานะ ${status}`)
      continue
    }
    const contractShape = stableStringify(contractResponses?.[status])
    const frontendShape = stableStringify(frontendResponses?.[status])
    if (contractShape !== frontendShape) {
      issues.push(`รูปแบบ response ${status} ไม่ตรง\ncontract: ${contractShape}\nfrontend: ${frontendShape}`)
    }
  }

  for (const status of frontendStatuses) {
    if (!contractStatuses.has(status)) {
      issues.push(`frontend คาดหวังสถานะ ${status} ที่ไม่อยู่ในสัญญา`)
    }
  }

  return issues
}

export const generateRouteDiff = (projectRoot: string): RouteDiffResult => {
  const contractPath = path.join(projectRoot, 'docs/api.contract.json')
  const frontendPath = path.join(projectRoot, 'frontend/api.calls.json')
  const contractRaw = JSON.parse(fs.readFileSync(contractPath, 'utf8')) as { endpoints: ContractEndpoint[] }
  const frontendRaw = JSON.parse(fs.readFileSync(frontendPath, 'utf8')) as { endpoints: FrontendEndpoint[] }

  const contractMap = new Map<string, ContractEndpoint>()
  for (const endpoint of contractRaw.endpoints) {
    contractMap.set(`${endpoint.method.toUpperCase()} ${endpoint.path}`, endpoint)
  }

  const frontendMap = new Map<string, FrontendEndpoint>()
  for (const endpoint of frontendRaw.endpoints) {
    const normalized: FrontendEndpoint = {
      ...endpoint,
      responses: endpoint.responses ?? endpoint.response
    }
    frontendMap.set(`${normalized.method.toUpperCase()} ${normalized.path}`, normalized)
  }

  const missing: RouteDiffResult['missing'] = []
  const mismatched: RouteDiffResult['mismatched'] = []

  for (const [key, contractEndpoint] of contractMap.entries()) {
    if (!frontendMap.has(key)) {
      missing.push({ method: contractEndpoint.method.toUpperCase(), path: contractEndpoint.path })
      continue
    }
    const frontendEndpoint = frontendMap.get(key)!
    const issues: string[] = []

    const contractHeaders = normalizeHeaders(contractEndpoint.headers)
    const frontendHeaders = normalizeHeaders(frontendEndpoint.headers)
    const headerDiff = [
      ...contractHeaders.filter((item) => !frontendHeaders.includes(item)).map((item) => `ขาด header บังคับ \`${item}\``),
      ...frontendHeaders.filter((item) => !contractHeaders.includes(item)).map((item) => `มี header เกินสัญญา \`${item}\``)
    ]
    issues.push(...headerDiff)

    issues.push(...compareBodies(contractEndpoint.body, frontendEndpoint.body))

    issues.push(...compareResponses(contractEndpoint.responses, frontendEndpoint.responses))

    const errorIssues = compareResponses(contractEndpoint.errors as Record<string, unknown> | undefined, undefined)
    if (errorIssues.length > 0) {
      issues.push(...errorIssues)
    }

    if (issues.length > 0) {
      mismatched.push({ method: contractEndpoint.method.toUpperCase(), path: contractEndpoint.path, issues })
    }
  }

  const extra: RouteDiffResult['extra'] = []
  for (const [key, frontendEndpoint] of frontendMap.entries()) {
    if (!contractMap.has(key)) {
      extra.push({
        method: frontendEndpoint.method.toUpperCase(),
        path: frontendEndpoint.path,
        source: frontendEndpoint['source']
      })
    }
  }

  const reportPath = path.join(projectRoot, 'reports/route_contract_diff.md')
  const lines: string[] = []
  lines.push('# Route Contract Diff Report')
  lines.push('')
  lines.push(`- Missing endpoints: ${missing.length}`)
  lines.push(`- Extra frontend-only endpoints: ${extra.length}`)
  lines.push(`- Contract mismatches: ${mismatched.length}`)
  lines.push('')

  if (missing.length > 0) {
    lines.push('## Endpoints missing from frontend implementation')
    lines.push('| Method | Path |')
    lines.push('| --- | --- |')
    for (const item of missing) {
      lines.push(`| ${item.method} | ${item.path} |`)
    }
    lines.push('')
  }

  if (extra.length > 0) {
    lines.push('## Frontend endpoints without contract coverage')
    lines.push('| Method | Path | Source |')
    lines.push('| --- | --- | --- |')
    for (const item of extra) {
      lines.push(`| ${item.method} | ${item.path} | ${item.source ?? ''} |`)
    }
    lines.push('')
  }

  if (mismatched.length > 0) {
    lines.push('## Contract mismatches (shape/header/schema differences)')
    for (const item of mismatched) {
      lines.push(`### ${item.method} ${item.path}`)
      for (const issue of item.issues) {
        lines.push(`- ${issue}`)
      }
      lines.push('')
    }
  }

  fs.writeFileSync(reportPath, lines.join('\n'))

  return { missing, extra, mismatched }
}
