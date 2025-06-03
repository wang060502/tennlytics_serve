const { query } = require('../db/db');
const crypto = require('crypto');

// 生成32字节的密钥
function generateKey(key) {
    return crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
}

// 加密密码
function encryptPassword(password) {
    if (!password) return null;
    try {
        const key = generateKey(process.env.ENCRYPTION_KEY || 'your-secret-key');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(password);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('加密密码失败:', error);
        return null;
    }
}

// 解密密码
function decryptPassword(encryptedPassword) {
    if (!encryptedPassword) return null;
    try {
        const key = generateKey(process.env.ENCRYPTION_KEY || 'your-secret-key');
        const textParts = encryptedPassword.split(':');
        if (textParts.length !== 2) return null;
        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('解密密码失败:', error);
        return null;
    }
}

// 创建账号密码
async function createAccountPassword(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ code: 401, error: '未登录或登录已过期' });
        }

        const { account_name, password, url, description } = req.body;
        const created_by = req.user.userId;
        const now = new Date();

        // 如果提供了账号名，检查是否已存在
        if (account_name) {
            const existing = await query('SELECT * FROM account_passwords WHERE account_name = ?', [account_name]);
            if (existing.length > 0) {
                return res.status(400).json({ code: 400, error: '账号名已存在' });
            }
        }

        // 加密密码
        const encryptedPassword = encryptPassword(password);

        const result = await query(
            'INSERT INTO account_passwords (account_name, password, url, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [account_name || null, encryptedPassword, url, description, created_by, now]
        );

        res.status(201).json({ code: 200, message: '创建成功', id: result.insertId });
    } catch (error) {
        console.error('创建账号密码失败:', error);
        res.status(500).json({ code: 500, error: '创建失败' });
    }
}

// 获取账号密码列表
async function getAccountPasswords(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ code: 401, error: '未登录或登录已过期' });
        }

        // 获取所有账号密码，并关联用户表获取创建者信息
        const rows = await query(
            `SELECT ap.id, ap.account_name, ap.url, ap.description, ap.created_by, ap.created_at, ap.updated_at, u.username as creator_name 
             FROM account_passwords ap
             LEFT JOIN sys_user u ON ap.created_by = u.user_id
             ORDER BY ap.created_at DESC`,
            []
        );

        res.json({ code: 200, data: rows });
    } catch (error) {
        console.error('获取账号密码列表失败:', error);
        res.status(500).json({ code: 500, error: '获取失败' });
    }
}

// 获取单个账号密码
async function getAccountPassword(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ code: 401, error: '未登录或登录已过期' });
        }

        const { id } = req.params;
        const userId = req.user.userId;

        // 获取账号密码信息，并关联用户表获取创建者信息
        const rows = await query(
            `SELECT ap.id, ap.account_name, ap.password, ap.url, ap.description, ap.created_by, ap.created_at, ap.updated_at, u.username as creator_name 
             FROM account_passwords ap
             LEFT JOIN sys_user u ON ap.created_by = u.user_id
             WHERE ap.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ code: 404, error: '账号不存在' });
        }

        const account = rows[0];

        // 检查权限
        if (account.created_by !== userId) {
            return res.status(403).json({ code: 403, error: '无权限查看' });
        }

        // 解密密码
        account.password = decryptPassword(account.password);

        res.json({ code: 200, data: account });
    } catch (error) {
        console.error('获取账号密码失败:', error);
        res.status(500).json({ code: 500, error: '获取失败' });
    }
}

// 更新账号密码
async function updateAccountPassword(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ code: 401, error: '未登录或登录已过期' });
        }

        const { id } = req.params;
        const { account_name, password, url, description } = req.body;
        const userId = req.user.userId;

        // 获取账号密码信息
        const rows = await query('SELECT * FROM account_passwords WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, error: '账号不存在' });
        }

        const account = rows[0];

        // 检查权限
        if (account.created_by !== userId) {
            return res.status(403).json({ code: 403, error: '无权限编辑' });
        }

        // 如果提供了新的账号名，检查是否已存在
        if (account_name && account_name !== account.account_name) {
            const existing = await query('SELECT * FROM account_passwords WHERE account_name = ?', [account_name]);
            if (existing.length > 0) {
                return res.status(400).json({ code: 400, error: '账号名已存在' });
            }
        }

        // 更新账号密码，只更新提供的字段
        const updateFields = [];
        const updateValues = [];
        
        if (account_name !== undefined) {
            updateFields.push('account_name = ?');
            updateValues.push(account_name);
        }
        if (password !== undefined) {
            updateFields.push('password = ?');
            updateValues.push(encryptPassword(password));
        }
        if (url !== undefined) {
            updateFields.push('url = ?');
            updateValues.push(url);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }
        
        updateFields.push('updated_at = ?');
        updateValues.push(new Date());
        updateValues.push(id);

        await query(
            `UPDATE account_passwords SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        res.json({ code: 200, message: '更新成功' });
    } catch (error) {
        console.error('更新账号密码失败:', error);
        res.status(500).json({ code: 500, error: '更新失败' });
    }
}

// 删除账号密码
async function deleteAccountPassword(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ code: 401, error: '未登录或登录已过期' });
        }

        const { id } = req.params;
        const userId = req.user.userId;

        // 获取账号密码信息
        const rows = await query('SELECT * FROM account_passwords WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, error: '账号不存在' });
        }

        // 只有创建人可以删除
        if (rows[0].created_by !== userId) {
            return res.status(403).json({ code: 403, error: '无权限删除' });
        }

        // 删除账号密码
        await query('DELETE FROM account_passwords WHERE id = ?', [id]);

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error('删除账号密码失败:', error);
        res.status(500).json({ code: 500, error: '删除失败' });
    }
}

module.exports = {
    createAccountPassword,
    getAccountPasswords,
    getAccountPassword,
    updateAccountPassword,
    deleteAccountPassword
}; 