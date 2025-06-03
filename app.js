const express = require('express');
const { testConnection } = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const menuRoutes = require('./routes/menuRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const deptRoutes = require('./routes/deptRoutes');
const operationLogRoutes = require('./routes/operationLogRoutes');
const accountPasswordRoutes = require('./routes/accountPasswordRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const path = require('path');
// const cors = require('cors');
const app = express();
const port = 3000;

// 测试数据库连接
testConnection();

// 中间件设置
// app.use(cors());
app.use(express.json()); // 用于解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 用于解析 URL 编码的请求体

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));            

// 提供 Swagger JSON 文件
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// 路由设置
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/files', uploadRoutes);
app.use('/api/depts', deptRoutes);
app.use('/api/operation-logs', operationLogRoutes);
app.use('/api/account-passwords', accountPasswordRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ERP API' });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, error: '服务器内部错误' });
});

// 初始化定时任务
require('./tasks/cleanupLogs');

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  console.log(`Swagger JSON available at http://localhost:${port}/swagger.json`);
});

module.exports = app;