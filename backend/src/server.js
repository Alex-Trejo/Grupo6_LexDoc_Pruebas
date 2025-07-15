<<<<<<< HEAD
// server.js
import app from "./app.js";

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running en http://localhost:" + (process.env.PORT || 3000));
=======
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
});

export default server;
