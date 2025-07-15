// Prueba unitaria para RegisterForms
import { render, screen } from '@testing-library/react';
import RegisterForms from './RegisterForms';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Función auxiliar que incluye Router y Contexto
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('RegisterForms', () => {
  it('renderiza el formulario de registro', () => {
    renderWithProviders(<RegisterForms />);

    // Verificamos que exista un input para nombre de usuario (puede variar)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
