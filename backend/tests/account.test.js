// tests/accountRoutes.test.js

import request from 'supertest';
import app from '../src/app.js'; // Importamos la aplicación Express completa
import { AccountService } from '../src/services/AccountService.js';
import { authenticateToken } from '../src/middlewares/authMiddleware.js';

// --- Mocks Globales ---
// Mockeamos el servicio para controlar las respuestas y evitar llamadas a la BD.
jest.mock('../src/services/AccountService.js');

// Mockeamos el middleware de autenticación para probar rutas protegidas.
jest.mock('../src/middlewares/authMiddleware.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Simulamos un token válido y adjuntamos un usuario a `req`.
    req.user = { id: 1, username: 'testuser', role: 'abogada' };
    next();
  }),
}));

describe('Account Routes - Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Pruebas para POST /api/accounts/create ---
  describe('POST /api/accounts/create', () => {
    it('debería responder con 201 si los datos de creación son válidos', async () => {
      // Arrange: Datos que SÍ pasan la validación del controlador
      const userData = { username: 'validusername', password: 'password123', email: 'new@espe.ec.edu.ec', role: 'lector' };
      // Configuramos el mock para que devuelva un resultado exitoso
      AccountService.prototype.register.mockResolvedValue({ account_id: 2, ...userData });

      // Act & Assert
      await request(app)
        .post('/api/accounts/create') // Ruta con /api
        .send(userData)
        .expect(201);
    });
  });

  // --- Pruebas para POST /api/accounts/recover-password ---
  describe('POST /api/accounts/recover-password', () => {
    it('debería responder con 200 si el email existe', async () => {
        // Simulamos que el servicio encuentra el email
        AccountService.prototype.recoverPassword.mockResolvedValue(true);
        await request(app)
            .post('/api/accounts/recover-password') // Ruta con /api
            .send({ email: 'exists@espe.ec.edu.ec' })
            .expect(200);
    });

    it('debería responder con 404 si el email no existe', async () => {
        // Simulamos que el servicio NO encuentra el email
        AccountService.prototype.recoverPassword.mockRejectedValue(new Error('Email not found'));
        await request(app)
            .post('/api/accounts/recover-password') // Ruta con /api
            .send({ email: 'notexists@espe.ec.edu.ec' })
            .expect(404);
    });
  });

  // --- Pruebas para PUT /api/accounts/profile (Ruta Protegida) ---
  describe('PUT /api/accounts/profile', () => {
    it('debería responder con 200 si la actualización es exitosa', async () => {
        const profileData = { email: 'new@espe.ec.edu.ec', content: 'Contenido actualizado' };
        // Simulamos que el servicio actualiza correctamente
        AccountService.prototype.modifyProfile.mockResolvedValue({ account: profileData });

        await request(app)
            .put('/api/accounts/profile') // Ruta con /api
            .send(profileData)
            .expect(200);
        
        // Verificamos que nuestro middleware mock fue llamado, confirmando que la ruta está protegida.
        expect(authenticateToken).toHaveBeenCalledTimes(1);
    });
  });
});