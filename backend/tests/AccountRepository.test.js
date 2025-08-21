// tests/AccountRepository.test.js

import { AccountRepository } from '../src/repositories/AccountRepository.js';
import pool from '../src/config/db.js';

// ¡CLAVE! Le decimos a Jest que intercepte cualquier importación del módulo 'db.js'
// y la reemplace con un mock. De esta forma, 'pool.query' no ejecutará una
// consulta real, sino nuestra versión falsa.
jest.mock('../src/config/db.js');

describe('AccountRepository', () => {
  let accountRepository;

  beforeEach(() => {
    // Creamos una nueva instancia para cada prueba
    accountRepository = new AccountRepository();
    // Limpiamos los contadores y configuraciones de los mocks
    jest.clearAllMocks();
  });

  // --- Pruebas para el método create ---
  describe('create', () => {
    it('debería crear una nueva cuenta y devolverla', async () => {
      // Arrange: Preparamos los datos de entrada y lo que esperamos que devuelva el 'pool' falso.
      const newAccountData = { username: 'testuser', password: 'hashedpassword', email: 'test@test.com', phone_number: '123', role: 'lector' };
      const mockDbResponse = { rows: [{ account_id: 1, ...newAccountData }] };
      pool.query.mockResolvedValue(mockDbResponse); // Configuramos el mock para que devuelva esto

      // Act: Ejecutamos el método del repositorio.
      const result = await accountRepository.create(newAccountData);

      // Assert: Verificamos los resultados.
      expect(result).toEqual({ account_id: 1, ...newAccountData });
      expect(pool.query).toHaveBeenCalledTimes(1);
      // Verificamos que se llamó con la query SQL correcta.
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO account (username, password, email, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [newAccountData.username, newAccountData.password, newAccountData.email, newAccountData.phone_number, newAccountData.role]
      );
    });
  });

  // --- Pruebas para el método findByUsername ---
  describe('findByUsername', () => {
    it('debería encontrar un usuario por su nombre de usuario', async () => {
      // Arrange
      const username = 'testuser';
      const mockUser = { account_id: 1, username: username };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      // Act
      const result = await accountRepository.findByUsername(username);

      // Assert
      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM account WHERE username = $1', [username]);
    });

    it('debería devolver undefined si no se encuentra el usuario', async () => {
      // Arrange: Simulamos una respuesta de base de datos vacía.
      pool.query.mockResolvedValue({ rows: [] });
      
      // Act
      const result = await accountRepository.findByUsername('nonexistent');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  // --- Pruebas para el método findById ---
  describe('findById', () => {
    it('debería encontrar un usuario por su ID', async () => {
      const accountId = 1;
      const mockUser = { account_id: accountId, username: 'test' };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await accountRepository.findById(accountId);

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM account WHERE account_id = $1', [accountId]);
    });
  });

  // --- Pruebas para el método update ---
  describe('update', () => {
    it('debería actualizar una cuenta y devolver los datos actualizados', async () => {
      const accountToUpdate = { account_id: 1, email: 'new@email.com', phone_number: '987', password: 'newpassword' };
      pool.query.mockResolvedValue({ rows: [accountToUpdate] });

      const result = await accountRepository.update(accountToUpdate);

      expect(result).toEqual(accountToUpdate);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE account SET'), // Usamos 'stringContaining' porque la query tiene saltos de línea.
        [accountToUpdate.email, accountToUpdate.phone_number, accountToUpdate.password, accountToUpdate.account_id]
      );
    });
  });

  // --- Pruebas para el método findByEmail ---
  describe('findByEmail', () => {
    it('debería encontrar un usuario por su email', async () => {
      const email = 'test@test.com';
      const mockUser = { account_id: 1, email: email };
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await accountRepository.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM account WHERE email = $1', [email]);
    });
  });

  // --- Pruebas para el método findWithProfile ---
  describe('findWithProfile', () => {
    it('debería encontrar un usuario con su perfil asociado', async () => {
      const accountId = 1;
      const mockProfile = { account_id: accountId, username: 'test', content: 'Soy abogado' };
      pool.query.mockResolvedValue({ rows: [mockProfile] });

      const result = await accountRepository.findWithProfile(accountId);

      expect(result).toEqual(mockProfile);
      expect(pool.query).toHaveBeenCalledWith(
  `
    SELECT 
      a.account_id, a.username, a.email, a.phone_number, a.role,
      p.content
    FROM account a
    LEFT JOIN profile p ON a.account_id = p.account_id
    WHERE a.account_id = $1
  `,
  [accountId]
);
    });
  });
});