const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission } = require('../middleware/auth');
const { getOperationLogs } = require('../controllers/operationLogController');

/**
 * @swagger
 * tags:
 *   - name: 操作日志管理
 *     description: 操作日志管理相关接口
 */

/**
 * @swagger
 * /api/operation-logs:
 *   get:
 *     tags:
 *       - 操作日志管理
 *     summary: 查询操作日志
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 操作人ID
 *       - in: query
 *         name: operation
 *         schema:
 *           type: string
 *         description: 操作类型
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       logId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       operation:
 *                         type: string
 *                       method:
 *                         type: string
 *                       params:
 *                         type: string
 *                       ip:
 *                         type: string
 *                       createTime:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get('/', verifyToken, checkPermission('operationLog:list'), getOperationLogs);

module.exports = router; 