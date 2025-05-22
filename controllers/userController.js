const { query } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
async function register(req, res) {
    try {
        const { username, password, realName, avatar, email, mobile, deptId, status = 1 } = req.body;

        // 检查必填字段
        if (!username || !password) {
            return res.status(400).json({ code: 400, error: '用户名和密码是必填项' });
        }

        // 检查用户名是否已存在
        const existingUser = await query('SELECT * FROM sys_user WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ code: 409, error: '用户名已被注册' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 将 undefined 转换为 null
        const params = [
            username,
            hashedPassword,
            realName || null,
            avatar || null,
            email || null,
            mobile || null,
            deptId || null,
            status
        ];

        // 插入新用户
        const result = await query(
            'INSERT INTO sys_user (username, password, real_name, avatar, email, mobile, dept_id, status, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            params
        );

        res.status(201).json({ code: 200, message: '注册成功', userId: result.insertId });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ code: 500, error: '注册失败' });
    }
}

// 用户登录
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // 检查必填字段
        if (!username || !password) {
            return res.status(400).json({ code: 400, error: '用户名和密码是必填项' });
        }

        // 查找用户
        const users = await query('SELECT * FROM sys_user WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ code: 401, error: '用户不存在或密码错误' });
        }

        const user = users[0];

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ code: 401, error: '用户不存在或密码错误' });
        }

        // 检查用户状态
        if (user.status !== 1) {
            return res.status(403).json({ code: 403, error: '用户已被禁用' });
        }

        // 更新最后登录时间
        await query('UPDATE sys_user SET last_login_time = NOW() WHERE user_id = ?', [user.user_id]);

        // 生成 JWT token
        const token = jwt.sign(
            { userId: user.user_id },
            'your_jwt_secret', // 请更改为安全的密钥
            { expiresIn: '24h' }
        );

        res.json({
            code: 200,
            message: '登录成功',
            token,
            user: {
                userId: user.user_id,
                username: user.username,
                realName: user.real_name,
                avatar: user.avatar,
                email: user.email,
                mobile: user.mobile,
                deptId: user.dept_id
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ code: 500, error: '登录失败' });
    }
}

// 获取用户信息
async function getProfile(req, res) {
    try {
        const userId = req.user.userId;

        const users = await query(
            'SELECT user_id, username, real_name, avatar, email, mobile, dept_id, status, last_login_time, create_time FROM sys_user WHERE user_id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' });
        }

        // 获取用户角色
        const roles = await query(
            'SELECT r.* FROM sys_role r ' +
            'INNER JOIN sys_user_role ur ON r.role_id = ur.role_id ' +
            'WHERE ur.user_id = ?',
            [userId]
        );

        res.json({ code: 200, ...users[0], roles });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ code: 500, error: '获取用户信息失败' });
    }
}

// 更新用户信息
async function updateProfile(req, res) {
    try {
        const userId = req.user.userId;
        const { realName, avatar, email, mobile, deptId } = req.body;

        const result = await query(
            'UPDATE sys_user SET real_name = ?, avatar = ?, email = ?, mobile = ?, dept_id = ?, update_time = NOW() WHERE user_id = ?',
            [realName, avatar, email, mobile, deptId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' });
        }

        res.json({ code: 200, message: '更新成功' });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({ code: 500, error: '更新用户信息失败' });
    }
}

// 获取用户列表
async function getUserList(req, res) {
    try {
        const { page = 1, limit = 10, username, realName, mobile, status, deptId } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let sql = 'SELECT user_id, username, real_name, avatar, email, mobile, dept_id, status, last_login_time, create_time FROM sys_user WHERE 1=1';
        const params = [];

        if (username) {
            sql += ' AND username LIKE ?';
            params.push(`%${username}%`);
        }
        if (realName) {
            sql += ' AND real_name LIKE ?';
            params.push(`%${realName}%`);
        }
        if (mobile) {
            sql += ' AND mobile LIKE ?';
            params.push(`%${mobile}%`);
        }
        if (status !== undefined) {
            sql += ' AND status = ?';
            params.push(status);
        }
        if (deptId) {
            sql += ' AND dept_id = ?';
            params.push(deptId);
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const users = await query(sql, params);
        const total = await query(
            'SELECT COUNT(*) as count FROM sys_user WHERE 1=1' +
            (username ? ' AND username LIKE ?' : '') +
            (realName ? ' AND real_name LIKE ?' : '') +
            (mobile ? ' AND mobile LIKE ?' : '') +
            (status !== undefined ? ' AND status = ?' : '') +
            (deptId ? ' AND dept_id = ?' : ''),
            [
                ...(username ? [`%${username}%`] : []),
                ...(realName ? [`%${realName}%`] : []),
                ...(mobile ? [`%${mobile}%`] : []),
                ...(status !== undefined ? [status] : []),
                ...(deptId ? [deptId] : [])
            ]
        );

        res.json({
            code: 200,
            users,
            pagination: {
                total: total[0].count,
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({ code: 500, error: '获取用户列表失败' });
    }
}

// 分配用户角色
async function assignUserRoles(req, res) {
    try {
        const { userId } = req.params;
        const { roleIds } = req.body;

        // 开启事务
        await query('START TRANSACTION');

        try {
            // 删除原有角色
            await query('DELETE FROM sys_user_role WHERE user_id = ?', [userId]);

            // 添加新角色
            if (roleIds && roleIds.length > 0) {
                const values = roleIds.map(roleId => [userId, roleId]);
                await query('INSERT INTO sys_user_role (user_id, role_id) VALUES ?', [values]);
            }

            await query('COMMIT');
            res.json({ code: 200, message: '用户角色分配成功' });
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('分配用户角色失败:', error);
        res.status(500).json({ code: 500, error: '分配用户角色失败' });
    }
}

// 修改用户状态
async function updateUserStatus(req, res) {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const result = await query(
            'UPDATE sys_user SET status = ?, update_time = NOW() WHERE user_id = ?',
            [status, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' });
        }

        res.json({ code: 200, message: '状态更新成功' });
    } catch (error) {
        console.error('更新用户状态失败:', error);
        res.status(500).json({ code: 500, error: '更新用户状态失败' });
    }
}

// 重置用户密码
async function resetPassword(req, res) {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ code: 400, error: '新密码是必填项' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'UPDATE sys_user SET password = ?, update_time = NOW() WHERE user_id = ?',
            [hashedPassword, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' });
        }

        res.json({ code: 200, message: '密码重置成功' });
    } catch (error) {
        console.error('重置密码失败:', error);
        res.status(500).json({ code: 500, error: '重置密码失败' });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getUserList,
    assignUserRoles,
    updateUserStatus,
    resetPassword
}; 