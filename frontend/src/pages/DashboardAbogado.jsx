import React, { useEffect, useState } from 'react';

function DashboardAbogado() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/processes') // Cambia a tu ruta real
      .then((res) => res.json())
      .then((data) => setProcesses(data))
      .catch((err) => console.error('Error al cargar procesos', err));
  }, []);

  return (
    <div>
      <h2>Dashboard de Abogada</h2>
      <ul>
        {processes.map((process) => (
          <li key={process.process_id}>
            <strong>{process.title}</strong> - {process.type} -{' '}
            {process.province}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardAbogado;
