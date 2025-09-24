const authorize = require('../src/middleware/authorize');

describe('authorize middleware', () => {
  const createResponse = () => {
    const res = {};
    res.statusCode = 200;
    res.body = null;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (payload) => {
      res.body = payload;
      return res;
    };
    return res;
  };

  it('allows access when role matches and privacy accepted', () => {
    const req = { user: { role: 'admin', acceptedPrivacy: true } };
    const res = createResponse();
    const next = jest.fn();

    authorize(['admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  it('rejects when user missing', () => {
    const req = {};
    const res = createResponse();
    const next = jest.fn();

    authorize(['admin'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: 'Authentication required' });
  });

  it('rejects when role mismatched', () => {
    const req = { user: { role: 'staff', acceptedPrivacy: true } };
    const res = createResponse();
    const next = jest.fn();

    authorize(['admin'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ message: 'You do not have permission to perform this action' });
  });

  it('rejects when privacy policy not accepted', () => {
    const req = { user: { role: 'admin', acceptedPrivacy: false } };
    const res = createResponse();
    const next = jest.fn();

    authorize(['admin'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ message: 'Privacy policy must be accepted before accessing this resource' });
  });
});
