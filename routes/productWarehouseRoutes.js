const express = require('express');
const router = express.Router();
const productWarehouseCtrl = require('../controllers/productWarehouseController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// 所有路由都需要 token 和权限校验
router.use(verifyToken);
/**
 * @swagger
 * tags:
 *   - name: 产品库存管理
 *     description: 产品-仓库库存管理相关接口
 */

/**
 * @swagger
 * /api/product-warehouses:
 *   get:
 *     tags:
 *       - 产品库存管理
 *     summary: 获取所有产品-仓库库存
 *     description: 获取所有产品在各仓库的库存信息，按产品分组，每个产品下包含所有仓库的库存列表
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
 *         name: product_name
 *         schema:
 *           type: string
 *         description: 产品名称（模糊搜索）
 *       - in: query
 *         name: product_sku
 *         schema:
 *           type: string
 *         description: 产品SKU（模糊搜索）
 *       - in: query
 *         name: warehouse_id
 *         schema:
 *           type: integer
 *         description: 仓库ID（精确匹配）
 *     responses:
 *       200:
 *         description: 成功获取库存列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         description: 产品ID
 *                       product_name:
 *                         type: string
 *                         description: 产品名称
 *                       product_sku:
 *                         type: string
 *                         description: 产品SKU
 *                       product_image:
 *                         type: string
 *                         description: 产品图片
 *                       product_type:
 *                         type: string
 *                         description: 产品类型
 *                       warehouses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             warehouse_id:
 *                               type: integer
 *                               description: 仓库ID
 *                             warehouse_name:
 *                               type: string
 *                               description: 仓库名称
 *                             stocks:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                     description: 关联ID
 *                                   product_size:
 *                                     type: string
 *                                     description: 产品尺码
 *                                   stock_quantity:
 *                                     type: integer
 *                                     description: 产品库存数量
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
 *       500:
 *         description: 获取库存失败
 */
router.get('/', checkPermission('inventory:list'), productWarehouseCtrl.getProductWarehouses);

/**
 * @swagger
 * /api/product-warehouses/{id}:
 *   get:
 *     tags:
 *       - 产品库存管理
 *     summary: 获取单条产品-仓库库存详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 库存记录ID
 *     responses:
 *       200:
 *         description: 成功获取库存详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 stock:
 *                   $ref: '#/components/schemas/ProductWarehouse'
 *       404:
 *         description: 库存记录不存在
 *       500:
 *         description: 获取库存详情失败
 */
router.get('/:id', checkPermission('inventory:list'), productWarehouseCtrl.getProductWarehouseById);

/**
 * @swagger
 * /api/product-warehouses:
 *   post:
 *     tags:
 *       - 产品库存管理
 *     summary: 新增产品-仓库库存记录（支持批量）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       description: 产品ID
 *                     product_size:
 *                       type: string
 *                       description: 产品尺码
 *                     stock_quantity:
 *                       type: integer
 *                       description: 产品库存数量
 *                     warehouse_id:
 *                       type: integer
 *                       description: 仓库ID
 *     responses:
 *       200:
 *         description: 库存记录批量创建成功
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
 *                   example: 库存记录批量创建成功
 *       500:
 *         description: 创建库存失败
 */
router.post('/', checkPermission('inventory:add'), productWarehouseCtrl.createProductWarehouse);

/**
 * @swagger
 * /api/product-warehouses/{id}:
 *   put:
 *     tags:
 *       - 产品库存管理
 *     summary: 更新产品-仓库库存记录（支持批量新增和更新）
 *     description: |
 *       批量更新一款产品下多个仓库的多个尺码库存，支持以下操作：
 *       1. 更新已有库存记录（需要提供 id）
 *       2. 新增库存记录（不需要提供 id）
 *       3. 删除不在更新列表中的库存记录
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 库存记录ID（仅用于路由，实际更新时以请求体中的 id 为准）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: 库存记录数组，可以包含需要更新和新增的记录
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 关联ID（更新时必填，新增时不需要）
 *                     product_id:
 *                       type: integer
 *                       description: 产品ID（必填，用于关联产品和删除不在更新列表中的库存记录）
 *                     product_size:
 *                       type: string
 *                       description: 产品尺码（必填）
 *                     warehouse_id:
 *                       type: integer
 *                       description: 仓库ID（必填）
 *                     stock_quantity:
 *                       type: integer
 *                       description: 产品库存数量（必填）
 *                   example:
 *                     - id: 1
 *                       product_id: 1
 *                       product_size: "M"
 *                       warehouse_id: 1
 *                       stock_quantity: 100
 *                     - product_id: 1
 *                       product_size: "L"
 *                       warehouse_id: 1
 *                       stock_quantity: 50
 *     responses:
 *       200:
 *         description: 库存记录批量更新成功
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
 *                   example: 库存记录批量更新成功
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
 *                   example: 请提供库存信息数组
 *       500:
 *         description: 更新库存失败
 */
router.put('/:id', checkPermission('inventory:update'), productWarehouseCtrl.updateProductWarehouse);

/**
 * @swagger
 * /api/product-warehouses/{product_id}:
 *   delete:
 *     tags:
 *       - 产品库存管理
 *     summary: 删除产品-仓库库存记录
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 库存记录删除成功
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
 *                   example: 库存记录删除成功
 *       500:
 *         description: 删除库存失败
 */
router.delete('/:product_id', checkPermission('inventory:delete'), productWarehouseCtrl.deleteProductWarehouse);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductWarehouse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 关联ID
 *         product_id:
 *           type: integer
 *           description: 产品ID
 *         product_size:
 *           type: string
 *           description: 产品尺码
 *         stock_quantity:
 *           type: integer
 *           description: 产品库存数量
 *         warehouse_id:
 *           type: integer
 *           description: 仓库ID
 */

module.exports = router;