const { query } = require('../db/db');

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: 创建菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuName
 *               - menuType
 *             properties:
 *               parentId:
 *                 type: integer
 *                 description: 父菜单ID
 *               menuName:
 *                 type: string
 *                 description: 菜单名称
 *               menuType:
 *                 type: integer
 *                 description: 类型(1-目录 2-菜单 3-按钮)
 *               path:
 *                 type: string
 *                 description: 路由路径
 *               component:
 *                 type: string
 *                 description: 前端组件
 *               perms:
 *                 type: string
 *                 description: 权限标识
 *               icon:
 *                 type: string
 *                 description: 图标
 *               sort:
 *                 type: integer
 *                 description: 排序
 *               visible:
 *                 type: integer
 *                 description: 是否可见(0-隐藏 1-显示)
 */
async function createMenu(req, res) {
    try {
        const {
            parentId = 0,
            menuName,
            menuType,
            path,
            component,
            perms,
            icon,
            sort = 0,
            visible = 1
        } = req.body;

        if (!menuName || !menuType) {
            return res.status(400).json({ code: 400, error: '菜单名称和类型是必填项' });
        }

        const result = await query(
            'INSERT INTO sys_menu (parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [parentId, menuName, menuType, path, component, perms, icon, sort, visible]
        );

        res.status(201).json({ code: 200, message: '菜单创建成功', menuId: result.insertId });
    } catch (error) {
        console.error('创建菜单失败:', error);
        res.status(500).json({ code: 500, error: '创建菜单失败' });
    }
}

/**
 * @swagger
 * /api/menus/{menuId}:
 *   put:
 *     summary: 更新菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
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
 *               parentId:
 *                 type: integer
 *               menuName:
 *                 type: string
 *               menuType:
 *                 type: integer
 *               path:
 *                 type: string
 *               component:
 *                 type: string
 *               perms:
 *                 type: string
 *               icon:
 *                 type: string
 *               sort:
 *                 type: integer
 *               visible:
 *                 type: integer
 */
async function updateMenu(req, res) {
    try {
        const { menuId } = req.params;
        const {
            parentId,
            menuName,
            menuType,
            path,
            component,
            perms,
            icon,
            sort,
            visible
        } = req.body;

        const result = await query(
            'UPDATE sys_menu SET parent_id = ?, menu_name = ?, menu_type = ?, path = ?, component = ?, perms = ?, icon = ?, sort = ?, visible = ?, update_time = NOW() WHERE menu_id = ?',
            [parentId, menuName, menuType, path, component, perms, icon, sort, visible, menuId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '菜单不存在' });
        }

        res.json({ code: 200, message: '菜单更新成功' });
    } catch (error) {
        console.error('更新菜单失败:', error);
        res.status(500).json({ code: 500, error: '更新菜单失败' });
    }
}

/**
 * @swagger
 * /api/menus/{menuId}:
 *   delete:
 *     summary: 删除菜单
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 */
async function deleteMenu(req, res) {
    try {
        const { menuId } = req.params;

        // 检查是否有子菜单
        const childMenus = await query('SELECT * FROM sys_menu WHERE parent_id = ?', [menuId]);
        if (childMenus.length > 0) {
            return res.status(400).json({ code: 400, error: '存在子菜单，无法删除' });
        }

        // 检查是否有角色关联此菜单
        const roleMenus = await query('SELECT * FROM sys_role_menu WHERE menu_id = ?', [menuId]);
        if (roleMenus.length > 0) {
            return res.status(400).json({ code: 400, error: '菜单已被角色使用，无法删除' });
        }

        const result = await query('DELETE FROM sys_menu WHERE menu_id = ?', [menuId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '菜单不存在' });
        }

        res.json({ code: 200, message: '菜单删除成功' });
    } catch (error) {
        console.error('删除菜单失败:', error);
        res.status(500).json({ code: 500, error: '删除菜单失败' });
    }
}

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: 获取菜单列表
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: menuName
 *         schema:
 *           type: string
 *         description: 菜单名称
 *       - in: query
 *         name: visible
 *         schema:
 *           type: integer
 *         description: 是否可见(0-隐藏 1-显示)
 */
async function getMenuList(req, res) {
    try {
        const { menuName, visible } = req.query;
        
        let sql = `
            WITH RECURSIVE menu_tree AS (
                SELECT * FROM sys_menu 
                WHERE 1=1
                ${menuName ? 'AND menu_name LIKE ?' : ''}
                ${visible !== undefined && visible !== '' ? 'AND visible = ?' : ''}
                
                UNION ALL
                SELECT m.* FROM sys_menu m
                INNER JOIN menu_tree mt ON m.menu_id = mt.parent_id
            )
            SELECT DISTINCT * FROM menu_tree
            ORDER BY sort ASC
        `;
        
        const params = [];
        if (menuName) {
            const trimmedName = menuName.trim();
            if (trimmedName !== '') {
                params.push(`%${trimmedName}%`);
            }
        }
        if (visible !== undefined && visible !== '') {
            const visibleNum = Number(visible);
            if (!isNaN(visibleNum)) {
                params.push(visibleNum);
            }
        }
        const menus = await query(sql, params);

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

        res.json({ code: 200, menus: menuTree });
    } catch (error) {
        console.error('获取菜单列表失败:', error);
        res.status(500).json({ code: 500, error: '获取菜单列表失败' });
    }
}

/**
 * @swagger
 * /api/menus/user:
 *   get:
 *     summary: 获取当前用户的菜单权限
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 */
async function getUserMenus(req, res) {
    try {
        const userId = req.user.userId;

        // 查询用户角色
        const userRoles = await query(
            'SELECT r.role_id FROM sys_role r ' +
            'INNER JOIN sys_user_role ur ON r.role_id = ur.role_id ' +
            'WHERE ur.user_id = ?',
            [userId]
        );

        if (userRoles.length === 0) {
            return res.json({ code: 200, menus: [] });
        }

        const roleIds = userRoles.map(role => role.role_id);

        // 查询角色对应的菜单
        const menus = await query(
            'SELECT DISTINCT m.* FROM sys_menu m ' +
            'INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id ' +
            'WHERE rm.role_id IN (?) AND m.visible = 1 ' +
            'ORDER BY m.sort ASC',
            [roleIds]
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

        res.json({ code: 200, menus: menuTree });
    } catch (error) {
        console.error('获取用户菜单权限失败:', error);
        res.status(500).json({ code: 500, error: '获取用户菜单权限失败' });
    }
}

module.exports = {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuList,
    getUserMenus
}; 