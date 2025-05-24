const { query, pool } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logOperation } = require('./operationLogController');

// 用户注册
async function register(req, res) {
    try {
        const { username, password, realName, avatar, email, mobile, deptId, status = 1, remark } = req.body;

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
            status,
            remark || null
        ];

        // 插入新用户
        const result = await query(
            'INSERT INTO sys_user (username, password, real_name, avatar, email, mobile, dept_id, status, remark, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            params
        );

        res.status(201).json({ code: 200, message: '注册成功', userId: result.insertId });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'register',
            method: req.method,
            params: JSON.stringify(req.body),
            ip: req.ip
        });
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
        // 记录操作日志
        await logOperation({
            req,
            operation: 'login',
            method: req.method,
            params: JSON.stringify(req.body),
            ip: req.ip
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
            `SELECT 
                u.user_id, 
                u.username, 
                u.real_name, 
                u.avatar, 
                u.email, 
                u.mobile, 
                u.dept_id, 
                u.status, 
                u.last_login_time, 
                u.create_time,
                d.dept_name
            FROM sys_user u
            LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
            WHERE u.user_id = ?`,
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
        // 记录操作日志
        await logOperation({
            req,
            operation: 'updateProfile',
            method: req.method,
            params: JSON.stringify(req.body),
            ip: req.ip
        });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({ code: 500, error: '更新用户信息失败' });
    }
}

