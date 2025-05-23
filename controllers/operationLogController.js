const { query } = require('../db/db');

/**
 * 记录操作日志
 * @param {Object} options
 * @param {Object} options.req - Express 的 req 对象，必须包含 req.user.userId
 * @param {string} options.operation - 操作类型
 * @param {string} options.method - 请求方法
 * @param {string} options.params - 请求参数
 * @param {string} options.ip - IP地址
 */
async function logOperation({ req, operation, method, params, ip }) {
    try {
        const userId = req.user && req.user.userId;
        await query(
            'INSERT INTO sys_operation_log (user_id, operation, method, params, ip, create_time) VALUES (?, ?, ?, ?, ?, NOW())',
            [userId, operation, method, params, ip]
        );
    } catch (error) {
        console.error('记录操作日志失败:', error);
    }
}

/**
 * 分页查询操作日志
 */
async function getOperationLogs(req, res) {
    try {
        // 直接从token获取userId
        const userId = req.user && req.user.userId;
        const { operation } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM sys_operation_log WHERE 1=1';
        const params = [];
        if (userId) {
            sql += ' AND user_id = ?';
            params.push(userId);
        }
        if (operation) {
            sql += ' AND operation = ?';
            params.push(operation);
        }
        sql += ` ORDER BY create_time DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

        const logs = await query(sql, params);

        // 查询所有涉及到的用户ID的用户名
        const userIds = Array.from(new Set(logs.map(log => log.user_id))).filter(Boolean);
        let userMap = {};
        if (userIds.length > 0) {
            const userRows = await query(
                `SELECT user_id, username FROM sys_user WHERE user_id IN (${userIds.map(() => '?').join(',')})`,
                userIds
            );
            userMap = userRows.reduce((acc, cur) => {
                acc[cur.user_id] = cur.username;
                return acc;
            }, {});
        }

        // 构建中文描述
        const logsDesc = logs.map(log => {
            const username = userMap[log.user_id] || `ID:${log.user_id}`;
            // 格式化时间
            const time = new Date(log.create_time).toLocaleString('zh-CN', { hour12: false });
            return `操作人员【${username}】在【${time}】执行了【${log.operation}】操作。`;
        });

        // 统计总数
        let countSql = 'SELECT COUNT(*) as count FROM sys_operation_log WHERE 1=1';
        const countParams = [];
        if (userId) {
            countSql += ' AND user_id = ?';
            countParams.push(userId);
        }
        if (operation) {
            countSql += ' AND operation = ?';
            countParams.push(operation);
        }
        const total = await query(countSql, countParams);

        res.json({
            code: 200,
            logs,
            logsDesc,
            pagination: {
                total: total[0].count,
                page,
                limit
            }
        });
    } catch (error) {
        console.error('查询操作日志失败:', error);
        res.status(500).json({ code: 500, error: '查询操作日志失败' });
    }
}

module.exports = {
    logOperation,
    getOperationLogs
}; 