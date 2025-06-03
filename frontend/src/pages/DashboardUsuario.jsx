import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardUsuario() {
  const { auth } = useAuth();
  const [procesos, setProcesos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [likes, setLikes] = useState({});
  const [comentarios, setComentarios] = useState({});

  useEffect(() => {
    if (!auth?.token) return; // si no hay token, no hace fetch

    fetch('http://localhost:3000/api/processes', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Procesos cargados:', data);
        setProcesos(data);

        data.forEach((proceso) => {
          fetch(`http://localhost:3000/api/evidences/process/${proceso.process_id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
            .then((res) => res.json())
            .then((evids) => {
              setEvidencias((prev) => ({
                ...prev,
                [proceso.process_id]: evids,
              }));
            })
            .catch((err) => console.error('Error al obtener evidencias', err));
        });
      })
      .catch((err) => console.error('Error al obtener procesos', err));
  }, [auth?.token]);

  const manejarLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const manejarComentario = (id, texto) => {
    if (!texto) return;
    setComentarios((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), texto],
    }));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">👩‍⚖️ Abg. Luz Romero</h1>
        <nav className="space-y-4">
          <a href="#" className="block hover:text-green-400">
            🏠 Inicio
          </a>
          <a href="#" className="block hover:text-green-400">
            📅 Eventos
          </a>
          <a href="#" className="block hover:text-green-400">
            👤 Perfil
          </a>
          <a href="#" className="block hover:text-green-400">
            ⚙️ Cuenta
          </a>
          <Link to="/" className="block hover:text-red-400">
            🚪 Salir
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">Procesos Publicados</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procesos.map((proceso) => (
            <div
              key={proceso.process_id}
              className="bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold">{proceso.title}</h3>
              <p className="text-gray-400 text-sm">Tipo: {proceso.type}</p>
              <p className="text-gray-400 text-sm">
                Provincia: {proceso.province}
              </p>




              {/* Likes */}
              <div className="mt-4">
                <button
                  onClick={() => manejarLike(proceso.process_id)}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  👍 Me gusta ({likes[proceso.process_id] || 0})
                </button>
              </div>

              {/* Comentarios */}
              <div className="mt-4">
                <h4 className="font-medium">Comentarios:</h4>
                <ul className="text-sm text-gray-300 mb-2">
                  {(comentarios[proceso.process_id] || []).map((cmt, i) => (
                    <li key={i}>• {cmt}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="w-full p-2 rounded bg-gray-700 text-white text-sm mb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      manejarComentario(proceso.process_id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardUsuario;
