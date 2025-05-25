const { query } = require('../db/db');

// 获取所有仓库（支持分页和条件查询）
exports.getWarehouses = async (req, res) => {
    try {
        let { page = 1, limit = 10, warehouse_name, warehouse_type, warehouse_status } = req.query;
        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);
        const offset = (page - 1) * limit;

        let where = 'WHERE 1=1';
        const params = [];

        if (warehouse_name) {
            where += ' AND warehouse_name LIKE ?';
            params.push(`%${warehouse_name}%`);
        }
        if (warehouse_type !== undefined && warehouse_type !== '') {
            where += ' AND warehouse_type = ?';
            params.push(Number(warehouse_type));
        }
        if (warehouse_status !== undefined && warehouse_status !== '') {
            where += ' AND warehouse_status = ?';
            params.push(Number(warehouse_status));
        }

        // 查询总数
        const totalResult = await query(`SELECT COUNT(*) as total FROM warehouse ${where}`, params);
        const total = totalResult[0].total;

        // 查询分页数据
        const data = await query(
            `SELECT * FROM warehouse ${where} ORDER BY warehouse_id DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
            params
        );

        res.json({
            code: 200,
            warehouses: data,
            pagination: {
                total,
                page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取仓库列表失败' });
    }
};

// 获取单个仓库
exports.getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [warehouse] = await query('SELECT * FROM warehouse WHERE warehouse_id = ?', [id]);
        if (!warehouse) return res.status(404).json({ code: 404, error: '仓库不存在' });
        res.json({ code: 200, warehouse });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取仓库详情失败' });
    }
};

// 新增仓库
exports.createWarehouse = async (req, res) => {
    try {
        let { warehouse_name, warehouse_address, warehouse_status, warehouse_type, product_quantity, warehouse_manager, contact_number, remark } = req.body;
        warehouse_status = Number(warehouse_status) || 0;
        warehouse_type = Number(warehouse_type) || 0;
        await query(
            'INSERT INTO warehouse (warehouse_name, warehouse_address, warehouse_status, warehouse_type, product_quantity, warehouse_manager, contact_number, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [warehouse_name, warehouse_address, warehouse_status, warehouse_type, product_quantity || 0, warehouse_manager, contact_number, remark || null]
        );
        res.json({ code: 200, message: '仓库创建成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '创建仓库失败' });
    }
};

// 更新仓库
exports.updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        let { warehouse_name, warehouse_address, warehouse_status, warehouse_type, product_quantity, warehouse_manager, contact_number, remark } = req.body;
        warehouse_status = Number(warehouse_status) || 0;
        warehouse_type = Number(warehouse_type) || 0;
        await query(
            'UPDATE warehouse SET warehouse_name=?, warehouse_address=?, warehouse_status=?, warehouse_type=?, product_quantity=?, warehouse_manager=?, contact_number=?, remark=? WHERE warehouse_id=?',
            [warehouse_name, warehouse_address, warehouse_status, warehouse_type, product_quantity, warehouse_manager, contact_number, remark || null, id]
        );
        res.json({ code: 200, message: '仓库更新成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '更新仓库失败' });
    }
};

// 删除仓库
exports.deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM warehouse WHERE warehouse_id = ?', [id]);
        res.json({ code: 200, message: '仓库删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '删除仓库失败' });
    }
};

// 批量删除仓库
exports.batchDeleteWarehouse = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ code: 400, error: '请提供要删除的仓库ID数组' });
        }
        const placeholders = ids.map(() => '?').join(',');
        await query(`DELETE FROM warehouse WHERE warehouse_id IN (${placeholders})`, ids);
        res.json({ code: 200, message: '批量删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '批量删除失败' });
    }
};