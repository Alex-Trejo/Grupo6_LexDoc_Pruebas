<<<<<<< HEAD
import request from "supertest";
import app from "../src/app.js";
//post http://localhost:3000/api/accounts/create
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

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("account_id"); // <- Aquí el cambio
  });
});
//post http://localhost:3000/api/accounts/create
describe("POST /accounts/login", () => {
  it("debe devolver 200 si las credenciales son válidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: "string",
      password: "string",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token"); // Si tu API devuelve un token
  });

  it("debe devolver 401 si las credenciales son inválidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: "usuarioinvalido",
      password: "contrainvalida",
=======
import request from 'supertest';
import app from '../src/app.js';
//post http://localhost:3000/api/accounts/create
describe('POST /accounts/create', () => {
  it('Debe crear una cuenta y devolver status 201', async () => {
    const nuevaCuenta = {
      username: 'testuser_' + Date.now(), // nombre único por timestamp
      password: 'Test1234!',
      email: `test${Date.now()}@example.com`, // email también único
      role: 'lector',
      phone_number: '+593987654321',
    };

    const response = await request(app)
      .post('/accounts/create')
      .send(nuevaCuenta)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('account_id'); // <- Aquí el cambio
  });
});
//post http://localhost:3000/api/accounts/create
describe('POST /accounts/login', () => {
  it('debe devolver 200 si las credenciales son válidas', async () => {
    const response = await request(app).post('/accounts/login').send({
      username: 'string',
      password: 'string',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token'); // Si tu API devuelve un token
  });

  it('debe devolver 401 si las credenciales son inválidas', async () => {
    const response = await request(app).post('/accounts/login').send({
      username: 'usuarioinvalido',
      password: 'contrainvalida',
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    });

    expect(response.statusCode).toBe(401);
  });
});
//post http://localhost:3000/api/accounts/recover-password
<<<<<<< HEAD
describe("POST /accounts/recover-password", () => {
  it("debe devolver 200 si el correo se envia correctamente", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({
        email: "mssalcedo2@espe.edu.ec",
=======
describe('POST /accounts/recover-password', () => {
  it('debe devolver 200 si el correo se envia correctamente', async () => {
    const response = await request(app)
      .post('/accounts/recover-password')
      .send({
        email: 'mssalcedo2@espe.edu.ec',
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      });

    expect(response.statusCode).toBe(200);
  });

<<<<<<< HEAD
  it("debe devolver 401 si las credenciales son inválidas", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({
        email: "mssalcedo2@espe.edu.e",
=======
  it('debe devolver 401 si las credenciales son inválidas', async () => {
    const response = await request(app)
      .post('/accounts/recover-password')
      .send({
        email: 'mssalcedo2@espe.edu.e',
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      });

    expect(response.statusCode).toBe(404);
  });
});
//put http://localhost:3000/api/accounts/profile

const testUser = {
<<<<<<< HEAD
  username: "user_" + Date.now(),
  password: "Test1234!",
  email: `user${Date.now()}@example.com`,
  role: "lector",
  phone_number: "+593987654321",
};

beforeAll(async () => {
  await request(app).post("/accounts/create").send(testUser);
  const res = await request(app).post("/accounts/login").send({
=======
  username: 'user_' + Date.now(),
  password: 'Test1234!',
  email: `user${Date.now()}@example.com`,
  role: 'lector',
  phone_number: '+593987654321',
};

beforeAll(async () => {
  await request(app).post('/accounts/create').send(testUser);
  const res = await request(app).post('/accounts/login').send({
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    username: testUser.username,
    password: testUser.password,
  });
  res.body.token;
});

<<<<<<< HEAD
describe("PUT /accounts/profile", () => {
=======
describe('PUT /accounts/profile', () => {
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
  let token;

  beforeAll(async () => {
    // Primero, crea una cuenta para obtener un token válido
    const uniqueId = Date.now();
    const userData = {
      username: `user_${uniqueId}`,
<<<<<<< HEAD
      password: "testpassword123",
      email: `user${uniqueId}@example.com`,
      phone_number: "+593987654321",
      role: "lector",
    };

    await request(app).post("/accounts/create").send(userData);

    const loginRes = await request(app).post("/accounts/login").send({
=======
      password: 'testpassword123',
      email: `user${uniqueId}@example.com`,
      phone_number: '+593987654321',
      role: 'lector',
    };

    await request(app).post('/accounts/create').send(userData);

    const loginRes = await request(app).post('/accounts/login').send({
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
      username: userData.username,
      password: userData.password,
    });

    token = loginRes.body.token;
  });

<<<<<<< HEAD
  it("debe actualizar el perfil del usuario autenticado", async () => {
    const res = await request(app)
      .put("/accounts/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Soy abogada con experiencia en derecho civil.",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("account");
    expect(res.body).toHaveProperty("profile");
    expect(res.body.profile).toHaveProperty(
      "content",
      "Soy abogada con experiencia en derecho civil."
    );
  });

  it("debe rechazar si no hay token", async () => {
    const res = await request(app).put("/accounts/profile").send({
      content: "Actualización sin token",
=======
  it('debe actualizar el perfil del usuario autenticado', async () => {
    const res = await request(app)
      .put('/accounts/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Soy abogada con experiencia en derecho civil.',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('account');
    expect(res.body).toHaveProperty('profile');
    expect(res.body.profile).toHaveProperty(
      'content',
      'Soy abogada con experiencia en derecho civil.'
    );
  });

  it('debe rechazar si no hay token', async () => {
    const res = await request(app).put('/accounts/profile').send({
      content: 'Actualización sin token',
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
    });

    expect(res.statusCode).toBe(401);
  });
});
