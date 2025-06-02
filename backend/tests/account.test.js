import request from "supertest";
import app from "../src/app.js";

describe("POST /accounts/create", () => {
  it("Debe crear una cuenta y devolver status 201", async () => {
    const nuevaCuenta = {
      username: "testuser_" + Date.now(), // nombre único por timestamp
      password: "Test1234!",
      email: `test${Date.now()}@example.com`, // email también único
      role: "lector",
      phone_number: "+593987654321",
    };
      
    const response = await request(app)
      .post("/accounts/create")
      .send(nuevaCuenta)
      .set("Accept", "application/json");

    console.log("Respuesta del servidor:", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("account_id"); // <- Aquí el cambio
  });
});
