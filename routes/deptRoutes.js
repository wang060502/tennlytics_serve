const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const {
    createDept,
    updateDept,
    deleteDept,
    getDeptTree
} = require('../controllers/deptController');

/**
 * @swagger
 * tags:
 *   - name: 部门管理
 *     description: 部门管理相关接口
 */

/**
 * @swagger
 * /api/depts:
 *   post:
 *     tags:
 *       - 部门管理
 *     summary: 创建部门
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deptName
 *             properties:
 *               parentId:
 *                 type: integer
 *                 description: 父部门ID
 *               deptName:
 *                 type: string
 *                 description: 部门名称
 *               orderNum:
 *                 type: integer
 *                 description: 排序
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *     responses:
 *       201:
 *         description: 部门创建成功
 *       400:
 *         description: 参数错误
 */
router.post('/', verifyToken, checkPermission('dept:add'), createDept);

/**
 * @swagger
 * /api/depts/{deptId}:
 *   put:
 *     tags:
 *       - 部门管理
 *     summary: 更新部门
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deptId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 部门ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: integer
 *                 description: 父部门ID
 *               deptName:
 *                 type: string
 *                 description: 部门名称
 *               orderNum:
 *                 type: integer
 *                 description: 排序
 *               status:
 *                 type: integer
 *                 description: 状态(0-禁用 1-启用)
 *     responses:
 *       200:
 *         description: 部门更新成功
 *       404:
 *         description: 部门不存在
 */
router.put('/:deptId', verifyToken, checkPermission('dept:edit'), updateDept);

/**
 * @swagger
 * /api/depts/{deptId}:
 *   delete:
 *     tags:
 *       - 部门管理
 *     summary: 删除部门
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deptId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 部门ID
 *     responses:
 *       200:
 *         description: 部门删除成功
 *       400:
 *         description: 存在子部门或用户，无法删除
 *       404:
 *         description: 部门不存在
 */
router.delete('/:deptId', verifyToken, checkPermission('dept:delete'), deleteDept);

/**
 * @swagger
 * /api/depts:
 *   get:
 *     tags:
 *       - 部门管理
 *     summary: 获取部门树
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取部门树
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 depts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deptId:
 *                         type: integer
 *                       parentId:
 *                         type: integer
 *                       deptName:
 *                         type: string
 *                       orderNum:
 *                         type: integer
 *                       status:
 *                         type: integer
 *                       children:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Dept'
 */
router.get('/', verifyToken, checkPermission('dept:list'), getDeptTree);

module.exports = router; 