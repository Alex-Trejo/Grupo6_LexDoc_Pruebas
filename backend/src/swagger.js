import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Definición básica de tu documentación OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LexDoc API',
      version: '1.0.0',
      description: 'Documentación de la API para gestión de casos legales',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  // Ruta a tus archivos que contienen las rutas y comentarios Swagger
   apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
