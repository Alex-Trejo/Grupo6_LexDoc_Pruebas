// tests/roleMiddleware.test.js

// Importamos la función que vamos a probar.
import { authorizeRoles } from '../src/middlewares/roleMiddleware.js';

describe('authorizeRoles Middleware', () => {
  let mockRequest;
  let mockResponse;
  // `next` es una función que el middleware llama para pasar al siguiente en la cadena.
  // La "mockeamos" para verificar si es llamada o no.
  let mockNext;

  // Antes de cada prueba, reseteamos nuestros objetos falsos.
  beforeEach(() => {
    mockRequest = {
      user: null, // Empezamos sin usuario por defecto.
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn(); // Creamos un mock para la función 'next'.
    jest.clearAllMocks();
  });

  it('debería llamar a next() si el rol del usuario está en la lista de roles permitidos', () => {
    // Arrange: Preparamos el escenario.
    // 1. Creamos el middleware para el rol 'admin'.
    const adminOnlyMiddleware = authorizeRoles('admin');
    // 2. Simulamos un usuario que SÍ tiene el rol permitido.
    mockRequest.user = { id: 1, role: 'admin' };

    // Act: Ejecutamos el middleware.
    adminOnlyMiddleware(mockRequest, mockResponse, mockNext);

    // Assert: Verificamos los resultados.
    // 1. Se debe llamar a next() para continuar la petición.
    expect(mockNext).toHaveBeenCalledTimes(1);
    // 2. NO se debe enviar ninguna respuesta de error.
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('debería llamar a next() si el rol del usuario está en una lista con múltiples roles permitidos', () => {
    // Arrange
    const multipleRolesMiddleware = authorizeRoles('admin', 'abogada');
    mockRequest.user = { id: 2, role: 'abogada' };

    // Act
    multipleRolesMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('debería devolver 403 si el rol del usuario NO está en la lista de roles permitidos', () => {
    // Arrange
    const adminOnlyMiddleware = authorizeRoles('admin');
    // Simulamos un usuario con un rol NO permitido.
    mockRequest.user = { id: 3, role: 'lector' };

    // Act
    adminOnlyMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    // 1. NO se debe llamar a next(). La petición debe detenerse aquí.
    expect(mockNext).not.toHaveBeenCalled();
    // 2. Se debe enviar una respuesta de error 403.
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Acceso denegado: Rol no autorizado' });
  });

  it('debería devolver 403 si no hay un usuario adjunto al request', () => {
    // Arrange
    const adminOnlyMiddleware = authorizeRoles('admin');
    // Dejamos mockRequest.user como null (simulando que authenticateToken falló o no se ejecutó).
    mockRequest.user = null;

    // Act
    adminOnlyMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Acceso denegado: Rol no autorizado' });
  });

  it('debería devolver 403 si el objeto de usuario no tiene una propiedad "role"', () => {
    // Arrange
    const adminOnlyMiddleware = authorizeRoles('admin');
    // Simulamos un objeto de usuario malformado, sin la propiedad 'role'.
    mockRequest.user = { id: 4, username: 'noroleuser' };

    // Act
    adminOnlyMiddleware(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Acceso denegado: Rol no autorizado' });
  });
});