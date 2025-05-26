const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const {
    createRole,
    updateRole,
    deleteRole,
    getRoleList,
    assignRoleMenus,
    getRoleMenus
} = require('../controllers/roleController');
const { getUnassignedUsers, assignUserRoles } = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   - name: 角色管理
 *     description: 角色管理相关接口
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags:
 *       - 角色管理
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
 *       - 角色管理
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
 *       - 角色管理
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
 *       - 角色管理
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
 *       - in: query
 *         name: roleCode
 *         schema:
 *           type: string
 *         description: 角色编码
 *       - in: query
 *         name: dataScope
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *         description: 数据权限(1-本人 2-部门 3-全部)
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
 *                         description: 角色ID
 *                       roleCode:
 *                         type: string
 *                         description: 角色编码
 *                       roleName:
 *                         type: string
 *                         description: 角色名称
 *                       dataScope:
 *                         type: integer
 *                         enum: [1, 2, 3]
 *                         description: 数据权限(1-本人 2-部门 3-全部)
 *                       remark:
 *                         type: string
 *                         description: 备注
 *                       createTime:
 *                         type: string
 *                         format: date-time
 *                         description: 创建时间
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 总记录数
 *                     page:
 *                       type: integer
 *                       description: 当前页码
 *                     limit:
 *                       type: integer
 *                       description: 每页数量
 */
router.get('/', verifyToken, checkPermission('role:list'), getRoleList);

/**
 * @swagger
 * /api/roles/{roleId}/menus:
 *   post:
 *     tags:
 *       - 角色管理
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

/**
 * @swagger
 * /api/roles/{roleId}/menus:
 *   get:
 *     tags:
 *       - 角色管理
 *     summary: 获取角色已绑定的菜单列表
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
router.get('/:roleId/menus', verifyToken, checkPermission('role:list'), getRoleMenus);

/**
 * @swagger
 * /api/roles/unassigned-users:
 *   get:
 *     tags:
 *       - 角色管理
 *     summary: 获取未绑定任何角色的用户列表
 *     description: 获取系统中未绑定任何角色的用户列表
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
 *         description: 成功获取未绑定用户列表
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
 *                       deptName:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
// 获取未绑定任何角色的用户列表
router.get('/unassigned-users', verifyToken, checkPermission('user:list'), getUnassignedUsers);

/**
 * @swagger
 * /api/roles/{roleId}/users:
 *   post:
 *     tags:
 *       - 角色管理
 *     summary: 为角色批量分配用户
 *     description: 为指定角色批量分配用户
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 批量分配用户成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: integer
 *                     assignedUsers:
 *                       type: integer
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 角色不存在
 *       401:
 *         description: 未授权
 *       500:
 *         description: 服务器错误
 */
// 为角色批量分配用户
router.post('/:roleId/users', verifyToken, checkPermission('user:assign'), assignUserRoles);

module.exports = router; 