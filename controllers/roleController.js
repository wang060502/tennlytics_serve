const { query } = require('../db/db');
const { logOperation } = require('./operationLogController');

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: 创建角色
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleCode
 *               - roleName
 *             properties:
 *               roleCode:
 *                 type: string
 *                 description: 角色编码
 *               roleName:
 *                 type: string
 *                 description: 角色名称
 *               dataScope:
 *                 type: integer
 *                 description: 数据权限(1-本人 2-部门 3-全部)
 *               remark:
 *                 type: string
 *                 description: 备注
 */
async function createRole(req, res) {
    try {
        const { roleCode, roleName, dataScope = 3, remark } = req.body;

        if (!roleCode || !roleName) {
            return res.status(400).json({ code: 400, error: '角色编码和名称是必填项' });
        }

        // 检查角色编码是否已存在
        const existingRole = await query('SELECT * FROM sys_role WHERE role_code = ?', [roleCode]);
        if (existingRole.length > 0) {
            return res.status(409).json({ code: 409, error: '角色编码已存在' });
        }

        const result = await query(
            'INSERT INTO sys_role (role_code, role_name, data_scope, remark, create_time) VALUES (?, ?, ?, ?, NOW())',
            [roleCode, roleName, dataScope, remark]
        );

        res.status(201).json({ code: 200, message: '角色创建成功', roleId: result.insertId });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'createRole',
            method: req.method,
            params: JSON.stringify(req.body),
            ip: req.ip
        });
    } catch (error) {
        console.error('创建角色失败:', error);
        res.status(500).json({ code: 500, error: '创建角色失败' });
    }
}

/**
 * @swagger
 * /api/roles/{roleId}:
 *   put:
 *     summary: 更新角色
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *               dataScope:
 *                 type: integer
 *               remark:
 *                 type: string
 */
async function updateRole(req, res) {
    try {
        const { roleId } = req.params;
        const { roleName, dataScope, remark } = req.body;

        const result = await query(
            'UPDATE sys_role SET role_name = ?, data_scope = ?, remark = ?, update_time = NOW() WHERE role_id = ?',
            [roleName, dataScope, remark, roleId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '角色不存在' });
        }

        res.json({ code: 200, message: '角色更新成功' });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'updateRole',
            method: req.method,
            params: JSON.stringify({ roleId, ...req.body }),
            ip: req.ip
        });
    } catch (error) {
        console.error('更新角色失败:', error);
        res.status(500).json({ code: 500, error: '更新角色失败' });
    }
}

/**
 * @swagger
 * /api/roles/{roleId}:
 *   delete:
 *     summary: 删除角色
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 */
async function deleteRole(req, res) {
    try {
        const { roleId } = req.params;

        // 检查是否有用户关联此角色
        const userRoles = await query('SELECT * FROM sys_user_role WHERE role_id = ?', [roleId]);
        if (userRoles.length > 0) {
            return res.status(400).json({ code: 400, error: '该角色下存在用户，无法删除' });
        }

        const result = await query('DELETE FROM sys_role WHERE role_id = ?', [roleId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '角色不存在' });
        }

        res.json({ code: 200, message: '角色删除成功' });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'deleteRole',
            method: req.method,
            params: JSON.stringify({ roleId }),
            ip: req.ip
        });
    } catch (error) {
        console.error('删除角色失败:', error);
        res.status(500).json({ code: 500, error: '删除角色失败' });
    }
}

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: 获取角色列表
 *     tags: [Roles]
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
 *         name: roleName
 *         schema:
 *           type: string
 *         description: 角色名称
 *       - in: query
 *         name: roleCode
 *         schema:
 *           type: string
 *         description: 角色编码
 *       - in: query
 *         name: dataScope
 *         schema:
 *           type: integer
 *         description: 数据权限(1-本人 2-部门 3-全部)
 */
