/**
 * Parse duration strings such as `15m`, `7d`, `12h` into milliseconds.
 */
const parseDuration = (value) => {
  const match = /^\s*(\d+)\s*([smhd])\s*$/i.exec(String(value))
  if (!match) {
    throw new Error(`Invalid duration format: ${value}`)
  }
  const amount = Number(match[1])
  const unit = match[2].toLowerCase()
  switch (unit) {
    case 's':
      return amount * 1000
    case 'm':
      return amount * 60 * 1000
    case 'h':
      return amount * 60 * 60 * 1000
    case 'd':
      return amount * 24 * 60 * 60 * 1000
    default:
      throw new Error(`Unsupported duration unit: ${unit}`)
  }
}

const addDurationToNow = (duration) => {
  const ms = parseDuration(duration)
  return new Date(Date.now() + ms).toISOString()
}

module.exports = { parseDuration, addDurationToNow }
