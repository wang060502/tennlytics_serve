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
 *     description: 用户与客户关联创建产品销售记录（记录单个客户每次的产品销售记录）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - product_id
 *               - product_sku
 *               - quantity
 *               - unit_price
 *               - total_price
 *               - sales_time
 *               - creator
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 description: 客户ID
 *               product_id:
 *                 type: integer
 *                 description: 产品ID
 *               product_sku:
 *                 type: string
 *                 description: 产品SKU
 *               quantity:
 *                 type: integer
 *                 description: 销售件数
 *               unit_price:
 *                 type: number
 *                 format: float
 *                 description: 销售单价
 *               total_price:
 *                 type: number
 *                 format: float
 *                 description: 销售总价
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
 *     description: 查看指定客户的所有产品销售记录
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 客户ID
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
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       record_id:
 *                         type: integer
 *                       customer_id:
 *                         type: integer
 *                       product_id:
 *                         type: integer
 *                       product_sku:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       unit_price:
 *                         type: number
 *                         format: float
 *                       total_price:
 *                         type: number
 *                         format: float
 *                       sales_time:
 *                         type: string
 *                         format: date-time
 *                       creator:
 *                         type: integer
 *                       create_time:
 *                         type: string
 *                         format: date-time
 *                       update_time:
 *                         type: string
 *                         format: date-time
 *                       product_title:
 *                         type: string
 *                         description: 产品标题
 *                       product_type:
 *                         type: string
 *                         description: 产品类型
 *                       product_image:
 *                         type: string
 *                         description: 产品图片
 *       500:
 *         description: 获取销售记录失败
 */
router.get('/customer/:customerId', salesCtrl.getCustomerSalesRecords);

module.exports = router;