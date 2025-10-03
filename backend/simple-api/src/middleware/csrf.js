import crypto from 'node:crypto'
import { failure } from '../utils/responses.js'

const TOKEN_TTL_MS = 1000 * 60 * 30 // 30 minutes
const tokens = new Map()

const createToken = () => crypto.randomBytes(32).toString('hex')

const persistToken = (token) => {
  const expiresAt = Date.now() + TOKEN_TTL_MS
  tokens.set(token, expiresAt)
  return expiresAt
}

const isTokenValid = (token) => {
  if (!token) return false
  const expiresAt = tokens.get(token)
  if (!expiresAt) return false
  if (Date.now() > expiresAt) {
    tokens.delete(token)
    return false
  }
  return true
}

export const issueToken = (req, res) => {
  const token = createToken()
  const expiresAt = persistToken(token)
  res.cookie('csrfToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: TOKEN_TTL_MS
  })
  res.json({ csrfToken: token, expiresAt })
}

export const verifyToken = (req, res, next) => {
  const headerToken = req.get('X-CSRF-Token')
  const cookieToken = req.cookies?.csrfToken

  if (!headerToken || !cookieToken || headerToken !== cookieToken || !isTokenValid(headerToken)) {
    return res.status(403).json(
      failure(403, 'ไม่สามารถยืนยันความปลอดภัยของคำขอ กรุณารีเฟรชหน้าและลองใหม่อีกครั้ง')
    )
  }

  tokens.set(headerToken, Date.now() + TOKEN_TTL_MS)
  return next()
}
