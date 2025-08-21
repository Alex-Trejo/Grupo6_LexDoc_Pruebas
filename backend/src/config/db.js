import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connectionConfig = process.env.DATABASE_URL ? 
  {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Requerido para conexiones a Render
    }
  } : 
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
  };

const pool = new Pool(connectionConfig);

export default pool;