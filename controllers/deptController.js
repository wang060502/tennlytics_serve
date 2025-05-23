const { query } = require('../db/db');
const { logOperation } = require('./operationLogController');

/**
 * 创建部门
 */
async function createDept(req, res) {
    try {
        const { parentId = 0, deptName, orderNum = 0, status = 1 } = req.body;
        if (!deptName) {
            return res.status(400).json({ code: 400, error: '部门名称是必填项' });
        }
        const result = await query(
            'INSERT INTO sys_dept (parent_id, dept_name, order_num, status) VALUES (?, ?, ?, ?)',
            [parentId, deptName, orderNum, status]
        );
        res.status(201).json({ code: 200, message: '部门创建成功', deptId: result.insertId });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'createDept',
            method: req.method,
            params: JSON.stringify(req.body),
            ip: req.ip
        });
    } catch (error) {
        console.error('创建部门失败:', error);
        res.status(500).json({ code: 500, error: '创建部门失败' });
    }
}

/**
 * 更新部门
 */
async function updateDept(req, res) {
    try {
        const { deptId } = req.params;
        const { parentId, deptName, orderNum, status } = req.body;
        const result = await query(
            'UPDATE sys_dept SET parent_id = ?, dept_name = ?, order_num = ?, status = ? WHERE dept_id = ?',
            [parentId, deptName, orderNum, status, deptId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '部门不存在' });
        }
        res.json({ code: 200, message: '部门更新成功' });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'updateDept',
            method: req.method,
            params: JSON.stringify({ deptId, ...req.body }),
            ip: req.ip
        });
    } catch (error) {
        console.error('更新部门失败:', error);
        res.status(500).json({ code: 500, error: '更新部门失败' });
    }
}

/**
 * 删除部门
 */
async function deleteDept(req, res) {
    try {
        const { deptId } = req.params;
        // 检查是否有子部门
        const children = await query('SELECT * FROM sys_dept WHERE parent_id = ?', [deptId]);
        if (children.length > 0) {
            return res.status(400).json({ code: 400, error: '存在子部门，无法删除' });
        }
        // 检查是否有用户关联
        const users = await query('SELECT * FROM sys_user WHERE dept_id = ?', [deptId]);
        if (users.length > 0) {
            return res.status(400).json({ code: 400, error: '部门下存在用户，无法删除' });
        }
        const result = await query('DELETE FROM sys_dept WHERE dept_id = ?', [deptId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, error: '部门不存在' });
        }
        res.json({ code: 200, message: '部门删除成功' });
        // 记录操作日志
        await logOperation({
            req,
            operation: 'deleteDept',
            method: req.method,
            params: JSON.stringify({ deptId }),
            ip: req.ip
        });
    } catch (error) {
        console.error('删除部门失败:', error);
        res.status(500).json({ code: 500, error: '删除部门失败' });
    }
}

/**
 * 获取部门树
 */
async function getDeptTree(req, res) {
    try {
        const depts = await query('SELECT * FROM sys_dept ORDER BY order_num ASC');
        // 构建树形结构
        const buildTree = (items, parentId = 0) => {
            const result = [];
            for (const item of items) {
                if (item.parent_id === parentId) {
                    const children = buildTree(items, item.dept_id);
                    if (children.length) {
                        item.children = children;
                    }
                    result.push(item);
                }
            }
            return result;
        };
        const deptTree = buildTree(depts);
        res.json({ code: 200, depts: deptTree });
    } catch (error) {
        console.error('获取部门树失败:', error);
        res.status(500).json({ code: 500, error: '获取部门树失败' });
    }
}

module.exports = {
    createDept,
    updateDept,
    deleteDept,
    getDeptTree
}; 