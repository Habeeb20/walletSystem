// utils/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet API',
      version: '1.0.0',
      description: 'API documentation for wallet, airtime, data, TV, electricity, and transfer services',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:8080',
        description: 'API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Something went wrong',
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Point this at every file containing @swagger JSDoc comments
  apis: [
    './controllers/*.js',
    './routes/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);