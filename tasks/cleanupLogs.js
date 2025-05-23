const cron = require('node-cron');
const { query } = require('../db/db');

/**
 * 清理一周前的操作日志
 */
async function cleanupOperationLogs() {
    try {
        // 删除一周前的日志
        const result = await query(
            'DELETE FROM sys_operation_log WHERE create_time < DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        console.log(`清理操作日志完成，共删除 ${result.affectedRows} 条记录`);
    } catch (error) {
        console.error('清理操作日志失败:', error);
    }
}

// 每天凌晨 2 点执行清理任务
cron.schedule('0 2 * * *', () => {
    console.log('开始执行操作日志清理任务...');
    cleanupOperationLogs();
});

module.exports = {
    cleanupOperationLogs
}; 