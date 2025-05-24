const { query } = require('../db/db');

// 新增分类
exports.createCategory = async (req, res) => {
    try {
        const { category_name, status = 1 } = req.body;
        await query(
            'INSERT INTO product_category (category_name, status, create_time) VALUES (?, ?, NOW())',
            [category_name, status]
        );
        res.json({ code: 200, message: '分类创建成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '分类创建失败', detail: error.message });
    }
};

// 分类列表
exports.getCategoryList = async (req, res) => {
    try {
        const categories = await query('SELECT * FROM product_category');
        res.json({ code: 200, data: categories });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取分类列表失败' });
    }
};

// 分类详情
exports.getCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const rows = await query('SELECT * FROM product_category WHERE category_id = ?', [categoryId]);
        if (rows.length === 0) return res.status(404).json({ code: 404, error: '分类不存在' });
        res.json({ code: 200, data: rows[0] });
    } catch (error) {
        res.status(500).json({ code: 500, error: '获取分类详情失败' });
    }
};

// 修改分类
exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const fields = [];
        const params = [];
        for (const key of ['category_name', 'status']) {
            if (req.body[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(req.body[key]);
            }
        }
        if (fields.length === 0) return res.status(400).json({ code: 400, error: '没有要更新的字段' });
        fields.push('update_time = NOW()');
        params.push(categoryId);
        await query(`UPDATE product_category SET ${fields.join(', ')} WHERE category_id = ?`, params);
        res.json({ code: 200, message: '分类更新成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '分类更新失败' });
    }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        await query('DELETE FROM product_category WHERE category_id = ?', [categoryId]);
        res.json({ code: 200, message: '分类删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, error: '分类删除失败' });
    }
};