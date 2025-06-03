const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const accountPasswordController = require('../controllers/accountPasswordController');

// 所有路由都需要认证
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: 账号密码管理
 *   description: 账号密码的增删改查接口
 */

/**
 * @swagger
 * /api/account-passwords:
 *   post:
 *     tags:
 *       - 账号密码管理
 *     summary: 创建账号密码
 *     description: 创建一个新的账号密码记录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_name:
 *                 type: string
 *                 description: 账号名称（可选）
 *               password:
 *                 type: string
 *                 description: 密码（可选）
 *               url:
 *                 type: string
 *                 description: 相关URL
 *               description:
 *                 type: string
 *                 description: 描述信息
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 创建成功
 *                 id:
 *                   type: number
 *                   description: 新创建的记录ID
 *       400:
 *         description: 账号名已存在
 *       500:
 *         description: 服务器错误
 */
router.post('/', checkPermission('account_password:create'), accountPasswordController.createAccountPassword);

/**
 * @swagger
 * /api/account-passwords:
 *   get:
 *     tags:
 *       - 账号密码管理
 *     summary: 获取账号密码列表
 *     description: 获取当前用户有权限查看的所有账号密码记录
 *     responses:
 *       200:
 *         description: 成功获取列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       account_name:
 *                         type: string
 *                       password:
 *                         type: string
 *                       url:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_by:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: 服务器错误
 */
router.get('/', checkPermission('account_password:list'), accountPasswordController.getAccountPasswords);

/**
 * @swagger
 * /api/account-passwords/{id}:
 *   get:
 *     tags:
 *       - 账号密码管理
 *     summary: 获取单个账号密码
 *     description: 根据ID获取单个账号密码的详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 账号密码记录ID
 *     responses:
 *       200:
 *         description: 成功获取详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     account_name:
 *                       type: string
 *                     password:
 *                       type: string
 *                     url:
 *                       type: string
 *                     description:
 *                       type: string
 *                     created_by:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: 无权限查看
 *       404:
 *         description: 账号不存在
 *       500:
 *         description: 服务器错误
 */
router.get('/:id', checkPermission('account_password:view'), accountPasswordController.getAccountPassword);

/**
 * @swagger
 * /api/account-passwords/{id}:
 *   put:
 *     tags:
 *       - 账号密码管理
 *     summary: 更新账号密码
 *     description: 更新指定ID的账号密码信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 账号密码记录ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_name:
 *                 type: string
 *                 description: 账号名称（可选）
 *               password:
 *                 type: string
 *                 description: 密码（可选）
 *               url:
 *                 type: string
 *                 description: 相关URL
 *               description:
 *                 type: string
 *                 description: 描述信息
 *     responses:
 *       200:
 *         description: 更新成功
 *       403:
 *         description: 无权限编辑
 *       404:
 *         description: 账号不存在
 *       500:
 *         description: 服务器错误
 */
router.put('/:id', checkPermission('account_password:edit'), accountPasswordController.updateAccountPassword);

/**
 * @swagger
 * /api/account-passwords/{id}:
 *   delete:
 *     tags:
 *       - 账号密码管理
 *     summary: 删除账号密码
 *     description: 删除指定ID的账号密码记录
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 账号密码记录ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       403:
 *         description: 无权限删除
 *       404:
 *         description: 账号不存在
 *       500:
 *         description: 服务器错误
 */
router.delete('/:id', checkPermission('account_password:delete'), accountPasswordController.deleteAccountPassword);

module.exports = router; 