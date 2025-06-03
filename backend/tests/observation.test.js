import request from "supertest";
import app from "../src/app.js";
//post /observations
describe("POST /observations", () => {
  it("debe crear una nueva observación y devolver status 201 con el objeto creado", async () => {
    const newObservation = {
      process_id: 1,
      content: "Esto es una observación de prueba",
    };

    const res = await request(app).post("/observations").send(newObservation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("observation_id");
    expect(res.body).toMatchObject({
      process_id: newObservation.process_id,
      content: newObservation.content,
    });
  });
});

//put /observations
describe("PUT /observations", () => {
  it("debe modificar una observación existente y devolver status 200 con el objeto actualizado", async () => {
    const nuevaObservacion = {
      process_id: 1,
      content: "Contenido original",
    };

    const postRes = await request(app)
      .post("/observations")
      .send(nuevaObservacion);
    expect(postRes.statusCode).toBe(201);
    const creada = postRes.body;

    const updatedObservation = {
      observation_id: creada.observation_id,
      process_id: creada.process_id,
      content: "Contenido actualizado",
    };

    const putRes = await request(app)
      .put("/observations")
      .send(updatedObservation);

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body).toHaveProperty("observation_id", creada.observation_id);
    expect(putRes.body).toMatchObject({
      process_id: creada.process_id,
      content: "Contenido actualizado",
    });
  });
});
//delete /observations
describe("DELETE /observations/:observation_id", () => {
  it("debe eliminar una observación existente y devolver status 204 sin contenido", async () => {
    const nuevaObservacion = {
      process_id: 11 + 1,
      content: "Observación temporal para eliminar",
    };

    const postRes = await request(app)
      .post("/observations")
      .send(nuevaObservacion);
    expect(postRes.statusCode).toBe(201);

    const { observation_id } = postRes.body;

    const deleteRes = await request(app).delete(
      `/observations/${observation_id}`
    );

    expect(deleteRes.statusCode).toBe(204);
    expect(deleteRes.body).toEqual({}); // no hay contenido, body vacío
  });
});
// get /observations/process/:process_id
describe("GET /observations/process/:process_id", () => {
  it("debe devolver todas las observaciones asociadas a un proceso", async () => {
    const nuevaObservacion = {
      process_id: 1,
      title: "Observación para GET",
      content: "Contenido de prueba para GET",
    };

    const postRes = await request(app)
      .post("/observations")
      .send(nuevaObservacion);
    expect(postRes.statusCode).toBe(201);
    const createdObservation = postRes.body;

    const getRes = await request(app).get(
      `/observations/process/${createdObservation.process_id}`
    );

    expect(getRes.statusCode).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThan(0);

    const encontrada = getRes.body.find(
      (obs) => obs.observation_id === createdObservation.observation_id
    );
    expect(encontrada).toMatchObject({
      title: "Observación para GET",
      content: "Contenido de prueba para GET",
      process_id: 1,
    });
  });
});
