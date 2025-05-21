const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: 用户注册
 *     description: 注册新用户
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 用户注册信息
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - phone_number
 *             - password
 *             - user_type
 *           properties:
 *             phone_number:
 *               type: string
 *               description: 手机号
 *             password:
 *               type: string
 *               description: 密码
 *             user_type:
 *               type: integer
 *               description: 用户类型（0-用户，1-教练，2-管理员）
 *             gender:
 *               type: integer
 *               description: 性别（0-男，1-女，2-其他）
 *             name:
 *               type: string
 *               description: 姓名
 *             age:
 *               type: integer
 *               description: 年龄
 *             avatar:
 *               type: string
 *               description: 头像URL
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 手机号已被注册
 */
// 用户注册
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: 用户登录
 *     description: 用户登录接口
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 登录信息
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - phone_number
 *             - password
 *           properties:
 *             phone_number:
 *               type: string
 *               description: 手机号
 *             password:
 *               type: string
 *               description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 phone_number:
 *                   type: string
 *                 user_type:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 avatar:
 *                   type: string
 *       401:
 *         description: 用户不存在或密码错误
 */
// 用户登录
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: 获取用户信息
 *     description: 获取当前登录用户的信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *       401:
 *         description: 未授权
 */
// 获取用户信息
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: 更新用户信息
 *     description: 更新当前登录用户的信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 用户信息
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             gender:
 *               type: integer
 *               description: 性别（0-男，1-女，2-其他）
 *             name:
 *               type: string
 *               description: 姓名
 *             age:
 *               type: integer
 *               description: 年龄
 *             avatar:
 *               type: string
 *               description: 头像URL
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未授权
 */
// 更新用户信息
router.put('/profile', authenticateToken, userController.updateProfile);

/**
 * @swagger
 * /api/users/list:
 *   get:
 *     tags:
 *       - Users
 *     summary: 获取用户列表
 *     description: 获取用户列表，支持分页和条件查询
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: 每页数量
 *       - in: query
 *         name: user_type
 *         type: integer
 *         description: 用户类型
 *       - in: query
 *         name: phone_number
 *         type: string
 *         description: 手机号
 *       - in: query
 *         name: gender
 *         type: integer
 *         description: 性别
 *       - in: query
 *         name: name
 *         type: string
 *         description: 姓名
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *       401:
 *         description: 未授权
 */
// 获取用户列表
router.get('/list', authenticateToken, userController.getUserList);

module.exports = router; 