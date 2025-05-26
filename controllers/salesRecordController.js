const { query, pool } = require('../db/db');

// 新增销售记录
exports.createSalesRecord = async (req, res) => {
    try {
        const { customer_id, products, sales_time, creator } = req.body;
        
        // 验证必填字段
        if (!customer_id || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ code: 400, error: '客户ID和产品信息不能为空' });
        }

        // 验证每个产品的信息
        for (const product of products) {
            const { product_id, product_sku, quantity, unit_price, total_price } = product;
            if (!product_id || !product_sku || !quantity || !unit_price || !total_price) {
                return res.status(400).json({ code: 400, error: '产品信息不完整' });
            }
        }

        // 格式化销售时间
        const formattedSalesTime = new Date(sales_time).toISOString().slice(0, 19).replace('T', ' ');

        // 计算本次销售总金额
        const totalAmount = products.reduce((sum, product) => sum + parseFloat(product.total_price), 0);

        // 开始事务
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 使用单个查询插入所有产品记录
            const values = products.map(product => {
                const { product_id, product_sku, quantity, unit_price, total_price, remark } = product;
                return [customer_id, product_id, product_sku, quantity, unit_price, total_price, formattedSalesTime, creator, remark || null];
            });

            const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())').join(', ');
            const flatValues = values.flat();

            await connection.query(
                `INSERT INTO product_sales_record 
                (customer_id, product_id, product_sku, quantity, unit_price, total_price, sales_time, creator, remark, create_time) 
                VALUES ${placeholders}`,
                flatValues
            );

            // 更新客户表的 deal_price 字段
            await connection.query(
                `UPDATE customer 
                 SET deal_price = COALESCE(deal_price, 0) + ?,
                     update_time = NOW()
                 WHERE customer_id = ?`,
                [totalAmount, customer_id]
            );

            await connection.commit();
            res.json({ code: 200, message: '销售记录创建成功' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ code: 500, error: '销售记录创建失败', detail: error.message });
    }
};

// 查看单个客户的销售记录
exports.getCustomerSalesRecords = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // 确保 page 和 limit 是整数
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        // 获取客户总销售金额
        const customerTotal = await query(
            `SELECT COALESCE(SUM(total_price), 0) as total_amount 
             FROM product_sales_record 
             WHERE customer_id = ?`,
            [customerId]
        );

        // 获取总记录数
        const totalCount = await query(
            `SELECT COUNT(DISTINCT sales_time) as total
             FROM product_sales_record
             WHERE customer_id = ?`,
            [customerId]
        );

        // 1. 查所有 sales_time
        const allSalesTimes = await query(
            `SELECT DISTINCT sales_time FROM product_sales_record WHERE customer_id = ? ORDER BY sales_time DESC`,
            [customerId]
        );

        // 2. 手动分页
        const pagedSalesTimes = allSalesTimes.slice(offset, offset + limitNum);

        // 3. 查每个 sales_time 下的所有产品，并收集所有 creator
        let allCreators = new Set();
        const orders = await Promise.all(pagedSalesTimes.map(async (sale) => {
            const products = await query(
                `SELECT r.*, p.product_title, p.product_type, p.product_image
                 FROM product_sales_record r
                 LEFT JOIN product p ON r.product_id = p.product_id
                 WHERE r.customer_id = ? AND r.sales_time = ?
                 ORDER BY r.record_id`,
                [customerId, sale.sales_time]
            );
            if (products[0]?.creator) allCreators.add(products[0].creator);
            return { sale, products };
        }));

        // 4. 查所有 creator 的姓名
        let creatorMap = {};
        if (allCreators.size > 0) {
            const creatorIds = Array.from(allCreators);
            const users = await query(
                `SELECT user_id, username, real_name FROM sys_user WHERE user_id IN (${creatorIds.map(() => '?').join(',')})`,
                creatorIds
            );
            creatorMap = users.reduce((acc, cur) => {
                acc[cur.user_id] = cur.real_name || cur.username || `ID:${cur.user_id}`;
                return acc;
            }, {});
        }

        // 5. 组装最终 orders
        const finalOrders = orders.map(({ sale, products }) => {
            const creator = products[0]?.creator || null;
            const create_time = products[0]?.create_time || null;
            const totalAmount = products.reduce((sum, product) => sum + parseFloat(product.total_price), 0);
            return {
                sales_time: sale.sales_time,
                creator,
                creator_name: creatorMap[creator] || `ID:${creator}`,
                create_time,
                total_amount: totalAmount.toFixed(2),
                products
            };
        });

        res.json({ 
            code: 200, 
            customer_total_amount: parseFloat(customerTotal[0].total_amount).toFixed(2),
            orders: finalOrders,
            pagination: {
                total: totalCount[0].total,
                page: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取销售记录失败' });
    }
};

// 删除销售记录
exports.deleteSalesRecord = async (req, res) => {
    try {
        const { customerId, salesTime } = req.params;
        const creatorId = req.user.userId;
        // 验证参数
        if (!customerId || !salesTime) {
            return res.status(400).json({ 
                code: 400, 
                error: '客户ID和销售时间不能为空' 
            });
        }

        // 开始事务
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. 先查询该时间点的所有记录
            const [records] = await connection.query(
                `SELECT record_id, total_price, creator 
                 FROM product_sales_record 
                 WHERE customer_id = ? 
                 AND sales_time = CONVERT_TZ(?, '+00:00', @@session.time_zone)`,
                [customerId, salesTime]
            );

            if (!records || records.length === 0) {
                return res.status(404).json({
                    code: 404,
                    error: '未找到指定时间点的销售记录',
                    debug: {
                        customerId,
                        salesTime
                    }
                });
            }

            // 检查权限
            const recordCreator = records[0].creator;
            if (recordCreator !== creatorId) {
                return res.status(403).json({
                    code: 403,
                    error: '你无权删除他人的销售记录'
                });
            }

            // 2. 计算总金额
            const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.total_price || 0), 0);

            // 3. 删除销售记录
            const recordIds = records.map(record => record.record_id);
            const [deleteResult] = await connection.query(
                `DELETE FROM product_sales_record 
                 WHERE record_id IN (?)`,
                [recordIds]
            );

            if (deleteResult.affectedRows === 0) {
                throw new Error('删除销售记录失败');
            }

            // 4. 更新客户的总消费金额
            await connection.query(
                `UPDATE customer 
                 SET deal_price = GREATEST(COALESCE(deal_price, 0) - ?, 0),
                     update_time = NOW()
                 WHERE customer_id = ?`,
                [totalAmount, customerId]
            );

            await connection.commit();
            res.json({ 
                code: 200, 
                message: '销售记录删除成功',
                deletedCount: deleteResult.affectedRows,
                totalAmount
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('删除销售记录失败:', error);
        res.status(500).json({ 
            code: 500, 
            error: '删除销售记录失败', 
            detail: error.message 
        });
    }
};