const mysql = require('mysql2/promise');

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'synergism_serve',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功！');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

// 执行 SQL 查询的通用函数
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('SQL 查询错误:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  testConnection
};