import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardAbogada() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí puedes poner fetchData si quieres, pero por ahora solo el loading
    setTimeout(() => {
      setLoading(false);
    }, 1000); // simulamos carga 1s
  }, []);

  return (
    <div className="p-6 text-white flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-6">¡Bienvenida, Abogada!</h1>
      <p className="text-lg mb-4">Este es tu panel de control donde podrás gestionar tus procesos legales.</p>

      {loading ? (
        <p className="text-yellow-400 animate-pulse">Cargando tus datos...</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded shadow w-full max-w-xl text-center">
          <p className="mb-2">No tienes procesos asignados aún.</p>
          <p className="text-sm text-gray-400">Cuando tengas procesos asignados, aquí los podrás ver.</p>
        </div>
      )}
    </div>
  );
}
