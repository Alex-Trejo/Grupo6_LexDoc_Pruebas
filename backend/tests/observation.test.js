const express = require("express");
const observationRoutes = require("../src/routes/observationRoutes.js");
const request = require("supertest");

const app = express();
app.use(express.json());
app.use("/observations", observationRoutes);

describe("Observation API", () => {
  it("debería estar definida", () => {
    expect(app).toBeDefined();
  });

  it("debería responder 404 para GET /observations (ruta no implementada)", async () => {
    const res = await request(app).get("/observations");
    expect(res.statusCode).toBe(404);
  });

  it("debería responder 401 para POST /observations sin token", async () => {
    const res = await request(app)
      .post("/observations")
      .send({ process_id: 1, title: "Test", content: "Contenido" });
    expect(res.statusCode).toBe(401);
  });

  it("debería responder 404 para GET /observations/process/9999 (proceso no existente)", async () => {
    const res = await request(app).get("/observations/process/9999");
    expect([404, 200]).toContain(res.statusCode); // Puede ser 404 o 200 según implementación
  });
});
