export const success = (message, extra = {}) => ({
  ok: true,
  id: extra.id ?? '',
  message,
  ...extra
})

export const failure = (status, message, errors) => ({
  ok: false,
  status,
  message,
  errors
})
