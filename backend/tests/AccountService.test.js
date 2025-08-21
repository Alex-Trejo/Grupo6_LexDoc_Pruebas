// tests/AccountService.test.js

import { AccountService } from '../src/services/AccountService.js';
import { AccountRepository } from '../src/repositories/AccountRepository.js';
import { ProfileRepository } from '../src/repositories/ProfileRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- Mocks Globales para las dependencias ---
// Mockeamos los repositorios para que no accedan a la base de datos.
jest.mock('../src/repositories/AccountRepository.js');
jest.mock('../src/repositories/ProfileRepository.js');
// Mockeamos bcrypt para que las pruebas sean rápidas.
jest.mock('bcrypt');
// Mockeamos jsonwebtoken para controlar la generación de tokens.
jest.mock('jsonwebtoken');

describe('AccountService', () => {
  let accountService;

  beforeEach(() => {
    accountService = new AccountService();
    // Limpiamos todos los mocks antes de cada prueba.
    jest.clearAllMocks();
  });

  // --- Pruebas para el método register ---
  describe('register', () => {
    it('debería hashear la contraseña, crear una cuenta y un perfil, y devolver la cuenta', async () => {
      // Arrange
      const accountData = { username: 'test', password: 'plainpassword' };
      const hashedPassword = 'hashed_password';
      const createdAccount = { account_id: 1, ...accountData, password: hashedPassword };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      AccountRepository.prototype.create.mockResolvedValue(createdAccount);
      ProfileRepository.prototype.create.mockResolvedValue({}); // No necesitamos el resultado del perfil

      // Act
      const result = await accountService.register(accountData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
      expect(AccountRepository.prototype.create).toHaveBeenCalledWith({
        ...accountData,
        password: hashedPassword,
      });
      expect(ProfileRepository.prototype.create).toHaveBeenCalledWith({
        account_id: createdAccount.account_id,
        content: null,
      });
      expect(result).toEqual(createdAccount);
    });
  });

  // --- Pruebas para el método login ---
  describe('login', () => {
    it('debería devolver un token y datos de usuario con credenciales correctas', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'plainpassword';
      const userFromDb = { account_id: 1, username, password: 'hashed_password', role: 'admin' };
      const fakeToken = 'fake-jwt-token';

      AccountRepository.prototype.findByUsername.mockResolvedValue(userFromDb);
      bcrypt.compare.mockResolvedValue(true); // Simulamos que la contraseña coincide
      jwt.sign.mockReturnValue(fakeToken);

      // Act
      const result = await accountService.login(username, password);

      // Assert
      expect(result.token).toBe(fakeToken);
      expect(result.user).toEqual(userFromDb);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userFromDb.account_id, username: userFromDb.username, role: userFromDb.role },
        expect.any(String),
        { expiresIn: '1h' }
      );
    });

    it('debería lanzar un error si el usuario no se encuentra', async () => {
      AccountRepository.prototype.findByUsername.mockResolvedValue(null);
      // Usamos .rejects para verificar que una promesa es rechazada (lanza un error)
      await expect(accountService.login('nonexistent', 'pass')).rejects.toThrow('User not found');
    });

    it('debería lanzar un error si la contraseña es incorrecta', async () => {
      const userFromDb = { password: 'hashed_password' };
      AccountRepository.prototype.findByUsername.mockResolvedValue(userFromDb);
      bcrypt.compare.mockResolvedValue(false); // La contraseña no coincide

      await expect(accountService.login('user', 'wrongpass')).rejects.toThrow('Invalid password');
    });
  });

  // --- Pruebas para el método recoverPassword ---
  describe('recoverPassword', () => {
    it('debería devolver true si el email existe', async () => {
      AccountRepository.prototype.findByEmail.mockResolvedValue({ email: 'exists@test.com' });
      const result = await accountService.recoverPassword('exists@test.com');
      expect(result).toBe(true);
    });

    it('debería lanzar un error si el email no existe', async () => {
      AccountRepository.prototype.findByEmail.mockResolvedValue(null);
      await expect(accountService.recoverPassword('notexists@test.com')).rejects.toThrow('Email not found');
    });
  });

  // --- Pruebas para el método modifyProfile ---
  describe('modifyProfile', () => {
    it('debería actualizar la cuenta y el perfil correctamente', async () => {
        // Arrange
        const accountId = 1;
        const profileData = { email: 'new@email.com', content: 'Nuevo contenido' };
        const originalAccount = { account_id: accountId, email: 'old@email.com', password: 'old_hashed_password' };
        const originalProfile = { profile_id: 10, content: 'Contenido viejo' };

        AccountRepository.prototype.findById.mockResolvedValue(originalAccount);
        ProfileRepository.prototype.findByAccountId.mockResolvedValue(originalProfile);
        AccountRepository.prototype.update.mockResolvedValue({}); // No necesitamos el resultado
        ProfileRepository.prototype.update.mockResolvedValue({ profile_id: 10, content: 'Nuevo contenido' });

        // Act
        const result = await accountService.modifyProfile(accountId, profileData);

        // Assert
        expect(AccountRepository.prototype.update).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'new@email.com' })
        );
        expect(ProfileRepository.prototype.update).toHaveBeenCalledWith({
            profile_id: 10, content: 'Nuevo contenido'
        });
        expect(result.profile.content).toBe('Nuevo contenido');
    });

    it('debería hashear la nueva contraseña si se proporciona', async () => {
        const accountId = 1;
        const profileData = { password: 'newplainpassword' };
        AccountRepository.prototype.findById.mockResolvedValue({ account_id: accountId });
        bcrypt.hash.mockResolvedValue('new_hashed_password');

        await accountService.modifyProfile(accountId, profileData);

        expect(bcrypt.hash).toHaveBeenCalledWith('newplainpassword', 10);
        expect(AccountRepository.prototype.update).toHaveBeenCalledWith(
            expect.objectContaining({ password: 'new_hashed_password' })
        );
    });

    it('debería lanzar un error si la cuenta no se encuentra', async () => {
        AccountRepository.prototype.findById.mockResolvedValue(null);
        await expect(accountService.modifyProfile(999, {})).rejects.toThrow('Account not found');
    });
  });

  // --- Pruebas para el método getProfile ---
  describe('getProfile', () => {
    it('debería devolver los datos del perfil desde el repositorio', async () => {
        const accountId = 1;
        const mockProfileData = { account_id: 1, username: 'test', content: '...' };
        AccountRepository.prototype.findWithProfile.mockResolvedValue(mockProfileData);

        const result = await accountService.getProfile(accountId);

        expect(result).toEqual(mockProfileData);
        expect(AccountRepository.prototype.findWithProfile).toHaveBeenCalledWith(accountId);
    });
  });
});