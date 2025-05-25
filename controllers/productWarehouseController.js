const { query, pool } = require('../db/db');

// 获取产品-仓库库存列表（支持分页和条件查询）
exports.getProductWarehouses = async (req, res) => {
    try {
        let { page = 1, limit = 10, product_name, product_sku, warehouse_id } = req.query;
        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);
        const offset = (page - 1) * limit;

        let where = 'WHERE 1=1';
        const params = [];

        if (product_name) {
            where += ' AND p.product_title LIKE ?';
            params.push(`%${product_name}%`);
        }
        if (product_sku) {
            where += ' AND p.product_sku LIKE ?';
            params.push(`%${product_sku}%`);
        }
        if (warehouse_id !== undefined && warehouse_id !== '') {
            where += ' AND w.warehouse_id = ?';
            params.push(Number(warehouse_id));
        }

        // 查询总数（按产品分组后计数）
        const totalResult = await query(
            `SELECT COUNT(*) as total FROM (
                SELECT pw.product_id
                FROM product_warehouse pw
                LEFT JOIN product p ON pw.product_id = p.product_id
                LEFT JOIN warehouse w ON pw.warehouse_id = w.warehouse_id
                ${where}
                GROUP BY pw.product_id
            ) t`,
            params
        );
        const total = totalResult[0].total;

        // 查询分页数据
        const rows = await query(
            `SELECT pw.id, pw.product_id, p.product_title, p.product_sku, p.product_image, p.product_type,
                    pw.warehouse_id, w.warehouse_name, pw.product_size, pw.stock_quantity
             FROM product_warehouse pw
             LEFT JOIN product p ON pw.product_id = p.product_id
             LEFT JOIN warehouse w ON pw.warehouse_id = w.warehouse_id
             ${where}
             ORDER BY pw.product_id DESC, pw.warehouse_id ASC
             LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
            params
        );

        // 聚合为每个产品下所有仓库的库存
        const map = new Map();
        for (const row of rows) {
            const key = row.product_id;
            if (!map.has(key)) {
                map.set(key, {
                    product_id: row.product_id,
                    product_name: row.product_title,
                    product_sku: row.product_sku,
                    product_image: row.product_image,
                    product_type: row.product_type,
                    warehouses: []
                });
            }
            const product = map.get(key);
            const warehouseIndex = product.warehouses.findIndex(w => w.warehouse_id === row.warehouse_id);
            if (warehouseIndex === -1) {
                product.warehouses.push({
                    warehouse_id: row.warehouse_id,
                    warehouse_name: row.warehouse_name,
                    stocks: []
                });
            }
            const warehouse = product.warehouses[warehouseIndex === -1 ? product.warehouses.length - 1 : warehouseIndex];
            warehouse.stocks.push({
                id: row.id,
                product_size: row.product_size,
                stock_quantity: row.stock_quantity
            });
        }
        const list = Array.from(map.values());

        res.json({
            code: 200,
            list,
            pagination: {
                total,
                page,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取库存失败' });
    }
};

// 获取单条库存
exports.getProductWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const [stock] = await query('SELECT * FROM product_warehouse WHERE id = ?', [id]);
        if (!stock) return res.status(404).json({ code: 404, error: '库存记录不存在' });
        res.json({ code: 200, stock });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取库存详情失败' });
    }
};

// 新增库存（支持批量）
exports.createProductWarehouse = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ code: 400, error: '请提供库存信息数组' });
        }
        // 校验每一项
        for (const item of items) {
            const { product_id, product_size, stock_quantity, warehouse_id } = item;
            if (!product_id || !product_size || !warehouse_id) {
                return res.status(400).json({ code: 400, error: '每条库存记录必须包含 product_id, product_size, warehouse_id' });
            }
        }
        // 校验是否有重复
        for (const item of items) {
            // 查找 product_sku
            const [product] = await query('SELECT product_sku FROM product WHERE product_id = ?', [item.product_id]);
            if (!product) {
                return res.status(400).json({ code: 400, error: `未找到产品ID为${item.product_id}的产品` });
            }
            const product_sku = product.product_sku;
            // 只用 product_id, product_size, warehouse_id 查重
            const exist = await query(
                'SELECT id FROM product_warehouse WHERE product_id = ? AND product_size = ? AND warehouse_id = ?',
                [item.product_id, item.product_size, item.warehouse_id]
            );
            if (exist.length > 0) {
                return res.status(400).json({ code: 400, error: `请勿重复添加SKU为${product_sku}的产品，已有${exist.length}条记录` });
            }
        }
        // 构造批量插入
        const values = items.map(item => [
            item.product_id,
            item.product_size,
            item.stock_quantity || 0,
            item.warehouse_id
        ]);
        const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        await query(
            `INSERT INTO product_warehouse (product_id, product_size, stock_quantity, warehouse_id) VALUES ${placeholders}`,
            flatValues
        );
        res.json({ code: 200, message: '库存记录批量创建成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '创建库存失败' });
    }
};

// 更新库存（支持批量）
exports.updateProductWarehouse = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ code: 400, error: '请提供库存信息数组' });
        }

        // 校验每一项
        for (const item of items) {
            const { product_id, product_size, warehouse_id, stock_quantity } = item;
            if (!product_id || !product_size || !warehouse_id || stock_quantity === undefined) {
                return res.status(400).json({ code: 400, error: '每条库存记录必须包含 product_id, product_size, warehouse_id 和 stock_quantity' });
            }
        }

        // 分离需要新增和更新的项
        const toUpdate = items.filter(item => item.id);
        const toInsert = items.filter(item => !item.id);


        // 处理需要更新的项
        if (toUpdate.length > 0) {
            const updateCases = toUpdate.map(item => 
                `WHEN ${item.id} THEN ${item.stock_quantity || 0}`
            ).join(' ');
            
            const sizeCases = toUpdate.map(item => 
                `WHEN ${item.id} THEN '${item.product_size || ''}'`
            ).join(' ');
            
            const warehouseCases = toUpdate.map(item => 
                `WHEN ${item.id} THEN ${item.warehouse_id || 0}`
            ).join(' ');

            const ids = toUpdate.map(item => item.id).join(',');
            
            const updateSql = `UPDATE product_warehouse 
                 SET stock_quantity = CASE id ${updateCases} END,
                     product_size = CASE id ${sizeCases} END,
                     warehouse_id = CASE id ${warehouseCases} END 
                 WHERE id IN (${ids})`;
            
            const [updateResult] = await connection.query(updateSql);
        }

        // 处理需要新增的项
        let newIds = [];
        if (toInsert.length > 0) {
            // 使用参数化查询来防止 SQL 注入
            const placeholders = toInsert.map(() => '(?, ?, ?, ?)').join(', ');
            const values = toInsert.map(item => [
                item.product_id,
                item.product_size,
                item.warehouse_id,
                item.stock_quantity || 0
            ]).flat();
            
            const insertSql = `INSERT INTO product_warehouse (product_id, product_size, warehouse_id, stock_quantity) 
                 VALUES ${placeholders}`;
            const [insertResult] = await connection.query(insertSql, values);

            // 计算所有新插入的id
            if (insertResult.affectedRows > 0) {
                for (let i = 0; i < insertResult.affectedRows; i++) {
                    newIds.push(insertResult.insertId + i);
                }
            }
        }

        // 删除不在更新列表中的库存记录
        const product_id = items[0].product_id; // 所有库存记录属于同一产品
        const allIds = [...toUpdate.map(item => item.id), ...newIds];
        if (allIds.length > 0) {
            const deleteSql = `DELETE FROM product_warehouse WHERE product_id = ? AND id NOT IN (${allIds.join(',')})`;
            const [deleteResult] = await connection.query(deleteSql, [product_id]);
        }

        await connection.commit();
        res.json({ code: 200, message: '库存记录批量更新成功' });
    } catch (error) {
        await connection.rollback();
        console.error('更新库存失败:', error);
        // 输出更详细的错误信息
        if (error.code) {
            console.error('错误代码:', error.code);
        }
        if (error.sqlMessage) {
            console.error('SQL错误信息:', error.sqlMessage);
        }
        if (error.sql) {
            console.error('错误SQL:', error.sql);
        }
        res.status(500).json({ 
            code: 500, 
            error: '更新库存失败',
            details: error.sqlMessage || error.message 
        });
    } finally {
        connection.release();
    }
};

// 删除某产品的全部库存
exports.deleteProductWarehouse = async (req, res) => {
    try {
        const { product_id } = req.params;
        await query('DELETE FROM product_warehouse WHERE product_id = ?', [product_id]);
        res.json({ code: 200, message: '该产品的所有库存记录已删除' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '删除库存失败' });
    }
};