const { query } = require('../db/db');

// 新增产品
exports.createProduct = async (req, res) => {
    try {
        const { product_title, product_sku, product_image, product_detail, remark, category_id } = req.body;
        const status = 1; // 默认状态为1

        // 验证必填字段
        if (!product_title) {
            return res.status(400).json({ code: 400, error: '产品标题不能为空' });
        }
        if (!product_sku) {
            return res.status(400).json({ code: 400, error: '产品SKU不能为空' });
        }

        // 如果提供了category_id，查询分类信息
        let product_type = null;
        if (category_id) {
            const categories = await query('SELECT category_name FROM product_category WHERE category_id = ?', [category_id]);
            if (categories.length > 0) {
                product_type = categories[0].category_name;
            }
        }

        // 生成type_code (格式: SKU + 时间戳后6位)
        const timestamp = Date.now().toString().slice(-6);
        const type_code = `${product_sku}${timestamp}`;

        // 处理可选字段，undefined转为null
        const params = [
            product_title,
            product_type,
            product_sku,
            type_code,
            product_image || null,
            product_detail || null,
            remark || null,
            status,
            category_id || null
        ];

        await query(
            `INSERT INTO product (product_title, product_type, product_sku, type_code, product_image, product_detail, remark, status, category_id, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            params
        );
        res.json({ code: 200, message: '产品创建成功' });
    } catch (error) {
        console.error('创建产品失败:', error);
        res.status(500).json({ code: 500, error: '产品创建失败', detail: error.message });
    }
};

// 产品列表
exports.getProductList = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            product_title, 
            product_sku, 
            category_id, 
            status 
        } = req.query;

        // 构建查询条件
        const conditions = [];
        const params = [];

        if (product_title) {
            conditions.push('p.product_title LIKE ?');
            params.push(`%${product_title}%`);
        }
        if (product_sku) {
            conditions.push('p.product_sku LIKE ?');
            params.push(`%${product_sku}%`);
        }
        if (category_id) {
            conditions.push('p.category_id = ?');
            params.push(parseInt(category_id));
        }
        if (status !== undefined) {
            conditions.push('p.status = ?');
            params.push(parseInt(status));
        }

        // 计算分页
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // 构建SQL查询
        let sql = 'SELECT p.*, pc.category_name FROM product p LEFT JOIN product_category pc ON p.category_id = pc.category_id';
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
        sql += ` ORDER BY p.create_time DESC LIMIT ${limitNum} OFFSET ${offset}`;

        // 获取总记录数
        let countSql = 'SELECT COUNT(*) as total FROM product p';
        if (conditions.length > 0) {
            countSql += ' WHERE ' + conditions.join(' AND ');
        }
        const [countResult] = await query(countSql, params);
        const total = countResult.total;

        // 获取分页数据
        const products = await query(sql, params);

        res.json({
            code: 200,
            data: {
                list: products,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        console.error('获取产品列表失败:', error);
        res.status(500).json({ code: 500, error: '获取产品列表失败', detail: error.message });
    }
};

// 产品详情
exports.getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const products = await query('SELECT * FROM product WHERE product_id = ?', [productId]);
        if (products.length === 0) return res.status(404).json({ code: 404, error: '产品不存在' });
        res.json({ code: 200, product: products[0] });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取产品详情失败' });
    }
};

// 修改产品
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { category_id } = req.body;
        const fields = [];
        const params = [];

        // 如果更新了category_id，查询对应的分类名称
        if (category_id !== undefined) {
            const categories = await query('SELECT category_name FROM product_category WHERE category_id = ?', [category_id]);
            if (categories.length > 0) {
                fields.push('product_type = ?');
                params.push(categories[0].category_name);
                // 同时更新category_id
                fields.push('category_id = ?');
                params.push(category_id);
            }
        }

        // 处理其他字段
        for (const key of ['product_title', 'product_sku', 'product_image', 'product_detail', 'remark', 'status']) {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(req.body[key]);
            }
        }

        if (fields.length === 0) return res.status(400).json({ code: 400, error: '没有要更新的字段' });
        
        fields.push('update_time = NOW()');
        params.push(productId);
        
        await query(`UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`, params);
        res.json({ code: 200, message: '产品更新成功' });
    } catch (error) {
        console.error('更新产品失败:', error);
        res.status(500).json({ code: 500, error: '产品更新失败', detail: error.message });
    }
};

// 删除产品
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productIds } = req.body || {};

        // 批量删除
        if (productIds && Array.isArray(productIds) && productIds.length > 0) {
            const placeholders = productIds.map(() => '?').join(',');
            await query(`DELETE FROM product WHERE product_id IN (${placeholders})`, productIds);
            res.json({ code: 200, message: '批量删除产品成功' });
        }
        // 单个删除
        else if (productId) {
            await query('DELETE FROM product WHERE product_id = ?', [productId]);
            res.json({ code: 200, message: '产品删除成功' });
        }
        // 参数错误
        else {
            res.status(400).json({ code: 400, error: '请提供要删除的产品ID' });
        }
    } catch (error) {
        console.error('删除产品失败:', error);
        res.status(500).json({ code: 500, error: '删除产品失败', detail: error.message });
    }
};