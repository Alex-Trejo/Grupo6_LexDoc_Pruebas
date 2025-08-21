// tests/accountRoutes.test.js

import request from 'supertest';
import app from '../src/app.js'; // Importamos la aplicación Express completa
import { AccountService } from '../src/services/AccountService.js';
import { authenticateToken } from '../src/middlewares/authMiddleware.js';

// --- Mocks Globales ---
// Mockeamos el servicio para controlar las respuestas y evitar llamadas a la BD.
jest.mock('../src/services/AccountService.js');

// Mockeamos el middleware de autenticación para probar rutas protegidas.
// La implementación del mock simula un token válido y adjunta un usuario a `req`.
jest.mock('../src/middlewares/authMiddleware.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 1, username: 'testuser', role: 'abogada' };
    next();
  }),
}));

describe('Account Routes - Integration Tests', () => {

  // Limpiamos los mocks antes de cada prueba para asegurar un estado limpio.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Pruebas para POST /api/accounts/create ---
  describe('POST /api/accounts/create', () => {
    it('debería responder con 201 si los datos de creación son válidos', async () => {
      // Arrange
      const userData = { username: 'newuserok', password: 'password123', email: 'new@test.com', role: 'lector' };
      // Configuramos el mock para que devuelva un resultado exitoso
      AccountService.prototype.register.mockResolvedValue({ account_id: 2, ...userData });

      // Act & Assert
      await request(app)
        .post('/api/accounts/create')
        .send(userData)
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('account_id', 2);
          expect(response.body.username).toBe('newuserok');
        });
    });

    it('debería responder con 400 si faltan campos en la creación', async () => {
      await request(app)
        .post('/api/accounts/create')
        .send({ username: 'test' }) // Datos incompletos
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Missing required fields');
        });
    });
  });

  // --- Pruebas para POST /api/accounts/login ---
  describe('POST /api/accounts/login', () => {
    it('debería responder con 200 y un token con credenciales válidas', async () => {
      const loginData = { username: 'testuser', password: 'password123' };
      AccountService.prototype.login.mockResolvedValue({ token: 'fake-jwt-token' });

      await request(app)
        .post('/api/accounts/login')
        .send(loginData)
        .expect(200)
        .then(response => {
          expect(response.body).toHaveProperty('token', 'fake-jwt-token');
        });
    });

    it('debería responder con 401 con credenciales inválidas', async () => {
        const loginData = { username: 'testuser', password: 'wrong' };
        AccountService.prototype.login.mockRejectedValue(new Error('Invalid credentials'));
  
        await request(app)
          .post('/api/accounts/login')
          .send(loginData)
          .expect(401);
      });
  });

  // --- Pruebas para POST /api/accounts/recover-password ---
  describe('POST /api/accounts/recover-password', () => {
    it('debería responder con 200 si el email existe', async () => {
        AccountService.prototype.recoverPassword.mockResolvedValue(true);
        await request(app)
            .post('/api/accounts/recover-password')
            .send({ email: 'exists@test.com' })
            .expect(200);
    });

    it('debería responder con 404 si el email no existe', async () => {
        AccountService.prototype.recoverPassword.mockRejectedValue(new Error('Email not found'));
        await request(app)
            .post('/api/accounts/recover-password')
            .send({ email: 'notexists@test.com' })
            .expect(404);
    });
  });

  // --- Pruebas para PUT /api/accounts/profile (Ruta Protegida) ---
  describe('PUT /api/accounts/profile', () => {

    it('debería llamar al middleware authenticateToken', async () => {
        // Esta prueba solo verifica que el middleware se activa.
        // Hacemos que el servicio falle para detener la ejecución y no preocuparnos por el resto.
        AccountService.prototype.modifyProfile.mockRejectedValue(new Error('Stop execution'));
        
        await request(app).put('/api/accounts/profile').send({});
        
        // La aserción principal es verificar que el mock del middleware fue llamado.
        expect(authenticateToken).toHaveBeenCalledTimes(1);
    });

    it('debería responder con 200 si la actualización es exitosa', async () => {
        // Arrange: Preparamos un cuerpo de petición que pase todas las validaciones.
        const profileData = { 
            email: 'newprofile@espe.ec.edu.ec', // Dominio válido
            password: 'newvalidpassword123',      // Longitud válida
            phone_number: '+1234567890123'         // Formato válido
        };
        // El mock devuelve la estructura que el controlador espera.
        const mockServiceResponse = { account: { email: 'newprofile@espe.ec.edu.ec' }, profile: {} };
        AccountService.prototype.modifyProfile.mockResolvedValue(mockServiceResponse);

        // Act & Assert
        await request(app)
            .put('/api/accounts/profile')
            .send(profileData)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockServiceResponse);
            });
    });

    it('debería responder con 400 si los datos son inválidos', async () => {
        // Arrange: Enviamos un email con un dominio no permitido.
        const invalidProfileData = { email: 'test@invalid-domain.com' };

        // Act & Assert
        await request(app)
            .put('/api/accounts/profile')
            .send(invalidProfileData)
            .expect(400)
            .then(response => {
                expect(response.body.message).toContain('is not allowed');
            });
    });
});

  // --- Pruebas para GET /api/accounts/profile (Ruta Protegida) ---
  describe('GET /api/accounts/profile', () => {
    it('debería llamar al middleware authenticateToken y responder 200 con datos', async () => {
        const profileData = { account_id: 1, username: 'testuser' };
        AccountService.prototype.getProfile.mockResolvedValue(profileData);

        await request(app)
            .get('/api/accounts/profile')
            .expect(200)
            .then(response => {
                expect(response.body.account_id).toBe(1);
            });
        
        expect(authenticateToken).toHaveBeenCalledTimes(1);
    });

    it('debería responder con 404 si el perfil no se encuentra', async () => {
        AccountService.prototype.getProfile.mockResolvedValue(null);
        await request(app)
            .get('/api/accounts/profile')
            .expect(404);
    });
  });
});