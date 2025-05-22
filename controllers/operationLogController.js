const { query } = require('../db/db');

/**
 * 记录操作日志
 */
async function logOperation({ userId, operation, method, params, ip }) {
    try {
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
        const { userId, operation, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
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
        sql += ' ORDER BY create_time DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        const logs = await query(sql, params);
        const total = await query('SELECT COUNT(*) as count FROM sys_operation_log WHERE 1=1' + (userId ? ' AND user_id = ?' : '') + (operation ? ' AND operation = ?' : ''), [...(userId ? [userId] : []), ...(operation ? [operation] : [])]);
        res.json({
            code: 200,
            logs,
            pagination: {
                total: total[0].count,
                page: parseInt(page),
                limit: parseInt(limit)
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