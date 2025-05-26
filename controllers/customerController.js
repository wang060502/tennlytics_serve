const { query } = require('../db/db');

// 新增客户
exports.createCustomer = async (req, res) => {
    try {
        const { customer_name, customer_status, customer_level, payment_status, customer_source, customer_address, customer_detail, deal_price, status = 1, creator } = req.body;
        await query(
            `INSERT INTO customer (customer_name, customer_status, customer_level, payment_status, customer_source, customer_address, customer_detail, deal_price, status, creator, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [customer_name, customer_status, customer_level, payment_status, customer_source, customer_address, customer_detail, deal_price, status, creator]
        );
        res.json({ code: 200, message: '客户创建成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '客户创建失败', detail: error.message });
    }
};

// 客户列表
exports.getCustomerList = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            customer_name, 
            customer_status, 
            payment_status,
            creator_id,
            customer_level
        } = req.query;

        // 构建查询条件
        const conditions = [];
        const params = [];

        if (customer_name) {
            conditions.push('c.customer_name LIKE ?');
            params.push(`%${customer_name}%`);
        }
        if (customer_status) {
            conditions.push('c.customer_status = ?');
            params.push(customer_status);
        }
        if (customer_level) {
            conditions.push('c.customer_level = ?');
            params.push(customer_level);
        }
        if (payment_status) {
            conditions.push('c.payment_status = ?');
            params.push(payment_status);
        }
        if (creator_id) {
            conditions.push('c.creator = ?');
            params.push(creator_id);
        }

        // 计算分页
        const offset = Math.max(0, (Number(page) - 1) * Number(limit));
        const limitNum = Math.max(1, Number(limit));

        // 构建SQL查询 - 关联用户表获取创建者信息
        let sql = `
            SELECT c.*, u.username as creator_name 
            FROM customer c 
            LEFT JOIN sys_user u ON c.creator = u.user_id
        `;
        let countSql = 'SELECT COUNT(*) as total FROM customer c';

        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            sql += whereClause;
            countSql += whereClause;
        }

        // 添加排序和分页
        sql += ` ORDER BY c.create_time DESC LIMIT ${limitNum} OFFSET ${offset}`;

        // 执行查询
        const [customers, totalResult] = await Promise.all([
            query(sql, params),
            query(countSql, params)
        ]);

        const total = totalResult[0].total;

        res.json({ 
            code: 200, 
            data: {
                list: customers,
                pagination: {
                    total,
                    page: Number(page),
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        console.error('获取客户列表失败:', error);
        res.status(500).json({ code: 500, error: '获取客户列表失败' });
    }
};

// 获取客户创建者列表
exports.getCustomerCreators = async (req, res) => {
    try {
        // 先查出所有有客户的creator
        const creatorRows = await query(
            'SELECT DISTINCT creator FROM customer WHERE creator IS NOT NULL'
        );
        const creatorIds = creatorRows.map(row => row.creator);
        if (creatorIds.length === 0) {
            return res.json({ code: 200, data: [] });
        }

        // 再查user表
        const placeholders = creatorIds.map(() => '?').join(',');
        const users = await query(
            `SELECT user_id, username, real_name FROM sys_user WHERE user_id IN (${placeholders}) ORDER BY username`,
            creatorIds
        );
        res.json({ code: 200, data: users });
    } catch (error) {
        console.error('获取客户创建者列表失败:', error);
        res.status(500).json({ code: 500, error: '获取客户创建者列表失败', detail: error.message });
    }
};

// 客户详情
exports.getCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customers = await query('SELECT * FROM customer WHERE customer_id = ?', [customerId]);
        if (customers.length === 0) return res.status(404).json({ code: 404, error: '客户不存在' });
        res.json({ code: 200, customer: customers[0] });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取客户详情失败' });
    }
};

// 修改客户
exports.updateCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const fields = [];
        const params = [];
        for (const key of ['customer_name', 'customer_status', 'customer_level', 'payment_status', 'customer_source', 'customer_address', 'customer_detail', 'deal_price', 'status']) {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(req.body[key]);
            }
        }
        if (fields.length === 0) return res.status(400).json({ code: 400, error: '没有要更新的字段' });
        fields.push('update_time = NOW()');
        params.push(customerId);
        await query(`UPDATE customer SET ${fields.join(', ')} WHERE customer_id = ?`, params);
        res.json({ code: 200, message: '客户更新成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '客户更新失败' });
    }
};

// 删除客户
exports.deleteCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { customerIds } = req.body || {};

        // 如果提供了 customerIds 数组，则进行批量删除
        if (customerIds && Array.isArray(customerIds) && customerIds.length > 0) {
            // 动态生成占位符
            const placeholders = customerIds.map(() => '?').join(',');
            await query(`DELETE FROM customer WHERE customer_id IN (${placeholders})`, customerIds);
            res.json({ code: 200, message: '批量删除客户成功' });
        } 
        // 否则进行单个删除
        else if (customerId) {
            await query('DELETE FROM customer WHERE customer_id = ?', [customerId]);
            res.json({ code: 200, message: '客户删除成功' });
        } else {
            res.status(400).json({ code: 400, error: '请提供要删除的客户ID' });
        }
    } catch (error) {
        console.error('删除客户失败:', error);
        res.status(500).json({ code: 500, error: '删除客户失败' });
    }
};

// 客户统计
exports.getCustomerStats = async (req, res) => {
    try {
        const { customer_status, customer_level, payment_status } = req.query;

        // 构建查询条件
        const conditions = [];
        const params = [];

        if (customer_status) {
            conditions.push('customer_status = ?');
            params.push(customer_status);
        }
        if (customer_level) {
            conditions.push('customer_level = ?');
            params.push(customer_level);
        }
        if (payment_status) {
            conditions.push('payment_status = ?');
            params.push(payment_status);
        }

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        // 获取客户状态统计
        const statusStats = await query(`
            SELECT 
                customer_status,
                COUNT(*) as count
            FROM customer
            ${whereClause}
            GROUP BY customer_status
        `, params);

        // 获取客户级别统计
        const levelStats = await query(`
            SELECT 
                customer_level,
                COUNT(*) as count
            FROM customer
            ${whereClause}
            GROUP BY customer_level
        `, params);

        // 获取付款状态统计
        const paymentStats = await query(`
            SELECT 
                payment_status,
                COUNT(*) as count
            FROM customer
            ${whereClause}
            GROUP BY payment_status
        `, params);

        // 获取总客户数
        const totalResult = await query(`
            SELECT COUNT(*) as total
            FROM customer
            ${whereClause}
        `, params);

        // 获取成交客户数
        const dealConditions = [...conditions];
        const dealParams = [...params];
        dealConditions.push("customer_status = '成交客户'");
        const dealWhereClause = dealConditions.length > 0 ? ' WHERE ' + dealConditions.join(' AND ') : '';

        const dealResult = await query(`
            SELECT COUNT(*) as deal_count
            FROM customer
            ${dealWhereClause}
        `, dealParams);

        // 格式化统计数据
        const formatStats = (stats, type) => {
            const defaultValues = {
                customer_status: {
                    '潜在客户': 0,
                    '成交客户': 0,
                    '战略合作': 0,
                    '无效客户': 0
                },
                customer_level: {
                    '重要客户': 0,
                    '一般客户': 0
                },
                payment_status: {
                    '待付款': 0,
                    '已付款部分': 0,
                    '已结清': 0
                }
            };

            const result = { ...defaultValues[type] };
            stats.forEach(stat => {
                if (stat[type] && stat.count) {
                    result[stat[type]] = stat.count;
                }
            });
            return result;
        };

        const total = totalResult[0].total;
        const dealCount = dealResult[0].deal_count;
        const conversionRate = total > 0 ? (dealCount / total * 100).toFixed(2) : 0;

        res.json({
            code: 200,
            data: {
                total,
                conversion_rate: `${conversionRate}%`,
                status_stats: formatStats(statusStats, 'customer_status'),
                level_stats: formatStats(levelStats, 'customer_level'),
                payment_stats: formatStats(paymentStats, 'payment_status')
            }
        });
    } catch (error) {
        console.error('获取客户统计失败:', error);
        res.status(500).json({ code: 500, error: '获取客户统计失败' });
    }
};

// 客户消费排行统计
exports.getCustomerConsumptionRanking = async (req, res) => {
    try {
        const { customer_level } = req.query;

        // 构建查询条件
        const conditions = [];
        const params = [];

        if (customer_level) {
            conditions.push('c.customer_level = ?');
            params.push(customer_level);
        }

        // 添加消费金额大于0的条件
        conditions.push('c.deal_price > 0');

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        // 获取总成交金额
        const totalAmountResult = await query(`
            SELECT COALESCE(SUM(deal_price), 0) as total_amount
            FROM customer c
            ${whereClause}
        `, params);

        const totalAmount = totalAmountResult[0].total_amount;

        // 获取客户消费排行（限制前20名）
        const rankingResult = await query(`
            SELECT 
                c.customer_name,
                c.customer_level,
                c.customer_status,
                c.deal_price,
                CASE 
                    WHEN ? > 0 THEN ROUND(c.deal_price / ? * 100, 2)
                    ELSE 0 
                END as percentage
            FROM customer c
            ${whereClause}
            ORDER BY c.deal_price DESC
            LIMIT 20
        `, [totalAmount, totalAmount, ...params]);

        res.json({
            code: 200,
            data: {
                total_amount: totalAmount,
                ranking_list: rankingResult.map(item => ({
                    customer_name: item.customer_name,
                    customer_level: item.customer_level,
                    customer_status: item.customer_status,
                    deal_price: item.deal_price,
                    percentage: `${item.percentage}%`
                }))
            }
        });
    } catch (error) {
        console.error('获取客户消费排行失败:', error);
        res.status(500).json({ code: 500, error: '获取客户消费排行失败' });
    }
};

// 客户销售业绩统计
exports.getCustomerSalesPerformance = async (req, res) => {
    try {
        // 获取创建者的销售业绩统计
        const performanceResult = await query(`
            SELECT 
                u.user_id,
                u.username,
                u.real_name,
                COUNT(c.customer_id) as customer_count,
                COALESCE(SUM(c.deal_price), 0) as total_amount,
                COUNT(CASE WHEN c.customer_status = '成交客户' THEN 1 END) as deal_customer_count,
                COUNT(CASE WHEN c.customer_status = '潜在客户' THEN 1 END) as potential_customer_count,
                COUNT(CASE WHEN c.customer_status = '战略合作' THEN 1 END) as strategic_customer_count,
                COUNT(CASE WHEN c.customer_status = '无效客户' THEN 1 END) as invalid_customer_count
            FROM sys_user u
            INNER JOIN customer c ON u.user_id = c.creator
            GROUP BY u.user_id, u.username, u.real_name
            ORDER BY total_amount DESC
        `);

        res.json({
            code: 200,
            data: {
                performance_list: performanceResult.map(item => ({
                    user_id: item.user_id,
                    username: item.username,
                    real_name: item.real_name,
                    customer_count: item.customer_count,
                    deal_customer_count: item.deal_customer_count,
                    potential_customer_count: item.potential_customer_count,
                    strategic_customer_count: item.strategic_customer_count,
                    invalid_customer_count: item.invalid_customer_count,
                    total_amount: item.total_amount
                }))
            }
        });
    } catch (error) {
        console.error('获取客户销售业绩统计失败:', error);
        res.status(500).json({ code: 500, error: '获取客户销售业绩统计失败' });
    }
};