const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/productCategoryController');
const { verifyToken, checkPermission } = require('../middleware/auth');

// 所有接口都需要token认证
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   - name: 产品分类管理
 *     description: 产品分类管理相关接口
 */

/**
 * @swagger
 * /api/product-categories:
 *   post:
 *     tags:
 *       - 产品分类管理
 *     summary: 新增产品分类
 *     description: 新增一个产品分类
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: 分类名称
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *                 default: 1
 *     responses:
 *       200:
 *         description: 分类创建成功
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
 *                   example: 分类创建成功
 *       500:
 *         description: 分类创建失败
 */
router.post('/', checkPermission('productCategory:add'), categoryCtrl.createCategory);

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     tags:
 *       - 产品分类管理
 *     summary: 获取产品分类列表
 *     description: 获取所有产品分类
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取分类列表
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
 *                       status:
 *                         type: integer
 *                       create_time:
 *                         type: string
 *                         format: date-time
 *                       update_time:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: 获取分类列表失败
 */
router.get('/', checkPermission('productCategory:list'), categoryCtrl.getCategoryList);

/**
 * @swagger
 * /api/product-categories/{categoryId}:
 *   get:
 *     tags:
 *       - 产品分类管理
 *     summary: 获取产品分类详情
 *     description: 根据ID获取产品分类详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 成功获取分类详情
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
 *                     category_id:
 *                       type: integer
 *                     category_name:
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
 *         description: 分类不存在
 *       500:
 *         description: 获取分类详情失败
 */
router.get('/:categoryId', checkPermission('productCategory:list'), categoryCtrl.getCategory);

/**
 * @swagger
 * /api/product-categories/{categoryId}:
 *   put:
 *     tags:
 *       - 产品分类管理
 *     summary: 修改产品分类
 *     description: 根据ID修改产品分类
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类更新成功
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
 *                   example: 分类更新成功
 *       400:
 *         description: 没有要更新的字段
 *       500:
 *         description: 分类更新失败
 */
router.put('/:categoryId', checkPermission('productCategory:edit'), categoryCtrl.updateCategory);

/**
 * @swagger
 * /api/product-categories/{categoryId}:
 *   delete:
 *     tags:
 *       - 产品分类管理
 *     summary: 删除产品分类
 *     description: 根据ID删除产品分类
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 分类删除成功
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
 *                   example: 分类删除成功
 *       500:
 *         description: 分类删除失败
 */
router.delete('/:categoryId', checkPermission('productCategory:delete'), categoryCtrl.deleteCategory);

module.exports = router;