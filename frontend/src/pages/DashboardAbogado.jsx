import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardAbogada() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processes, setProcesses] = useState([]);
  const [observations, setObservations] = useState({});
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [newObservationText, setNewObservationText] = useState('');
  const [editObservationId, setEditObservationId] = useState(null);
  const [editObservationText, setEditObservationText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/processes/', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los procesos');
        }

        const data = await response.json();
        setProcesses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.token]);

  const fetchObservations = async (processId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/observations/process/${processId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las observaciones');
      }

      const data = await response.json();
      setObservations((prev) => ({ ...prev, [processId]: data }));
      setSelectedProcessId(processId);
    } catch (error) {
      console.error(error);
    }
  };

  const createObservation = async (processId) => {
    try {
      const response = await fetch('http://localhost:3000/api/observations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          process_id: processId,
          observation_text: newObservationText,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la observación');
      }

      setNewObservationText('');
      fetchObservations(processId);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteObservation = async (observationId, processId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/observations/${observationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Error al eliminar la observación');
      }

      fetchObservations(processId);
    } catch (error) {
      console.error(error);
    }
  };

  const updateObservation = async (observationId, processId) => {
    try {
      const response = await fetch('http://localhost:3000/api/observations', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observation_id: observationId,
          observation_text: editObservationText,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la observación');
      }

      setEditObservationId(null);
      setEditObservationText('');
      fetchObservations(processId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 text-white flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-6">¡Bienvenida, Abogada!</h1>
      <p className="text-lg mb-4">Este es tu panel de control donde podrás gestionar tus procesos legales.</p>

      {loading ? (
        <p className="text-yellow-400 animate-pulse">Cargando tus datos...</p>
      ) : processes.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded shadow w-full max-w-xl text-center">
          <p className="mb-2">No tienes procesos asignados aún.</p>
          <p className="text-sm text-gray-400">Cuando tengas procesos asignados, aquí los podrás ver.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {processes.map((process) => (
            <div key={process.process_id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{process.title}</h2>
              <p className="text-sm text-gray-400 mb-1">Tipo: {process.type}</p>
              <p className="text-sm text-gray-400 mb-1">Delito: {process.offense}</p>
              <p className="text-sm text-gray-400 mb-1">Denunciado: {process.denounced}</p>
              <p className="text-sm text-gray-400 mb-1">Denunciante: {process.denouncer}</p>
              <p className="text-sm text-gray-400 mb-1">Provincia: {process.province}</p>
              <p className="text-sm text-gray-400 mb-1">Cartón: {process.carton}</p>
              <p className="text-xs text-gray-500">Última actualización: {new Date(process.last_update).toLocaleDateString()}</p>

              <button
                onClick={() => fetchObservations(process.process_id)}
                className="mt-2 text-blue-400 hover:underline"
              >
                Ver Observaciones
              </button>

              {selectedProcessId === process.process_id && (
                <div className="mt-2 p-2 bg-gray-700 rounded">
                  <h3 className="text-sm font-bold">Observaciones:</h3>

                  <div className="my-2">
                    <input
                      type="text"
                      placeholder="Nueva observación"
                      className="text-black text-xs p-1 rounded w-2/3"
                      value={newObservationText}
                      onChange={(e) => setNewObservationText(e.target.value)}
                    />
                    <button
                      onClick={() => createObservation(process.process_id)}
                      className="text-green-400 text-xs ml-2"
                    >
                      Crear
                    </button>
                  </div>

                  {observations[process.process_id]?.length === 0 ? (
                    <p className="text-gray-400 text-xs">No hay observaciones.</p>
                  ) : (
                    observations[process.process_id]?.map((obs) => (
                      <div key={obs.observation_id} className="text-xs text-gray-300 border-b border-gray-600 py-1 flex justify-between items-center">
                        {editObservationId === obs.observation_id ? (
                          <>
                            <input
                              type="text"
                              value={editObservationText}
                              onChange={(e) => setEditObservationText(e.target.value)}
                              className="text-black p-1 rounded text-xs w-1/2"
                            />
                            <button
                              onClick={() => updateObservation(obs.observation_id, process.process_id)}
                              className="text-green-400 text-xs ml-2"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditObservationId(null)}
                              className="text-red-400 text-xs ml-2"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{obs.content || 'Sin contenido'}</span>
                            <div>
                              <button
                                onClick={() => {
                                  setEditObservationId(obs.observation_id);
                                  setEditObservationText(obs.content || '');
                                }}
                                className="text-yellow-400 text-xs ml-2"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteObservation(obs.observation_id, process.process_id)}
                                className="text-red-400 text-xs ml-2"
                              >
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