// 获取用户列表
async function getUserList(req, res) {
    try {
        const { page = 1, limit = 10, username, realName, mobile, status, deptId } = req.query;
        // 确保 page 和 limit 是整数
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        // 首先获取用户基本信息
        let sql = `
            SELECT 
                u.user_id, 
                u.username, 
                u.real_name, 
                u.avatar, 
                u.email, 
                u.mobile, 
                u.dept_id, 
                u.status, 
                u.last_login_time, 
                u.create_time,
                u.remark,
                d.dept_name
            FROM sys_user u
            LEFT JOIN sys_dept d ON u.dept_id = d.dept_id
            WHERE 1=1`;
        const params = [];

        if (username) {
            sql += ' AND u.username LIKE ?';
            params.push(`%${username}%`);
        }
        if (realName) {
            sql += ' AND u.real_name LIKE ?';
            params.push(`%${realName}%`);
        }
        if (mobile) {
            sql += ' AND u.mobile LIKE ?';
            params.push(`%${mobile}%`);
        }
        if (status !== undefined) {
            sql += ' AND u.status = ?';
            params.push(status);
        }
        if (deptId) {
            sql += ' AND u.dept_id = ?';
            params.push(deptId);
        }

        // 直接使用数字而不是参数占位符
        sql += ` LIMIT ${limitNum} OFFSET ${offset}`;

        const users = await query(sql, params);
        
        // 获取所有用户的角色信息
        if (users.length > 0) {
            const userIds = users.map(user => user.user_id);
            
            const rolesSql = `
                SELECT 
                    ur.user_id,
                    r.role_id,
                    r.role_code,
                    r.role_name,
                    r.data_scope,
                    r.remark,
                    r.create_time,
                    r.update_time
                FROM sys_user_role ur
                INNER JOIN sys_role r ON ur.role_id = r.role_id
                WHERE ur.user_id IN (${userIds.map(() => '?').join(',')})
            `;
            const userRoles = await query(rolesSql, userIds);

            // 将角色信息添加到用户数据中
            users.forEach(user => {
                const userRolesList = userRoles.filter(role => role.user_id === user.user_id)
                    .map(({ user_id, ...role }) => role); // 移除 user_id 字段
                user.roles = userRolesList;
            });
        }
        
        // 计算总数的 SQL
        let countSql = 'SELECT COUNT(*) as count FROM sys_user u WHERE 1=1';
        const countParams = [];

        if (username) {
            countSql += ' AND u.username LIKE ?';
            countParams.push(`%${username}%`);
        }

        if (realName) {
            countSql += ' AND u.real_name LIKE ?';
            countParams.push(`%${realName}%`);
        }

        if (mobile) {
            countSql += ' AND u.mobile LIKE ?';
            countParams.push(`%${mobile}%`);
        }

        if (status !== undefined) {
            countSql += ' AND u.status = ?';
            countParams.push(status);
        }

        if (deptId) {
            countSql += ' AND u.dept_id = ?';
            countParams.push(deptId);
        }

        const total = await query(countSql, countParams);

        res.json({
            code: 200,
            users,
            pagination: {
                total: total[0].count,
                page: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({ code: 500, error: '获取用户列表失败' });
    }
}

/**
 * @swagger
 * /api/roles/{roleId}/users:
 *   post:
 *     summary: 为角色批量分配用户
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 用户ID列表
 *     responses:
 *       200:
 *         description: 用户分配成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
async function assignUserRoles(req, res) {
    try {
        const { roleId } = req.params;
        const { userIds } = req.body;

        // 验证参数
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ code: 400, error: 'userIds 必须是数组' });
        }

        if (userIds.length === 0) {
            return res.status(400).json({ code: 400, error: 'userIds 不能为空' });
        }

        // 检查角色是否存在
        const role = await query('SELECT role_id FROM sys_role WHERE role_id = ?', [roleId]);
        if (role.length === 0) {
            return res.status(404).json({ code: 404, error: '角色不存在' });
        }

        // 获取数据库连接
        const connection = await pool.getConnection();

        try {
            // 开启事务
            await connection.beginTransaction();

            // 删除原有用户关联
            await connection.query(
                'DELETE FROM sys_user_role WHERE role_id = ? AND user_id IN (?)',
                [roleId, userIds]
            );

            // 构建批量插入数据
            const values = userIds.map(userId => [userId, roleId]);

            // 批量插入新的用户关联
            if (values.length > 0) {
                await connection.query(
                    'INSERT INTO sys_user_role (user_id, role_id) VALUES ?',
                    [values]
                );
            }

            // 提交事务
            await connection.commit();
            res.json({ 
                code: 200, 
                message: '批量分配用户成功',
                data: {
                    roleId: parseInt(roleId),
                    assignedUsers: userIds.length
                }
            });
        } catch (error) {
            // 回滚事务
            await connection.rollback();
            throw error;
        } finally {
            // 释放连接
            connection.release();
        }
    } catch (error) {
        console.error('批量分配用户失败:', error);
        res.status(500).json({ code: 500, error: '批量分配用户失败' });
    }
}

/**
 * @swagger
 * /api/roles/unassigned-users:
 *   get:
 *     summary: 获取未绑定任何角色的用户列表
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: 用户名
 *       - in: query
 *         name: realName
 *         schema:
 *           type: string
 *         description: 真实姓名
 *     responses:
 *       200:
 *         description: 成功获取未绑定角色的用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       realName:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       deptName:
 *                         type: string
 *                         description: 完整部门路径，如"一起发展贸易有限公司 / 技术部"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
async function getUnassignedUsers(req, res) {
    try {
        const { page = 1, limit = 10, username, realName } = req.query;

        // 确保 page 和 limit 是整数
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        // 构建查询条件
        let conditions = ['u.user_id NOT IN (SELECT DISTINCT user_id FROM sys_user_role)'];
        const params = [];

        if (username) {
            conditions.push('u.username LIKE ?');
            params.push(`%${username}%`);
        }
        if (realName) {
            conditions.push('u.real_name LIKE ?');
            params.push(`%${realName}%`);
        }

        // 查询未分配任何角色的用户，包括部门层级信息
        const sql = `
            WITH RECURSIVE dept_tree AS (
                SELECT 
                    dept_id,
                    parent_id,
                    dept_name,
                    CAST(dept_name AS CHAR(1000)) as dept_path
                FROM sys_dept
                WHERE parent_id = 0
                
                UNION ALL
                SELECT 
                    d.dept_id,
                    d.parent_id,
                    d.dept_name,
                    CONCAT(dt.dept_path, '/', d.dept_name) as dept_path
                FROM sys_dept d
                INNER JOIN dept_tree dt ON d.parent_id = dt.dept_id
            )
            SELECT 
                u.user_id,
                u.username,
                u.real_name,
                u.avatar,
                dt.dept_path as dept_name
            FROM sys_user u
            LEFT JOIN dept_tree dt ON u.dept_id = dt.dept_id
            WHERE ${conditions.join(' AND ')}
            LIMIT ${limitNum} OFFSET ${offset}
        `;

        const users = await query(sql, params);

        // 查询总数
        const countSql = `
            SELECT COUNT(*) as total
            FROM sys_user u
            WHERE ${conditions.join(' AND ')}
        `;
        const total = await query(countSql, params);

        res.json({
            code: 200,
            users,
            pagination: {
                total: total[0].total,
                page: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        console.error('获取未绑定用户列表失败:', error);
        res.status(500).json({ code: 500, error: '获取未绑定用户列表失败' });
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
        // 记录操作日志
        await logOperation({
            req,
            operation: 'updateUserStatus',
            method: req.method,
            params: JSON.stringify({ userId, status }),
            ip: req.ip
        });
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
        // 记录操作日志
        await logOperation({
            req,
            operation: 'resetPassword',
            method: req.method,
            params: JSON.stringify({ userId }),
            ip: req.ip
        });
    } catch (error) {
        console.error('重置密码失败:', error);
        res.status(500).json({ code: 500, error: '重置密码失败' });
    }
}

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 更新用户信息（管理员）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               realName:
 *                 type: string
 *                 description: 真实姓名
 *               avatar:
 *                 type: string
 *                 description: 头像URL
 *               email:
 *                 type: string
 *                 description: 邮箱
 *               mobile:
 *                 type: string
 *                 description: 手机号
 *               deptId:
 *                 type: integer
 *                 description: 部门ID
 *               roleId:
 *                 type: integer
 *                 description: 角色ID（可选，传递则会覆盖用户所有角色，只能分配一个）
 *               remark:
 *                 type: string
 *                 description: 备注（可选）
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 用户不存在
 */
async function updateUser(req, res) {
    try {
        const { userId } = req.params;
        const { realName, avatar, email, mobile, deptId, roleId, remark } = req.body;

        // 检查用户是否存在
        const existingUser = await query('SELECT * FROM sys_user WHERE user_id = ?', [userId]);
        if (existingUser.length === 0) {
            return res.status(404).json({ code: 404, error: '用户不存在' });
        }

        // 构建更新字段和参数
        const updateFields = [];
        const params = [];

        if (realName !== undefined) {
            updateFields.push('real_name = ?');
            params.push(realName);
        }
        if (avatar !== undefined) {
            updateFields.push('avatar = ?');
            params.push(avatar);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            params.push(email);
        }
        if (mobile !== undefined) {
            updateFields.push('mobile = ?');
            params.push(mobile);
        }
        if (deptId !== undefined) {
            updateFields.push('dept_id = ?');
            params.push(deptId);
        }
        if (remark !== undefined) {
            updateFields.push('remark = ?');
            params.push(remark);
        }

        // 如果没有要更新的字段且没有角色更新
        if (updateFields.length === 0 && roleId === undefined) {
            return res.status(400).json({ code: 400, error: '没有提供要更新的字段' });
        }

        // 获取数据库连接
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 更新用户基本信息
            if (updateFields.length > 0) {
                updateFields.push('update_time = NOW()');
                params.push(userId);
                await connection.query(
                    `UPDATE sys_user SET ${updateFields.join(', ')} WHERE user_id = ?`,
                    params
                );
            }

            // 更新用户角色
            if (roleId !== undefined) {
                // 删除原有角色
                await connection.query('DELETE FROM sys_user_role WHERE user_id = ?', [userId]);
                // 插入新角色
                await connection.query('INSERT INTO sys_user_role (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
            }

            await connection.commit();
            res.json({ code: 200, message: '用户信息更新成功' });
            // 记录操作日志
            await logOperation({
                req,
                operation: 'updateUser',
                method: req.method,
                params: JSON.stringify({ userId, ...req.body }),
                ip: req.ip
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({ code: 500, error: '更新用户信息失败' });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getUserList,
    assignUserRoles,
    getUnassignedUsers,
    updateUserStatus,
    resetPassword,
    updateUser
}; 