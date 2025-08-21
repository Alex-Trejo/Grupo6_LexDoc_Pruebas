export async function loginUser(credentials) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error en el inicio de sesión');
  }

  return await response.json();
}
