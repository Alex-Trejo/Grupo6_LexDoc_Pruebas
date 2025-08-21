// tests/ProfileRepository.test.js

import { ProfileRepository } from '../src/repositories/ProfileRepository.js';
import pool from '../src/config/db.js';

// Mock del pool de la base de datos para realizar pruebas aisladas.
jest.mock('../src/config/db.js');

describe('ProfileRepository', () => {
  let profileRepository;

  beforeEach(() => {
    profileRepository = new ProfileRepository();
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear un nuevo perfil y devolverlo', async () => {
      // Arrange
      const profileData = { content: 'Soy Abogado.', account_id: 1 };
      const mockDbResponse = { rows: [{ profile_id: 10, ...profileData }] };
      pool.query.mockResolvedValue(mockDbResponse);

      // Act
      const result = await profileRepository.create(profileData);

      // Assert
      expect(result).toEqual({ profile_id: 10, ...profileData });
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO profile (content, account_id) VALUES ($1, $2) RETURNING *',
        [profileData.content, profileData.account_id]
      );
    });
  });

  // --- Pruebas para el método findByAccountId ---
  describe('findByAccountId', () => {
    it('debería encontrar un perfil por el ID de la cuenta', async () => {
      // Arrange
      const accountId = 1;
      const mockProfile = { profile_id: 10, content: 'Contenido del perfil', account_id: accountId };
      pool.query.mockResolvedValue({ rows: [mockProfile] });

      // Act
      const result = await profileRepository.findByAccountId(accountId);

      // Assert
      expect(result).toEqual(mockProfile);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM profile WHERE account_id = $1', [accountId]);
    });

    it('debería devolver undefined si no se encuentra el perfil', async () => {
      // Arrange
      pool.query.mockResolvedValue({ rows: [] });
      
      // Act
      const result = await profileRepository.findByAccountId(999);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar un perfil y devolver los datos actualizados', async () => {
      // Arrange
      const profileData = { profile_id: 10, content: 'Contenido actualizado' };
      const mockUpdatedProfile = { ...profileData, account_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockUpdatedProfile] });

      // Act
      const result = await profileRepository.update(profileData);

      // Assert
      expect(result).toEqual(mockUpdatedProfile);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE profile SET content = $1 WHERE profile_id = $2 RETURNING *',
        [profileData.content, profileData.profile_id]
      );
    });
  });
});