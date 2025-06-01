import React, { useEffect, useState } from 'react';

function DashboardUsuario() {
  const [userProcesses, setUserProcesses] = useState([]);
  const accountId = localStorage.getItem('account_id'); // o según cómo manejes la sesión

  useEffect(() => {
    if (!accountId) return;

    fetch(`http://localhost:3000/api/processes/account/${accountId}`) // Ajusta según tu API
      .then((res) => res.json())
      .then((data) => setUserProcesses(data))
      .catch((err) => console.error('Error al cargar procesos', err));
  }, [accountId]);

  return (
    <div>
      <h2>Mis Procesos</h2>
      <ul>
        {userProcesses.map((process) => (
          <li key={process.process_id}>
            <strong>{process.title}</strong> - {process.type} -{' '}
            {process.province}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardUsuario;
