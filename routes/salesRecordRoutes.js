const express = require('express');
const router = express.Router();
const salesCtrl = require('../controllers/salesRecordController');

/**
 * @swagger
 * /api/sales-records:
 *   post:
 *     tags:
 *       - SalesRecord
 *     summary: 新增产品销售记录
 *     description: 用户与客户关联创建产品销售记录（支持一次创建多个产品的销售记录）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - products
 *               - sales_time
 *               - creator
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: 客户ID
 *               products:
 *                 type: array
 *                 description: 产品列表
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - product_sku
 *                     - quantity
 *                     - unit_price
 *                     - total_price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       description: 产品ID
 *                     product_sku:
 *                       type: string
 *                       description: 产品SKU
 *                     quantity:
 *                       type: integer
 *                       description: 销售件数
 *                     unit_price:
 *                       type: number
 *                       format: float
 *                       description: 销售单价
 *                     total_price:
 *                       type: number
 *                       format: float
 *                       description: 销售总价
 *                     remark:
 *                       type: string
 *                       description: 备注（可选）
 *               sales_time:
 *                 type: string
 *                 format: date-time
 *                 description: 销售时间
 *               creator:
 *                 type: integer
 *                 description: 创建者用户ID
 *     responses:
 *       200:
 *         description: 销售记录创建成功
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
 *                   example: 销售记录创建成功
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: 客户ID和产品信息不能为空
 *       500:
 *         description: 销售记录创建失败
 */
router.post('/', salesCtrl.createSalesRecord);

/**
 * @swagger
 * /api/sales-records/customer/{customerId}:
 *   get:
 *     tags:
 *       - SalesRecord
 *     summary: 获取单个客户的产品销售记录列表
 *     description: 查看指定客户的所有产品销售记录，支持分页查询
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 客户ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码，从1开始
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页记录数
 *     responses:
 *       200:
 *         description: 成功获取销售记录列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 customer_total_amount:
 *                   type: string
 *                   example: "1000.00"
 *                   description: 客户总销售金额
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sales_time:
 *                         type: string
 *                         format: date-time
 *                         description: 销售时间
 *                       creator:
 *                         type: integer
 *                         description: 创建者用户ID
 *                       creator_name:
 *                         type: string
 *                         description: 创建者姓名
 *                       create_time:
 *                         type: string
 *                         format: date-time
 *                         description: 创建时间
 *                       total_amount:
 *                         type: string
 *                         description: 订单总金额
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             record_id:
 *                               type: integer
 *                             customer_id:
 *                               type: integer
 *                             product_id:
 *                               type: integer
 *                             product_sku:
 *                               type: string
 *                             quantity:
 *                               type: integer
 *                             unit_price:
 *                               type: number
 *                               format: float
 *                             total_price:
 *                               type: number
 *                               format: float
 *                             sales_time:
 *                               type: string
 *                               format: date-time
 *                             creator:
 *                               type: integer
 *                             create_time:
 *                               type: string
 *                               format: date-time
 *                             update_time:
 *                               type: string
 *                               format: date-time
 *                             remark:
 *                               type: string
 *                               description: 备注
 *                             product_title:
 *                               type: string
 *                               description: 产品标题
 *                             product_type:
 *                               type: string
 *                               description: 产品类型
 *                             product_image:
 *                               type: string
 *                               description: 产品图片
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
 *                       description: 每页记录数
 *       500:
 *         description: 获取销售记录失败
 */
router.get('/customer/:customerId', salesCtrl.getCustomerSalesRecords);

module.exports = router;