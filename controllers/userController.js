const { query } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
async function register(req, res) {
    try {
        const { phone_number, password, user_type, gender, name, age, avatar } = req.body;

        // 检查必填字段
        if (!phone_number || !password || user_type === undefined) {
            return res.status(400).json({ code: 400, error: '手机号、密码和用户类型是必填项' });
        }

        // 检查手机号是否已存在
        const existingUser = await query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
        if (existingUser.length > 0) {
            return res.status(409).json({ code: 409, error: '手机号已被注册' }); // Conflict
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 将 undefined 转换为 null，以便插入数据库
        const insertGender = gender === undefined ? null : gender;
        const insertName = name === undefined ? null : name;
        const insertAge = age === undefined ? null : age;
        const insertAvatar = avatar === undefined ? null : avatar;

        // 插入新用户
        const result = await query(
            'INSERT INTO users (phone_number, password, user_type, gender, name, age, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [phone_number, hashedPassword, user_type, insertGender, insertName, insertAge, insertAvatar]
        );

        res.status(201).json({ code: 200, message: '注册成功', userId: result.insertId });
    } catch (error) {
        console.error('注册失败:', error);
        // 对于未预料的数据库或其他服务器错误，返回 500 Internal Server Error
        res.status(500).json({ code: 500, error: '注册失败' });
    }
}

// 用户登录
async function login(req, res) {
    try {
        const { phone_number, password } = req.body;

        // 检查必填字段
        if (!phone_number || !password) {
            return res.status(400).json({ code: 400, error: '手机号和密码是必填项' });
        }

        // 查找用户
        const users = await query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
        if (users.length === 0) {
            return res.status(401).json({ code: 401, error: '用户不存在或密码错误' }); // Unauthorized
        }

        const user = users[0];

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ code: 401, error: '用户不存在或密码错误' }); // Unauthorized
        }

        // 生成 JWT token
        const token = jwt.sign(
            { userId: user.id, userType: user.user_type },
            'your_jwt_secret', // 请更改为安全的密钥
            { expiresIn: '24h' }
        );

        res.json({
            code: 200,
            message: '登录成功',
            token,
            user: {
                id: user.id,
                phone_number: user.phone_number,
                user_type: user.user_type,
                name: user.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        // 对于未预料的服务器错误，返回 500 Internal Server Error
        res.status(500).json({ code: 500, error: '登录失败' });
    }
}

// 获取用户信息
async function getProfile(req, res) {
    try {
        // 认证中间件会处理 401 和 403 错误
        const userId = req.user.userId; // 从 JWT 中获取

        const users = await query('SELECT id, phone_number, user_type, gender, name, age, avatar, created_at FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' }); // Not Found
        }

        res.json({ code: 200, ...users[0] });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        // 对于未预料的数据库或其他服务器错误，返回 500 Internal Server Error
        res.status(500).json({ code: 500, error: '获取用户信息失败' });
    }
}

// 更新用户信息
async function updateProfile(req, res) {
    try {
        // 认证中间件会处理 401 和 403 错误
        const userId = req.user.userId;
        const { gender, name, age, avatar } = req.body;
        // 这里不检查每个字段是否必填，允许部分更新

        // 将 undefined 转换为 null，以便更新数据库
        const updateGender = gender === undefined ? null : gender;
        const updateName = name === undefined ? null : name;
        const updateAge = age === undefined ? null : age;
        const updateAvatar = avatar === undefined ? null : avatar;


        const result = await query(
            'UPDATE users SET gender = ?, name = ?, age = ?, avatar = ? WHERE id = ?',
            [updateGender, updateName, updateAge, updateAvatar, userId]
        );

        if (result.affectedRows === 0) {
             // 如果 affectedRows 为 0，可能用户不存在或更新数据与原数据相同
             // 考虑到之前通过 JWT 认证，用户是存在的，更可能是更新数据相同，返回 200 即可
             // 如果需要区分，可以先查一次用户是否存在，这里为了简化，直接返回 200
        }

        res.json({ code: 200, message: '更新成功' });
    } catch (error) {
        console.error('更新用户信息失败:', error);
         // 对于未预料的数据库或其他服务器错误，返回 500 Internal Server Error
        res.status(500).json({ code: 500, error: '更新用户信息失败' });
    }
}

// 获取用户列表
async function getUserList(req, res) {
    try {
        // 认证中间件会处理 401 和 403 错误
        const { page = 1, limit = 10, user_type, phone_number, gender, name } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let sql = 'SELECT id, phone_number, user_type, gender, name, age, avatar, created_at FROM users WHERE 1=1';
        const params = [];

        // 添加查询条件
        if (user_type !== undefined) {
            sql += ' AND user_type = ?';
            params.push(user_type);
        }
        if (phone_number) {
            sql += ' AND phone_number LIKE ?';
            params.push(`%${phone_number}%`);
        }
        if (gender !== undefined) {
            sql += ' AND gender = ?';
            params.push(gender);
        }
        if (name) {
            sql += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }

        // 添加分页
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const users = await query(sql, params);
        // 为了获取总数，需要执行一个不带分页的查询
        let countSql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
         const countParams = [];

        // 添加查询条件到总数查询
        if (user_type !== undefined) {
            countSql += ' AND user_type = ?';
            countParams.push(user_type);
        }
        if (phone_number) {
            countSql += ' AND phone_number LIKE ?';
            countParams.push(`%${phone_number}%`);
        }
        if (gender !== undefined) {
            countSql += ' AND gender = ?';
            countParams.push(gender);
        }
        if (name) {
            countSql += ' AND name LIKE ?';
            countParams.push(`%${name}%`);
        }

        const totalResult = await query(countSql, countParams);
        const total = totalResult[0].count;

        res.json({
            code: 200,
            users,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        // 对于未预料的数据库或其他服务器错误，返回 500 Internal Server Error
        res.status(500).json({ code: 500, error: '获取用户列表失败' });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getUserList
}; 