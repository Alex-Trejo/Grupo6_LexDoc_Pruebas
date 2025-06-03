import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardAbogado = () => {
  const { auth } = useAuth();
  const [procesos, setProcesos] = useState([]);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    const fetchProcesos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/procesos', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setProcesos(response.data);
      } catch (error) {
        console.error('Error al obtener los procesos:', error);
      }
    };

    fetchProcesos();
  }, [auth.token]);

  const handleLike = async (procesoId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/procesos/${procesoId}/like`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setProcesos((prevProcesos) =>
        prevProcesos.map((proceso) =>
          proceso.id === procesoId
            ? { ...proceso, likes: proceso.likes + 1 }
            : proceso
        )
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleComentario = async (e, procesoId) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/api/procesos/${procesoId}/comentarios`,
        { comentario },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setComentario('');
      // Actualizar comentarios si es necesario
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Panel del Abogado</h1>
      <p className="mb-8">Aquí puedes ver todos los procesos judiciales.</p>
      {procesos.map((proceso) => (
        <div
          key={proceso.id}
          className="bg-gray-800 p-4 mb-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2">{proceso.titulo}</h2>
          <p className="mb-2">{proceso.descripcion}</p>
          <p className="mb-4 text-sm text-gray-400">
            Fecha: {new Date(proceso.fecha).toLocaleDateString()}
          </p>
          <button
            onClick={() => handleLike(proceso.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            👍 {proceso.likes}
          </button>
          <form
            onSubmit={(e) => handleComentario(e, proceso.id)}
            className="mt-4"
          >
            <input
              type="text"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Agrega un comentario"
              className="w-full p-2 rounded bg-gray-700 text-white mb-2"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Comentar
            </button>
          </form>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Comentarios:</h3>
            {proceso.comentarios?.map((coment, idx) => (
              <p key={idx} className="text-sm text-gray-300 mb-1">
                - {coment.texto}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardAbogado;
