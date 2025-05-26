const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { verifyToken, checkPermission } = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   - name: 产品管理
 *     description: 产品管理相关接口
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - 产品管理
 *     summary: 新增产品
 *     description: 新增一条产品信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_title
 *               - product_type
 *               - product_sku
 *               - category_id
 *             properties:
 *               product_title:
 *                 type: string
 *                 description: 产品标题
 *               product_type:
 *                 type: string
 *                 description: 产品类型
 *               product_sku:
 *                 type: string
 *                 description: 产品SKU
 *               category_id:
 *                 type: integer
 *                 description: 产品分类ID
 *               type_code:
 *                 type: string
 *                 description: 类型编码
 *               product_image:
 *                 type: string
 *                 description: 产品图片
 *               product_detail:
 *                 type: string
 *                 description: 产品详情
 *               remark:
 *                 type: string
 *                 description: 备注
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *     responses:
 *       200:
 *         description: 产品创建成功
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
 *                   example: 产品创建成功
 *       500:
 *         description: 产品创建失败
 */
router.post('/', verifyToken, checkPermission('product:add'), productCtrl.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - 产品管理
 *     summary: 获取产品列表
 *     description: 查询产品信息，支持分页和条件查询
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
 *         description: 每页条数
 *       - in: query
 *         name: product_title
 *         schema:
 *           type: string
 *         description: 产品名称（模糊查询）
 *       - in: query
 *         name: product_sku
 *         schema:
 *           type: string
 *         description: 产品SKU（模糊查询）
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: 产品分类ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: 状态(0-禁用 1-启用)
 *     responses:
 *       200:
 *         description: 成功获取产品列表
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
 *                           product_id:
 *                             type: integer
 *                           product_title:
 *                             type: string
 *                           product_type:
 *                             type: string
 *                           product_sku:
 *                             type: string
 *                           type_code:
 *                             type: string
 *                           product_image:
 *                             type: string
 *                           product_detail:
 *                             type: string
 *                           remark:
 *                             type: string
 *                           status:
 *                             type: integer
 *                           category_id:
 *                             type: integer
 *                           category_name:
 *                             type: string
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
 *                           description: 每页条数
 *                         totalPages:
 *                           type: integer
 *                           description: 总页数
 *       500:
 *         description: 获取产品列表失败
 */
router.get('/', productCtrl.getProductList);

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - 产品管理
 *     summary: 获取产品详情
 *     description: 根据产品ID获取产品详情
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 成功获取产品详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 product:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     product_title:
 *                       type: string
 *                     product_type:
 *                       type: string
 *                     product_sku:
 *                       type: string
 *                     type_code:
 *                       type: string
 *                     product_image:
 *                       type: string
 *                     product_detail:
 *                       type: string
 *                     remark:
 *                       type: string
 *                     status:
 *                       type: integer
 *                     create_time:
 *                       type: string
 *                       format: date-time
 *                     update_time:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 产品不存在
 *       500:
 *         description: 获取产品详情失败
 */
router.get('/:productId', productCtrl.getProduct);

/**
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     tags:
 *       - 产品管理
 *     summary: 修改产品
 *     description: 根据产品ID修改产品信息
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_title:
 *                 type: string
 *               product_type:
 *                 type: string
 *               product_sku:
 *                 type: string
 *               category_id:
 *                 type: integer
 *                 description: 产品分类ID
 *               type_code:
 *                 type: string
 *               product_image:
 *                 type: string
 *               product_detail:
 *                 type: string
 *               remark:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 产品更新成功
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
 *                   example: 产品更新成功
 *       400:
 *         description: 没有要更新的字段
 *       500:
 *         description: 产品更新失败
 */
router.put('/:productId', verifyToken, checkPermission('product:edit'), productCtrl.updateProduct);

/**
 * @swagger
 * /api/products/{productId}:
 *   delete:
 *     tags:
 *       - 产品管理
 *     summary: 删除产品
 *     description: 根据产品ID删除产品
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 产品删除成功
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
 *                   example: 产品删除成功
 *       500:
 *         description: 产品删除失败
 */
router.delete('/:productId', verifyToken, checkPermission('product:delete'), productCtrl.deleteProduct);

/**
 * @swagger
 * /api/products/batch:
 *   delete:
 *     tags:
 *       - 产品管理
 *     summary: 批量删除产品
 *     description: 根据产品ID数组批量删除产品
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 产品ID数组
 *     responses:
 *       200:
 *         description: 批量删除产品成功
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
 *                   example: 批量删除产品成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 批量删除产品失败
 */
router.delete('/batch', verifyToken, checkPermission('product:delete'), productCtrl.deleteProduct);

/**
 * @swagger
 * /api/products/stats/category:
 *   get:
 *     tags:
 *       - 产品管理
 *     summary: 产品分类统计
 *     description: 统计各个分类下的产品数量
 *     responses:
 *       200:
 *         description: 统计成功
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
 *                       category_id:
 *                         type: integer
 *                       category_name:
 *                         type: string
 *                       product_count:
 *                         type: integer
 *       500:
 *         description: 统计失败
 */
router.get('/stats/category', verifyToken, checkPermission('product:view'), productCtrl.getProductCategoryStats);

module.exports = router;