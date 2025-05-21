const express = require('express');
const { testConnection } = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const app = express();
const port = 3000;

// 测试数据库连接
testConnection();

// 中间件设置
app.use(express.json()); // 用于解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 用于解析 URL 编码的请求体

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 提供 Swagger JSON 文件
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// 路由设置
app.use('/api/users', userRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Tennlytics API' });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  console.log(`Swagger JSON available at http://localhost:${port}/swagger.json`);
});