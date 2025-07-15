// Importa utilidades para renderizar y buscar elementos en pruebas
import { render, screen } from '@testing-library/react';

// Importa el componente a probar
import LoginForm from './LoginForm';

// Funciones de Vitest para definir la prueba
import { describe, it, expect } from 'vitest';

// Contexto de autenticación necesario para LoginForm
import { AuthProvider } from '../context/AuthContext';

// Enrutador en memoria para simular navegación en pruebas
import { MemoryRouter } from 'react-router-dom';

// Función que envuelve el componente con Router y Contexto
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

// Pruebas para el componente LoginForm
describe('LoginForm', () => {
  it('renderiza el botón de inicio de sesión', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
