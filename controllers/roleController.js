const { query } = require('../db/db');

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
 */
async function getRoleList(req, res) {
    try {
        const { page = 1, limit = 10, roleName } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let sql = 'SELECT * FROM sys_role WHERE 1=1';
        const params = [];

        if (roleName) {
            sql += ' AND role_name LIKE ?';
            params.push(`%${roleName}%`);
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const roles = await query(sql, params);
        const total = await query('SELECT COUNT(*) as count FROM sys_role WHERE 1=1' + (roleName ? ' AND role_name LIKE ?' : ''), roleName ? [`%${roleName}%`] : []);

        res.json({
            code: 200,
            roles,
            pagination: {
                total: total[0].count,
                page: parseInt(page),
                limit: parseInt(limit)
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

        // 开启事务
        await query('START TRANSACTION');

        try {
            // 删除原有权限
            await query('DELETE FROM sys_role_menu WHERE role_id = ?', [roleId]);

            // 添加新权限
            if (menuIds && menuIds.length > 0) {
                const values = menuIds.map(menuId => [roleId, menuId]);
                await query('INSERT INTO sys_role_menu (role_id, menu_id) VALUES ?', [values]);
            }

            await query('COMMIT');
            res.json({ code: 200, message: '角色菜单权限分配成功' });
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('分配角色菜单权限失败:', error);
        res.status(500).json({ code: 500, error: '分配角色菜单权限失败' });
    }
}

module.exports = {
    createRole,
    updateRole,
    deleteRole,
    getRoleList,
    assignRoleMenus
}; 