const authorize = require('../middleware/authorize')

describe('authorize middleware', () => {
  const createRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  it('allows access when role is permitted', () => {
    const req = { user: { role: 'admin' } }
    const res = createRes()
    const next = jest.fn()

    authorize(['admin'])(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('blocks access when role is not permitted', () => {
    const req = { user: { role: 'staff' } }
    const res = createRes()
    const next = jest.fn()

    authorize(['admin'])(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' })
    expect(next).not.toHaveBeenCalled()
  })

  it('requires authentication if user missing', () => {
    const req = {}
    const res = createRes()
    const next = jest.fn()

    authorize(['admin'])(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' })
    expect(next).not.toHaveBeenCalled()
  })
})
