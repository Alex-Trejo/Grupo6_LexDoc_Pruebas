// src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pool from "./config/db.js";
import routes from "./routes/index.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import accountRoutes from "./routes/accountRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para verificar conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    next();
  } catch (error) {
    console.error("Error de conexión a DB:", error);
    res.status(500).json({ error: "Error de conexión a base de datos" });
  }
});

// Rutas
app.use("/api", routes);
app.use("/accounts", accountRoutes); // esta ruta ahora se configura aquí directamente

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base
app.get("/", (req, res) => {
  res.send("Backend de gestión documental legal activo");
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de errores generales
app.use((err, req, res, next) => {
  console.error("Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
