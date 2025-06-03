const authMiddleware = require('../src/middlewares/authMiddleware');

describe('Auth Middleware', () => {
  it('debería estar definido', () => {
    expect(authMiddleware).toBeDefined();
  });

});
