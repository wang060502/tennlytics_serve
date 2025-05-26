const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuList,
    getUserMenus
} = require('../controllers/menuController');

/**
 * @swagger
 * tags:
 *   - name: 菜单管理
 *     description: 菜单管理相关接口
 */

/**
 * @swagger
 * /api/menus:
 *   post:
 *     tags:
 *       - 菜单管理
 *     summary: 创建菜单
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
 *     responses:
 *       201:
 *         description: 菜单创建成功
 *       400:
 *         description: 参数错误
 */
router.post('/', verifyToken, checkPermission('menu:add'), createMenu);

/**
 * @swagger
 * /api/menus/{menuId}:
 *   put:
 *     tags:
 *       - 菜单管理
 *     summary: 更新菜单
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: 菜单更新成功
 *       404:
 *         description: 菜单不存在
 */
router.put('/:menuId', verifyToken, checkPermission('menu:edit'), updateMenu);

/**
 * @swagger
 * /api/menus/{menuId}:
 *   delete:
 *     tags:
 *       - 菜单管理
 *     summary: 删除菜单
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     responses:
 *       200:
 *         description: 菜单删除成功
 *       400:
 *         description: 存在子菜单或被角色使用，无法删除
 *       404:
 *         description: 菜单不存在
 */
router.delete('/:menuId', verifyToken, checkPermission('menu:delete'), deleteMenu);

/**
 * @swagger
 * /api/menus:
 *   get:
 *     tags:
 *       - 菜单管理
 *     summary: 获取菜单列表
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
 *     responses:
 *       200:
 *         description: 成功获取菜单列表
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
 *                       parentId:
 *                         type: integer
 *                       menuName:
 *                         type: string
 *                       menuType:
 *                         type: integer
 *                       path:
 *                         type: string
 *                       component:
 *                         type: string
 *                       perms:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       sort:
 *                         type: integer
 *                       visible:
 *                         type: integer
 *                       createTime:
 *                         type: string
 *                         format: date-time
 *                       children:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Menu'
 */
router.get('/', verifyToken, checkPermission('menu:list'), getMenuList);

/**
 * @swagger
 * /api/menus/user:
 *   get:
 *     tags:
 *       - 菜单管理
 *     summary: 获取当前用户的菜单权限
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户菜单权限
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
 *                       parentId:
 *                         type: integer
 *                       menuName:
 *                         type: string
 *                       menuType:
 *                         type: integer
 *                       path:
 *                         type: string
 *                       component:
 *                         type: string
 *                       perms:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       sort:
 *                         type: integer
 *                       visible:
 *                         type: integer
 *                       createTime:
 *                         type: string
 *                         format: date-time
 *                       children:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Menu'
 */
router.get('/user', verifyToken, getUserMenus);

module.exports = router; 