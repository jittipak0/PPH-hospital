const xss = require('xss')

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    }).trim()
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value)
  }
  return value
}

const sanitizeObject = (object) => {
  const cleaned = {}
  for (const key of Object.keys(object)) {
    cleaned[key] = sanitizeValue(object[key])
  }
  return cleaned
}

module.exports = { sanitizeObject, sanitizeValue }
