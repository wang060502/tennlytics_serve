const jwt = require('jsonwebtoken');
const { query } = require('../db/db');

// JWT密钥
const JWT_SECRET = 'your_jwt_secret'; // 建议从环境变量中读取

// 验证JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ code: 401, error: '未提供认证令牌' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ code: 401, error: '无效的认证令牌' });
    }
};

// 检查用户权限
const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;
            
            // 查询用户角色
            const userRoles = await query(
                'SELECT r.role_id FROM sys_role r ' +
                'INNER JOIN sys_user_role ur ON r.role_id = ur.role_id ' +
                'WHERE ur.user_id = ?',
                [userId]
            );

            if (userRoles.length === 0) {
                return res.status(403).json({ code: 403, error: '用户未分配角色' });
            }

            const roleIds = userRoles.map(role => role.role_id);

            // 查询角色对应的权限
            const placeholders = roleIds.map(() => '?').join(',');
            const permissions = await query(
                `SELECT DISTINCT m.perms FROM sys_menu m
                 INNER JOIN sys_role_menu rm ON m.menu_id = rm.menu_id
                 WHERE rm.role_id IN (${placeholders}) AND m.perms IS NOT NULL`,
                roleIds
            );

            const userPermissions = permissions.map(p => p.perms);

            // console.log('userId:', userId);
            // console.log('roleIds:', roleIds);
            // console.log('userPermissions:', userPermissions);
            // console.log('requiredPermission:', permission);

            if (!userPermissions.includes(permission)) {
                return res.status(403).json({ code: 403, error: '没有操作权限' });
            }

            next();
        } catch (error) {
            console.error('权限检查失败:', error);
            res.status(500).json({ code: 500, error: '权限检查失败' });
        }
    };
};

module.exports = {
    verifyToken,
    checkPermission
}; 