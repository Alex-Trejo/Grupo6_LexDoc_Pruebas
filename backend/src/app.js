import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './config/db.js';
import routes from './routes/index.js';
import { swaggerUi, swaggerSpec } from './swagger.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para verificar conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Error de conexión a DB:', error);
    res.status(500).json({ error: 'Error de conexión a base de datos' });
  }
});

// Rutas
app.use('/api', routes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Ruta base para ver que el servidor está activo
app.get('/', (req, res) => {
  res.send('Backend de gestión documental legal activo');
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
