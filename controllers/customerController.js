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
            creator_id
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