const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    getUserList,
    updateUserStatus,
    resetPassword,
    updateUser
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   - name: 用户管理
 *     description: 用户管理相关接口
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 用户注册
 *     description: 注册新用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
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
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *               remark:
 *                 type: string
 *                 description: 备注（可选）
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 用户名已被注册
 */
// 用户注册
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 用户登录
 *     description: 用户登录接口
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                   example: 登录成功
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     realName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     deptId:
 *                       type: integer
 *       401:
 *         description: 用户不存在或密码错误
 */
// 用户登录
router.post('/login', login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户信息
 *     description: 获取当前登录用户的信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 realName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 deptId:
 *                   type: integer
 *                 status:
 *                   type: integer
 *                 lastLoginTime:
 *                   type: string
 *                   format: date-time
 *                 createTime:
 *                   type: string
 *                   format: date-time
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleId:
 *                         type: integer
 *                       roleName:
 *                         type: string
 *                       roleCode:
 *                         type: string
 *       401:
 *         description: 未授权
 */
// 获取用户信息
router.get('/profile', verifyToken, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 更新用户信息
 *     description: 更新当前登录用户的信息
 *     security:
 *       - bearerAuth: []
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
 *               remark:
 *                 type: string
 *                 description: 备注（可选）
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未授权
 */
// 更新用户信息
router.put('/profile', verifyToken, updateProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取用户列表
 *     description: 获取用户列表，支持分页和条件查询
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
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *         description: 手机号
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态(0-禁用 1-启用)
 *       - in: query
 *         name: deptId
 *         schema:
 *           type: integer
 *         description: 部门ID
 *     responses:
 *       200:
 *         description: 成功获取用户列表
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
 *                       email:
 *                         type: string
 *                       mobile:
 *                         type: string
 *                       deptId:
 *                         type: integer
 *                       status:
 *                         type: integer
 *                       lastLoginTime:
 *                         type: string
 *                         format: date-time
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
 *       401:
 *         description: 未授权
 */
// 获取用户列表
router.get('/', verifyToken, checkPermission('user:list'), getUserList);

/**
 * @swagger
 * /api/users/{userId}/status:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 修改用户状态
 *     description: 修改用户状态（启用/禁用）
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *     responses:
 *       200:
 *         description: 状态更新成功
 *       401:
 *         description: 未授权
 */
// 修改用户状态
router.put('/:userId/status', verifyToken, checkPermission('user:edit'), updateUserStatus);

/**
 * @swagger
 * /api/users/{userId}/password:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 重置用户密码
 *     description: 重置指定用户的密码
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
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: 新密码
 *     responses:
 *       200:
 *         description: 密码重置成功
 *       401:
 *         description: 未授权
 */
// 重置用户密码
router.put('/:userId/password', verifyToken, checkPermission('user:edit'), resetPassword);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 更新用户信息（管理员）
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
router.put('/:userId', verifyToken, checkPermission('user:edit'), updateUser);

module.exports = router; 