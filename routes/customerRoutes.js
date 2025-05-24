const express = require('express');
const router = express.Router();
const customerCtrl = require('../controllers/customerController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// 所有路由都需要先验证 token
router.use(verifyToken);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     tags:
 *       - Customer
 *     summary: 新增客户
 *     description: 新增一条客户信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - customer_status
 *               - customer_level
 *               - payment_status
 *               - creator
 *             properties:
 *               customer_name:
 *                 type: string
 *                 description: 客户名称
 *               customer_status:
 *                 type: string
 *                 description: 客户状态（潜在客户，成交客户，战略合作，无效客户）
 *               customer_level:
 *                 type: string
 *                 description: 客户级别（重要客户，一般客户）
 *               payment_status:
 *                 type: string
 *                 description: 付款状态（待付款，已付款部分，已结清）
 *               customer_source:
 *                 type: string
 *                 description: 客户来源
 *               customer_address:
 *                 type: string
 *                 description: 客户地址
 *               customer_detail:
 *                 type: string
 *                 description: 客户详情
 *               deal_price:
 *                 type: number
 *                 format: float
 *                 description: 客户成交价
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *               creator:
 *                 type: integer
 *                 description: 创建者用户ID
 *     responses:
 *       200:
 *         description: 客户创建成功
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
 *                   example: 客户创建成功
 *       500:
 *         description: 客户创建失败
 */
router.post('/', checkPermission('customer:add'), customerCtrl.createCustomer);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags:
 *       - Customer
 *     summary: 获取客户列表
 *     description: 查询客户信息，支持分页和条件查询
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: customer_name
 *         schema:
 *           type: string
 *         description: 客户名称（模糊查询）
 *       - in: query
 *         name: customer_status
 *         schema:
 *           type: string
 *         description: 客户状态（潜在客户，成交客户，战略合作，无效客户）
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *         description: 付款状态（待付款，已付款部分，已结清）
 *       - in: query
 *         name: creator_id
 *         schema:
 *           type: integer
 *         description: 创建者ID
 *     responses:
 *       200:
 *         description: 成功获取客户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customer_id:
 *                             type: integer
 *                           customer_name:
 *                             type: string
 *                           customer_status:
 *                             type: string
 *                           customer_level:
 *                             type: string
 *                           payment_status:
 *                             type: string
 *                           customer_source:
 *                             type: string
 *                           customer_address:
 *                             type: string
 *                           customer_detail:
 *                             type: string
 *                           deal_price:
 *                             type: number
 *                             format: float
 *                           status:
 *                             type: integer
 *                           creator:
 *                             type: integer
 *                           creator_name:
 *                             type: string
 *                             description: 创建者用户名
 *                           create_time:
 *                             type: string
 *                             format: date-time
 *                           update_time:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: 总记录数
 *                         page:
 *                           type: integer
 *                           description: 当前页码
 *                         limit:
 *                           type: integer
 *                           description: 每页数量
 *                         pages:
 *                           type: integer
 *                           description: 总页数
 *       500:
 *         description: 获取客户列表失败
 */
router.get('/', checkPermission('customer:list'), customerCtrl.getCustomerList);


/**
 * @swagger
 * /api/customers/creators:
 *   get:
 *     tags:
 *       - Customer
 *     summary: 获取客户创建者列表
 *     description: 获取所有创建过客户的用户列表
 *     responses:
 *       200:
 *         description: 成功获取创建者列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: 用户ID
 *                       username:
 *                         type: string
 *                         description: 用户名
 *       500:
 *         description: 获取创建者列表失败
 */
router.get('/creators', verifyToken, checkPermission('customer:list'), customerCtrl.getCustomerCreators);


/**
 * @swagger
 * /api/customers/{customerId}:
 *   get:
 *     tags:
 *       - Customer
 *     summary: 获取客户详情
 *     description: 根据客户ID获取客户详情
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 客户ID
 *     responses:
 *       200:
 *         description: 成功获取客户详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 customer:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: integer
 *                     customer_name:
 *                       type: string
 *                     customer_status:
 *                       type: string
 *                     customer_level:
 *                       type: string
 *                     payment_status:
 *                       type: string
 *                     customer_source:
 *                       type: string
 *                     customer_address:
 *                       type: string
 *                     customer_detail:
 *                       type: string
 *                     deal_price:
 *                       type: number
 *                       format: float
 *                     status:
 *                       type: integer
 *                     creator:
 *                       type: integer
 *                     create_time:
 *                       type: string
 *                       format: date-time
 *                     update_time:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 客户不存在
 *       500:
 *         description: 获取客户详情失败
 */
router.get('/:customerId', checkPermission('customer:list'), customerCtrl.getCustomer);

/**
 * @swagger
 * /api/customers/{customerId}:
 *   put:
 *     tags:
 *       - Customer
 *     summary: 修改客户
 *     description: 根据客户ID修改客户信息
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 客户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_name:
 *                 type: string
 *               customer_status:
 *                 type: string
 *               customer_level:
 *                 type: string
 *               payment_status:
 *                 type: string
 *               customer_source:
 *                 type: string
 *               customer_address:
 *                 type: string
 *               customer_detail:
 *                 type: string
 *               deal_price:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 客户更新成功
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
 *                   example: 客户更新成功
 *       400:
 *         description: 没有要更新的字段
 *       500:
 *         description: 客户更新失败
 */
router.put('/:customerId', checkPermission('customer:edit'), customerCtrl.updateCustomer);

/**
 * @swagger
 * /api/customers/{customerId}:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: 删除客户
 *     description: 根据客户ID删除客户
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 客户ID
 *     responses:
 *       200:
 *         description: 客户删除成功
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
 *                   example: 客户删除成功
 *       500:
 *         description: 客户删除失败
 */
router.delete('/:customerId', checkPermission('customer:delete'), customerCtrl.deleteCustomer);

/**
 * @swagger
 * /api/customers/batch:
 *   delete:
 *     tags:
 *       - Customer
 *     summary: 批量删除客户
 *     description: 根据客户ID数组批量删除客户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerIds
 *             properties:
 *               customerIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 要删除的客户ID数组
 *     responses:
 *       200:
 *         description: 批量删除客户成功
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
 *                   example: 批量删除客户成功
 *       400:
 *         description: 请提供要删除的客户ID
 *       500:
 *         description: 批量删除客户失败
 */
router.delete('/batch', checkPermission('customer:delete'), customerCtrl.deleteCustomer);

module.exports = router;