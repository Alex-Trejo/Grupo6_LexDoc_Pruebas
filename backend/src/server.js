// server.js
import app from "./app.js";

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running en http://localhost:" + (process.env.PORT || 3000));
});

export default server;
