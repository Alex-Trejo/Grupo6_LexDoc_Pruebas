export async function loginUser(credentials) {
<<<<<<< HEAD
  const response = await fetch('http://localhost:3000/api', {
=======
  const response = await fetch('http://localhost:3000/api/accounts/login', {
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error en el inicio de sesión');
  }

  return await response.json();
}
