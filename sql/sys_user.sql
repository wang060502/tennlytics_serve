-- 创建用户表
CREATE TABLE IF NOT EXISTS `sys_user` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
    `status` tinyint(1) DEFAULT '1' COMMENT '状态(0-禁用 1-启用)',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 插入默认管理员用户 (密码为 admin123)
INSERT INTO `sys_user` (`username`, `password`, `real_name`, `status`, `remark`) 
VALUES ('admin', '$2b$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', '系统管理员', 1, '系统默认管理员账号'); 