// tests/jwtUtil.test.js

import { generateToken, verifyToken } from '../src/utils/jwtUtil.js';
import jwt from 'jsonwebtoken';

// Accedemos a la misma clave secreta que usa la aplicación para las pruebas.
const SECRET_KEY = process.env.JWT_SECRET || 'AAAAAAAAABBBBBCCCC';

describe('JWT Utilities', () => {

  // --- Pruebas para generateToken ---
  describe('generateToken', () => {
    it('debería generar un token JWT válido', () => {
      // Arrange
      const payload = { userId: 1, role: 'admin' };
      
      // Act
      const token = generateToken(payload);

      // Assert
      // 1. Verificamos que el resultado es un string no vacío.
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // 2. Verificamos que el token puede ser decodificado con la misma clave secreta.
      // Esto prueba indirectamente que fue firmado correctamente.
      const decoded = jwt.verify(token, SECRET_KEY);

      // 3. Verificamos que el contenido (payload) del token decodificado es correcto.
      // Usamos 'expect.objectContaining' para no tener que comprobar las propiedades
      // que jwt añade automáticamente (como 'iat' y 'exp').
      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('debería lanzar un error si el payload no es un objeto válido', () => {
        // Arrange: Pasamos un payload inválido (undefined)
        const invalidPayload = undefined;

        // Act & Assert: Verificamos que jwt.sign lanza un error.
        // Usamos una función anónima para que Jest pueda capturar el error.
        expect(() => generateToken(invalidPayload)).toThrow();
    });
  });

  // --- Pruebas para verifyToken ---
  describe('verifyToken', () => {
    it('debería verificar un token válido y devolver el payload', () => {
      // Arrange
      const payload = { userId: 2, role: 'lector' };
      // Creamos un token de prueba válido.
      const validToken = jwt.sign(payload, SECRET_KEY);

      // Act
      const decoded = verifyToken(validToken);

      // Assert
      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('debería devolver null si el token es inválido (firma incorrecta)', () => {
      // Arrange
      const payload = { userId: 3 };
      // Firmamos el token con una clave secreta DIFERENTE.
      const invalidToken = jwt.sign(payload, 'WRONG_SECRET_KEY');

      // Act
      const decoded = verifyToken(invalidToken);

      // Assert
      expect(decoded).toBeNull();
    });

    it('debería devolver null si el token ha expirado', () => {
      // Arrange
      const payload = { userId: 4 };
      // Creamos un token que expira inmediatamente (0 segundos).
      const expiredToken = jwt.sign(payload, SECRET_KEY, { expiresIn: 0 });
      
      // Act
      const decoded = verifyToken(expiredToken);

      // Assert
      expect(decoded).toBeNull();
    });

    it('debería devolver null si el token es un string malformado', () => {
        // Arrange
        const malformedToken = 'esto.no.es.un.token';

        // Act
        const decoded = verifyToken(malformedToken);

        // Assert
        expect(decoded).toBeNull();
    });

    it('debería devolver null si el token es nulo o indefinido', () => {
        // Arrange, Act, Assert
        expect(verifyToken(null)).toBeNull();
        expect(verifyToken(undefined)).toBeNull();
    });
  });
});