async function getRoleList(req, res) {
    try {
        const { page = 1, limit = 10, roleName, roleCode, dataScope } = req.query;
        // 确保 page 和 limit 是整数
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        let sql = 'SELECT * FROM sys_role WHERE 1=1';
        const params = [];

        if (roleName) {
            sql += ' AND role_name LIKE ?';
            params.push(`%${roleName}%`);
        }

        if (roleCode) {
            sql += ' AND role_code LIKE ?';
            params.push(`%${roleCode}%`);
        }

        if (dataScope !== undefined && dataScope !== '') {
            sql += ' AND data_scope = ?';
            params.push(parseInt(dataScope));
        }

        // 直接使用数字而不是参数占位符
        sql += ` LIMIT ${limitNum} OFFSET ${offset}`;

        const roles = await query(sql, params);
        
        // 计算总数的 SQL 也需要修改
        let countSql = 'SELECT COUNT(*) as count FROM sys_role WHERE 1=1';
        const countParams = [];

        if (roleName) {
            countSql += ' AND role_name LIKE ?';
            countParams.push(`%${roleName}%`);
        }

        if (roleCode) {
            countSql += ' AND role_code LIKE ?';
            countParams.push(`%${roleCode}%`);
        }

        if (dataScope !== undefined && dataScope !== '') {
            countSql += ' AND data_scope = ?';
            countParams.push(parseInt(dataScope));
        }

        const total = await query(countSql, countParams);

        res.json({
            code: 200,
            roles,
            pagination: {
                total: total[0].count,
                page: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        console.error('获取角色列表失败:', error);
        res.status(500).json({ code: 500, error: '获取角色列表失败' });
    }
}

/**
 * @swagger
 * /api/roles/{roleId}/menus:
 *   post:
 *     summary: 分配角色菜单权限
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 */
async function assignRoleMenus(req, res) {
    try {
        const { roleId } = req.params;
        const { menuIds } = req.body;

        // 获取连接池
        const pool = require('../db/db').pool;

        // 获取连接
        const connection = await pool.getConnection();
        
        try {
            // 开启事务
            await connection.beginTransaction();

            // 删除原有权限
            await connection.query('DELETE FROM sys_role_menu WHERE role_id = ?', [roleId]);

            // 添加新权限
            if (menuIds && menuIds.length > 0) {
                const values = menuIds.map(menuId => [roleId, menuId]);
                await connection.query('INSERT INTO sys_role_menu (role_id, menu_id) VALUES ?', [values]);
            }

            // 提交事务
            await connection.commit();
            res.json({ code: 200, message: '角色菜单权限分配成功' });
            // 记录操作日志
            await logOperation({
                req,
                operation: 'assignRoleMenus',
                method: req.method,
                params: JSON.stringify({ roleId, menuIds }),
                ip: req.ip
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
        console.error('分配角色菜单权限失败:', error);
        res.status(500).json({ code: 500, error: '分配角色菜单权限失败' });
    }
}

/**
 * @swagger
 * /api/roles/{roleId}/menus:
 *   get:
 *     summary: 获取角色已绑定的菜单列表
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 成功获取角色菜单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 menus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       menuId:
 *                         type: integer
 *                         description: 菜单ID
 *                       menuName:
 *                         type: string
 *                         description: 菜单名称
 *                       parentId:
 *                         type: integer
 *                         description: 父菜单ID
 *                       menuType:
 *                         type: integer
 *                         description: 菜单类型(1-目录 2-菜单 3-按钮)
 *                       path:
 *                         type: string
 *                         description: 路由路径
 *                       component:
 *                         type: string
 *                         description: 前端组件
 *                       perms:
 *                         type: string
 *                         description: 权限标识
 *                       icon:
 *                         type: string
 *                         description: 图标
 *                       sort:
 *                         type: integer
 *                         description: 排序
 *                       visible:
 *                         type: integer
 *                         description: 是否可见(0-隐藏 1-显示)
 */
async function getRoleMenus(req, res) {
    try {
        const { roleId } = req.params;

        // 查询角色已绑定的菜单
        const menus = await query(
            `SELECT m.* FROM sys_menu m
             INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
             WHERE rm.role_id = ?
             ORDER BY m.sort ASC`,
            [roleId]
        );

        // 构建树形结构
        const buildTree = (items, parentId = 0) => {
            const result = [];
            for (const item of items) {
                if (item.parent_id === parentId) {
                    const children = buildTree(items, item.menu_id);
                    if (children.length) {
                        item.children = children;
                    }
                    result.push(item);
                }
            }
            return result;
        };

        const menuTree = buildTree(menus);

        res.json({
            code: 200,
            menus: menuTree
        });
    } catch (error) {
        console.error('获取角色菜单列表失败:', error);
        res.status(500).json({ code: 500, error: '获取角色菜单列表失败' });
    }
}

module.exports = {
    createRole,
    updateRole,
    deleteRole,
    getRoleList,
    assignRoleMenus,
    getRoleMenus
}; 