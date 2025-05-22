const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const {
    createRole,
    updateRole,
    deleteRole,
    getRoleList,
    assignRoleMenus
} = require('../controllers/roleController');

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags:
 *       - Roles
 *     summary: 创建角色
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
 *     responses:
 *       201:
 *         description: 角色创建成功
 *       400:
 *         description: 参数错误
 */
router.post('/', verifyToken, checkPermission('role:add'), createRole);

/**
 * @swagger
 * /api/roles/{roleId}:
 *   put:
 *     tags:
 *       - Roles
 *     summary: 更新角色
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
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: 角色名称
 *               dataScope:
 *                 type: integer
 *                 description: 数据权限(1-本人 2-部门 3-全部)
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       200:
 *         description: 角色更新成功
 *       404:
 *         description: 角色不存在
 */
router.put('/:roleId', verifyToken, checkPermission('role:edit'), updateRole);

/**
 * @swagger
 * /api/roles/{roleId}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: 删除角色
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
 *         description: 角色删除成功
 *       400:
 *         description: 该角色下存在用户，无法删除
 *       404:
 *         description: 角色不存在
 */
router.delete('/:roleId', verifyToken, checkPermission('role:delete'), deleteRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: 获取角色列表
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
 *     responses:
 *       200:
 *         description: 成功获取角色列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleId:
 *                         type: integer
 *                       roleCode:
 *                         type: string
 *                       roleName:
 *                         type: string
 *                       dataScope:
 *                         type: integer
 *                       remark:
 *                         type: string
 *                       createTime:
 *                         type: string
 *                         format: date-time
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
router.get('/', verifyToken, checkPermission('role:list'), getRoleList);

/**
 * @swagger
 * /api/roles/{roleId}/menus:
 *   post:
 *     tags:
 *       - Roles
 *     summary: 分配角色菜单权限
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
 *               - menuIds
 *             properties:
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 菜单ID列表
 *     responses:
 *       200:
 *         description: 角色菜单权限分配成功
 *       401:
 *         description: 未授权
 */
router.post('/:roleId/menus', verifyToken, checkPermission('role:assign'), assignRoleMenus);

module.exports = router; 