<<<<<<< HEAD
const assert = require('assert');
const AccountController = require('../src/controllers/AccountController');

describe('AccountController', () => {
    it('should handle case for line 10', () => {
        // Add test logic here
    });

    it('should handle case for line 13', () => {
        // Add test logic here
    });

    it('should handle case for line 18', () => {
        // Add test logic here
    });

    it('should handle case for line 23', () => {
        // Add test logic here
    });

    it('should handle case for line 29', () => {
        // Add test logic here
    });

    it('should handle case for lines 60-69', () => {
        // Add test logic here
    });

    it('should handle case for line 76', () => {
        // Add test logic here
    });

    it('should handle case for line 87', () => {
        // Add test logic here
    });
});
=======
const { AccountController } = require('../src/controllers/AccountController');

describe('AccountController', () => {
  it('should return 400 if required fields are missing', async () => {
    const req = { body: { username: '', password: '', email: '', role: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing required fields',
    });
  });

  it('should return 400 if role is invalid', async () => {
    const req = {
      body: {
        username: 'user',
        password: 'pass',
        email: 'a@a.com',
        role: 'invalid',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' });
  });

  it('should return 400 if phone number is invalid', async () => {
    const req = {
      body: {
        username: 'user',
        password: 'pass',
        email: 'a@a.com',
        role: 'admin',
        phone_number: '123',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid phone number format',
    });
  });

  it('should return 400 if email is invalid', async () => {
    const req = {
      body: {
        username: 'user',
        password: 'pass',
        email: 'invalid',
        role: 'admin',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
  });

  it('should return 400 on register error', async () => {
    const req = {
      body: {
        username: 'user',
        password: 'pass',
        email: 'a@a.com',
        role: 'admin',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    controller.accountService = {
      register: jest.fn().mockRejectedValue(new Error('fail')),
    };
    await controller.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
  });

  it('should return 401 on login error', async () => {
    const req = { body: { username: 'user', password: 'wrong' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    controller.accountService = {
      login: jest.fn().mockRejectedValue(new Error('fail')),
    };
    await controller.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
  });

  it('should return 404 on recoverPassword error', async () => {
    const req = { body: { email: 'fail@fail.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    controller.accountService = {
      recoverPassword: jest.fn().mockRejectedValue(new Error('fail')),
    };
    await controller.recoverPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
  });

  it('should return 400 if email format is invalid in modifyProfile', async () => {
    const req = { user: { id: 1 }, body: { email: 'invalid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.modifyProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
  });

  it('should return 400 if email domain is not allowed in modifyProfile', async () => {
    const req = { user: { id: 1 }, body: { email: 'user@notallowed.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.modifyProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email domain \'notallowed.com\' is not allowed',
    });
  });

  it('should return 400 if phone number is invalid in modifyProfile', async () => {
    const req = { user: { id: 1 }, body: { phone_number: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    await controller.modifyProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid phone number format',
    });
  });

  it('should return 400 on modifyProfile error', async () => {
    const req = { user: { id: 1 }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const controller = new AccountController();
    controller.accountService = {
      modifyProfile: jest.fn().mockRejectedValue(new Error('fail')),
    };
    await controller.modifyProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'fail' });
  });
});
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
