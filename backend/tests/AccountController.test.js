// tests/AccountController.test.js

// Importamos las clases que vamos a probar y a "mockear"
import { AccountController } from '../src/controllers/AccountController.js';
import { AccountService } from '../src/services/AccountService.js';


jest.mock('../src/services/AccountService.js');

describe('AccountController', () => {
  let accountController;
  let mockRequest;
  let mockResponse;

  // Esto se ejecuta antes de CADA prueba ('it' block)
  beforeEach(() => {
    accountController = new AccountController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reseteamos los mocks para que una prueba no interfiera con la otra
    jest.clearAllMocks();
  });

  // --- Pruebas para el método REGISTER ---
  describe('register', () => {
    it('debería crear una cuenta y devolver 201 (el camino feliz)', async () => {
      // Arrange
      mockRequest = {
        body: {
          username: 'validusername',
          password: 'password123',
          email: 'test@espe.ec.edu.ec',
          role: 'abogada',
          phone_number: '+1234567890'
        },
      };
      const mockServiceResponse = { account_id: 1, ...mockRequest.body };
      AccountService.prototype.register.mockResolvedValue(mockServiceResponse);
      
      // Act
      await accountController.register(mockRequest, mockResponse);
        
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
      expect(AccountService.prototype.register).toHaveBeenCalledWith(mockRequest.body);
    });

    it('debería devolver 400 si faltan campos requeridos', async () => {
      mockRequest = { body: { username: 'testuser' } };
      await accountController.register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
      expect(AccountService.prototype.register).not.toHaveBeenCalled();
    });
    
    it('debería devolver 400 si el rol es inválido', async () => {
        mockRequest = { body: { username: 'testuser', password: '123', email: 'a@a.com', role: 'invalid_role' } };
        await accountController.register(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid role' });
        expect(AccountService.prototype.register).not.toHaveBeenCalled();
    });
    
    it('debería devolver 400 si el nombre de usuario es inválido', async () => {
      mockRequest = { body: { username: 'short', password: '123', email: 'a@a.com', role: 'lector' } };
      await accountController.register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'El nombre de usuario debe tener al menos 8 letras y solo puede contener letras sin espacios ni números' });
      expect(AccountService.prototype.register).not.toHaveBeenCalled();
    });

    it('debería devolver 400 si el número de teléfono es inválido', async () => {
        mockRequest = { body: { username: 'validusername', password: '123', email: 'a@a.com', role: 'lector', phone_number: 'invalidphone' } };
        await accountController.register(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid phone number format' });
        expect(AccountService.prototype.register).not.toHaveBeenCalled();
    });

    it('debería devolver 400 si el formato de email es inválido', async () => {
        mockRequest = { body: { username: 'validusername', password: '123', email: 'invalid-email', role: 'lector' } };
        await accountController.register(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
        expect(AccountService.prototype.register).not.toHaveBeenCalled();
    });
    
    it('debería devolver 400 si el servicio lanza un error', async () => {
      mockRequest = { body: { username: 'anotheruser', password: 'password123', email: 'another@espe.ec.edu.ec', role: 'admin' } };
      const errorMessage = 'Username already exists';
      AccountService.prototype.register.mockRejectedValue(new Error(errorMessage));
      await accountController.register(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método LOGIN ---
  describe('login', () => {
    it('debería hacer login correctamente y devolver 200', async () => {
      mockRequest = { body: { username: 'testuser', password: 'password123' } };
      const mockLoginResult = { token: 'fake-jwt-token' };
      AccountService.prototype.login.mockResolvedValue(mockLoginResult);
      await accountController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoginResult);
    });

    it('debería devolver 400 si el username contiene caracteres inválidos', async () => {
      mockRequest = { body: { username: 'testuser123', password: 'password123' } };
      await accountController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Username must contain only letters (no numbers or special characters).' });
      expect(AccountService.prototype.login).not.toHaveBeenCalled();
    });

    it('debería devolver 401 si el servicio rechaza el login', async () => {
      mockRequest = { body: { username: 'testuser', password: 'wrongpassword' } };
      const errorMessage = 'Invalid credentials';
      AccountService.prototype.login.mockRejectedValue(new Error(errorMessage));
      await accountController.login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método RECOVER PASSWORD ---
  describe('recoverPassword', () => {
    it('debería devolver 200 si la recuperación es exitosa', async () => {
        mockRequest = { body: { email: 'registered@espe.ec.edu.ec' } };
        AccountService.prototype.recoverPassword.mockResolvedValue();
        await accountController.recoverPassword(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Recovery email sent' });
    });

    it('debería devolver 404 si el email no se encuentra', async () => {
        mockRequest = { body: { email: 'unregistered@espe.ec.edu.ec' } };
        const errorMessage = 'Email not found';
        AccountService.prototype.recoverPassword.mockRejectedValue(new Error(errorMessage));
        await accountController.recoverPassword(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método MODIFY PROFILE ---
  describe('modifyProfile', () => {
    beforeEach(() => {
        // Para este método, necesitamos un usuario en el request (simulando el middleware)
        mockRequest = { user: { id: 1 }, body: {} };
    });

    it('debería modificar el perfil y devolver 200', async () => {
        mockRequest.body = { email: 'newemail@espe.ec.edu.ec', password: 'newpassword123' };
        const mockUpdatedData = { account: { email: 'newemail@espe.ec.edu.ec' } };
        AccountService.prototype.modifyProfile.mockResolvedValue(mockUpdatedData);
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedData);
        expect(AccountService.prototype.modifyProfile).toHaveBeenCalledWith(1, mockRequest.body);
    });

    it('debería devolver 400 si el formato de email es inválido', async () => {
        mockRequest.body = { email: 'invalid-email' };
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('debería devolver 400 si el dominio del email no está permitido', async () => {
        mockRequest.body = { email: 'test@unallowed.com' };
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Email domain \'unallowed.com\' is not allowed' });
    });

    it('debería devolver 400 si la contraseña es muy corta', async () => {
        mockRequest.body = { password: 'short' };
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'la contrseaña debe tener 8 carcateres minimo' });
    });

    it('debería devolver 400 si el número de teléfono es inválido', async () => {
        mockRequest.body = { phone_number: 'invalid' };
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid phone number format' });
    });

    it('debería devolver 400 si el servicio lanza un error', async () => {
        mockRequest.body = { content: 'some content' };
        const errorMessage = 'Update failed';
        AccountService.prototype.modifyProfile.mockRejectedValue(new Error(errorMessage));
        await accountController.modifyProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  // --- Pruebas para el método GET PROFILE ---
  describe('getProfile', () => {
    beforeEach(() => {
        mockRequest = { user: { id: 1 } };
    });

    it('debería obtener el perfil y devolver 200', async () => {
        const mockProfileData = { username: 'testuser', email: 'test@espe.ec.edu.ec' };
        AccountService.prototype.getProfile.mockResolvedValue(mockProfileData);
        await accountController.getProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProfileData);
        expect(AccountService.prototype.getProfile).toHaveBeenCalledWith(1);
    });
    
    it('debería devolver 404 si el perfil no se encuentra', async () => {
        AccountService.prototype.getProfile.mockResolvedValue(null);
        await accountController.getProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });

    it('debería devolver 400 si el servicio lanza un error', async () => {
        const errorMessage = 'Internal Server Error';
        AccountService.prototype.getProfile.mockRejectedValue(new Error(errorMessage));
        await accountController.getProfile(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});