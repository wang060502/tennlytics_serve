const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'Tennlytics API Documentation',
      version: '1.0.0',
      description: 'Tennlytics API 接口文档',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 