const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '项目协同管理系统 API Documentation',
      version: '1.0.0',
      description: '项目协同管理系统 API 接口文档',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 