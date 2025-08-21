// tests/jwtUtil.test.js

import { generateToken, verifyToken } from '../src/utils/jwtUtil.js';
import jwt from 'jsonwebtoken';

// Accedemos a la misma clave secreta que usa la aplicación para las pruebas.
const SECRET_KEY = process.env.JWT_SECRET ;

describe('JWT Utilities', () => {

  // --- Pruebas para generateToken ---
  describe('generateToken', () => {
    it('debería generar un token JWT válido', () => {
      // Arrange
      const payload = { userId: 1, role: 'admin' };
      
      // Act
      const token = generateToken(payload);

      // Assert
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      const decoded = jwt.verify(token, SECRET_KEY);
      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('debería lanzar un error si el payload no es un objeto válido', () => {
        const invalidPayload = undefined;
        expect(() => generateToken(invalidPayload)).toThrow();
    });
  });

  // --- Pruebas para verifyToken ---
  describe('verifyToken', () => {
    it('debería verificar un token válido y devolver el payload', () => {
      const payload = { userId: 2, role: 'lector' };
      const validToken = jwt.sign(payload, SECRET_KEY);
      const decoded = verifyToken(validToken);
      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('debería devolver null si el token es inválido (firma incorrecta)', () => {
      const payload = { userId: 3 };
      const invalidToken = jwt.sign(payload, 'WRONG_SECRET_KEY');
      const decoded = verifyToken(invalidToken);
      expect(decoded).toBeNull();
    });

    it('debería devolver null si el token ha expirado', () => {
      const payload = { userId: 4 };
      const expiredToken = jwt.sign(payload, SECRET_KEY, { expiresIn: 0 });
      const decoded = verifyToken(expiredToken);
      expect(decoded).toBeNull();
    });

    it('debería devolver null si el token es un string malformado', () => {
        const malformedToken = 'esto.no.es.un.token';
        const decoded = verifyToken(malformedToken);
        expect(decoded).toBeNull();
    });

    it('debería devolver null si el token es nulo o indefinido', () => {
        expect(verifyToken(null)).toBeNull();
        expect(verifyToken(undefined)).toBeNull();
    });
  });

  // ===================================================================
  // --- INICIO DE LA PRUEBA AÑADIDA PARA AUMENTAR COBERTURA ---
  // ===================================================================

  describe('when JWT_SECRET environment variable is not set', () => {
    let originalSecret;

    // Antes de que empiecen las pruebas en este bloque, guardamos la variable original y la borramos.
    beforeAll(() => {
      originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
    });

    // Después de que terminen todas las pruebas, restauramos la variable original para no afectar otros tests.
    afterAll(() => {
      process.env.JWT_SECRET = originalSecret;
    });

    it('debería usar la clave secreta de respaldo para generar y verificar un token', () => {
      // Forzamos a Jest a recargar el módulo jwtUtil.js AHORA,
      // mientras process.env.JWT_SECRET está borrado.
      jest.resetModules();
      const { generateToken: generateTokenWithFallback, verifyToken: verifyTokenWithFallback } = require('../src/utils/jwtUtil.js');

      const payload = { userId: 5 };
      const fallbackToken = generateTokenWithFallback(payload);

      // Verificamos que el token fue firmado con la clave de respaldo.
      // Si jwt.verify no lanza un error, significa que la clave es correcta.
      expect(() => {
        jwt.verify(fallbackToken, 'AAAAAAAAABBBBBCCCC');
      }).not.toThrow();

      // Verificamos que nuestra función `verifyToken` también funciona con la clave de respaldo.
      const decoded = verifyTokenWithFallback(fallbackToken);
      expect(decoded).toEqual(expect.objectContaining(payload));
    });
  });
});