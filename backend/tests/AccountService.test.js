// tests/AccountService.test.js

import { AccountService } from '../src/services/AccountService.js';
import { AccountRepository } from '../src/repositories/AccountRepository.js';
import { ProfileRepository } from '../src/repositories/ProfileRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// --- Mocks Globales para las dependencias ---
jest.mock('../src/repositories/AccountRepository.js');
jest.mock('../src/repositories/ProfileRepository.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AccountService', () => {
  let accountService;

  beforeEach(() => {
    accountService = new AccountService();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método register ---
  describe('register', () => {
    it('debería hashear la contraseña, crear una cuenta y un perfil, y devolver la cuenta', async () => {
      const accountData = { username: 'test', password: 'plainpassword' };
      const hashedPassword = 'hashed_password';
      const createdAccount = { account_id: 1, ...accountData, password: hashedPassword };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      AccountRepository.prototype.create.mockResolvedValue(createdAccount);
      ProfileRepository.prototype.create.mockResolvedValue({});

      const result = await accountService.register(accountData);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
      expect(AccountRepository.prototype.create).toHaveBeenCalledWith({ ...accountData, password: hashedPassword });
      expect(ProfileRepository.prototype.create).toHaveBeenCalledWith({ account_id: 1, content: null });
      expect(result).toEqual(createdAccount);
    });
  });

  // --- Pruebas para el método login ---
  describe('login', () => {
    it('debería devolver un token y datos de usuario con credenciales correctas', async () => {
      const username = 'testuser';
      const password = 'plainpassword';
      const userFromDb = { account_id: 1, username, password: 'hashed_password', role: 'admin' };
      const fakeToken = 'fake-jwt-token';

      AccountRepository.prototype.findByUsername.mockResolvedValue(userFromDb);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(fakeToken);

      const result = await accountService.login(username, password);

      expect(result.token).toBe(fakeToken);
      expect(result.user).toEqual(userFromDb);
    });

    it('debería lanzar un error si el usuario no se encuentra', async () => {
      AccountRepository.prototype.findByUsername.mockResolvedValue(null);
      await expect(accountService.login('nonexistent', 'pass')).rejects.toThrow('User not found');
    });

    it('debería lanzar un error si la contraseña es incorrecta', async () => {
      const userFromDb = { password: 'hashed_password' };
      AccountRepository.prototype.findByUsername.mockResolvedValue(userFromDb);
      bcrypt.compare.mockResolvedValue(false);
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
    const accountId = 1;
    const originalAccount = { account_id: accountId, email: 'old@email.com', phone_number: '12345', password: 'old_hashed_password' };
    const originalProfile = { profile_id: 10, content: 'Contenido viejo' };

    // Hacemos que findById devuelva la cuenta original por defecto para la mayoría de los tests.
    beforeEach(() => {
        AccountRepository.prototype.findById.mockResolvedValue(originalAccount);
    });

    it('debería actualizar la cuenta y el perfil correctamente', async () => {
        const profileData = { email: 'new@email.com', content: 'Nuevo contenido' };
        ProfileRepository.prototype.findByAccountId.mockResolvedValue(originalProfile);
        ProfileRepository.prototype.update.mockResolvedValue({ profile_id: 10, content: 'Nuevo contenido' });
        
        const result = await accountService.modifyProfile(accountId, profileData);
        
        expect(AccountRepository.prototype.update).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@email.com' }));
        expect(ProfileRepository.prototype.update).toHaveBeenCalledWith({ profile_id: 10, content: 'Nuevo contenido' });
        expect(result.profile.content).toBe('Nuevo contenido');
    });

    it('debería hashear la nueva contraseña si se proporciona', async () => {
        const profileData = { password: 'newplainpassword' };
        bcrypt.hash.mockResolvedValue('new_hashed_password');
        
        await accountService.modifyProfile(accountId, profileData);
        
        expect(bcrypt.hash).toHaveBeenCalledWith('newplainpassword', 10);
        expect(AccountRepository.prototype.update).toHaveBeenCalledWith(expect.objectContaining({ password: 'new_hashed_password' }));
    });

    it('debería lanzar un error si la cuenta no se encuentra', async () => {
        AccountRepository.prototype.findById.mockResolvedValue(null);
        await expect(accountService.modifyProfile(999, {})).rejects.toThrow('Account not found');
    });

    // ===================================================================
    // --- INICIO DE LAS PRUEBAS AÑADIDAS PARA AUMENTAR COBERTURA ---
    // ===================================================================
    
    it('debería conservar los datos originales si los nuevos datos están vacíos o nulos', async () => {
      // Esta prueba cubre la línea 69 y la lógica ternaria para el email.
      const profileData = { phone_number: '', email: null };
      
      await accountService.modifyProfile(accountId, profileData);

      // Verificamos que se llamó a update con los datos del 'originalAccount'
      expect(AccountRepository.prototype.update).toHaveBeenCalledWith(
        expect.objectContaining({
            phone_number: originalAccount.phone_number,
            email: originalAccount.email
        })
      );
    });

    it('no debería intentar actualizar el perfil si findByAccountId no devuelve nada', async () => {
      // Esta prueba cubre la línea 93
      const profileData = { content: 'Nuevo contenido' };
      // Simulamos que no se encuentra un perfil para esta cuenta
      ProfileRepository.prototype.findByAccountId.mockResolvedValue(null);

      await accountService.modifyProfile(accountId, profileData);

      // Verificamos que, como 'profile' es null, NUNCA se llama a profileRepo.update
      expect(ProfileRepository.prototype.update).not.toHaveBeenCalled();
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