const { query } = require('../db/db');

// 新增销售记录
exports.createSalesRecord = async (req, res) => {
    try {
        const { customer_id, product_id, product_sku, quantity, unit_price, total_price, sales_time, creator } = req.body;
        await query(
            `INSERT INTO product_sales_record (customer_id, product_id, product_sku, quantity, unit_price, total_price, sales_time, creator, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [customer_id, product_id, product_sku, quantity, unit_price, total_price, sales_time, creator]
        );
        res.json({ code: 200, message: '销售记录创建成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '销售记录创建失败', detail: error.message });
    }
};

// 查看单个客户的销售记录
exports.getCustomerSalesRecords = async (req, res) => {
    try {
        const { customerId } = req.params;
        const records = await query(
            `SELECT r.*, p.product_title, p.product_type, p.product_image
             FROM product_sales_record r
             LEFT JOIN product p ON r.product_id = p.product_id
             WHERE r.customer_id = ?
             ORDER BY r.sales_time DESC`,
            [customerId]
        );
        res.json({ code: 200, records });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取销售记录失败' });
    }
};