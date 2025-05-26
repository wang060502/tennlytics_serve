const express = require('express');
const router = express.Router();
const warehouseCtrl = require('../controllers/warehouseController');
const { checkPermission } = require('../middleware/auth');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: 仓库管理
 *     description: 仓库管理相关接口
 */

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     tags:
 *       - 仓库管理
 *     summary: 获取所有仓库列表
 *     description: 获取所有仓库的基本信息，支持分页和条件查询
 *     parameters:
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
 *         description: 每页数量
 *       - in: query
 *         name: warehouse_name
 *         schema:
 *           type: string
 *         description: 仓库名称（模糊搜索）
 *       - in: query
 *         name: warehouse_type
 *         schema:
 *           type: integer
 *         description: 仓库类型（0本地仓、1海外仓、2边境仓、3平台仓）
 *       - in: query
 *         name: warehouse_status
 *         schema:
 *           type: integer
 *         description: 仓库状态（0=启用，1=禁用）
 *     responses:
 *       200:
 *         description: 成功获取仓库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 warehouses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warehouse'
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
 *         description: 获取仓库列表失败
 */
router.get('/', verifyToken, checkPermission('warehouse:list'), warehouseCtrl.getWarehouses);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     tags:
 *       - 仓库管理
 *     summary: 获取单个仓库详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 仓库ID
 *     responses:
 *       200:
 *         description: 成功获取仓库详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 warehouse:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: 仓库不存在
 *       500:
 *         description: 获取仓库详情失败
 */
router.get('/:id', verifyToken, checkPermission('warehouse:view'), warehouseCtrl.getWarehouseById);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     tags:
 *       - 仓库管理
 *     summary: 新增仓库
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: 仓库创建成功
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
 *                   example: 仓库创建成功
 *       500:
 *         description: 创建仓库失败
 */
router.post('/', verifyToken, checkPermission('warehouse:add'), warehouseCtrl.createWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     tags:
 *       - 仓库管理
 *     summary: 更新仓库
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 仓库ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: 仓库更新成功
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
 *                   example: 仓库更新成功
 *       500:
 *         description: 更新仓库失败
 */
router.put('/:id', verifyToken, checkPermission('warehouse:edit'), warehouseCtrl.updateWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     tags:
 *       - 仓库管理
 *     summary: 删除仓库
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 仓库ID
 *     responses:
 *       200:
 *         description: 仓库删除成功
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
 *                   example: 仓库删除成功
 *       500:
 *         description: 删除仓库失败
 */
router.delete('/:id', verifyToken, checkPermission('warehouse:delete'), warehouseCtrl.deleteWarehouse);

/**
 * @swagger
 * /api/warehouses:
 *   delete:
 *     tags:
 *       - 仓库管理
 *     summary: 批量删除仓库
 *     description: 批量删除指定ID的仓库
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 要删除的仓库ID数组
 *     responses:
 *       200:
 *         description: 批量删除成功
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
 *                   example: 批量删除成功
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 批量删除失败
 */
router.delete('/', verifyToken, checkPermission('warehouse:delete'), warehouseCtrl.batchDeleteWarehouse);

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         warehouse_id:
 *           type: integer
 *           description: 仓库ID
 *         warehouse_name:
 *           type: string
 *           description: 仓库名称
 *         warehouse_address:
 *           type: string
 *           description: 仓库地址
 *         warehouse_status:
 *           type: integer
 *           description: 仓库状态（0=启用，1=禁用）
 *         warehouse_type:
 *           type: integer
 *           description: 仓库类型（0本地仓、1海外仓、2边境仓、3平台仓）
 *         product_quantity:
 *           type: integer
 *           description: 仓库产品数量
 *         warehouse_manager:
 *           type: string
 *           description: 仓库主管
 *         contact_number:
 *           type: string
 *           description: 联系电话
 *         remark:
 *           type: string
 *           description: 备注
 */

module.exports = router;