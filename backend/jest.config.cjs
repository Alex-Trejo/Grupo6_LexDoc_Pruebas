// jest.config.cjs

/** @type {import('jest').Config} */
module.exports = {
  // Entorno de prueba para Node.js
  testEnvironment: 'node',

  // Carpeta donde se guardarán los reportes
  coverageDirectory: 'coverage',

  // Ignorar la carpeta node_modules del análisis. ¡Esto es importante!
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // ¡LA PARTE MÁS IMPORTANTE!
  // Aquí le decimos a Jest QUÉ archivos debe medir en su reporte.
  // Es una lista de "inclusión", no de "exclusión".
  collectCoverageFrom: [
    'src/**/*.js',      // Incluye todos los .js dentro de src...
    '!src/app.js',        // ...excepto app.js
    '!src/server.js',     // ...excepto server.js
    '!src/swagger.js',    // ...excepto swagger.js
    '!src/config/db.js',   // ...excepto la configuración de la BD.
    '!src/dtos/*.js',     // Excluye todos los archivos DTO
    '!src/entities/*.js' // Excluye todos los archivos de Entidades
  ],


  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
     './src/**/*.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    }
  },

};