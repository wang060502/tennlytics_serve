/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : erpserve

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 23/05/2025 18:48:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NULL DEFAULT 0,
  `dept_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `order_num` int NULL DEFAULT 0,
  `status` tinyint NULL DEFAULT 1,
  PRIMARY KEY (`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '部门表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (1, 0, '一起发展贸易有限公司', 0, 1);
INSERT INTO `sys_dept` VALUES (3, 1, '人事部', 0, 1);
INSERT INTO `sys_dept` VALUES (5, 1, '技术部', 1, 1);
INSERT INTO `sys_dept` VALUES (6, 0, '一起发展服饰有限公司', 1, 1);
INSERT INTO `sys_dept` VALUES (7, 6, '财务部', 0, 1);
INSERT INTO `sys_dept` VALUES (8, 1, '运营部', 2, 1);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父菜单ID',
  `menu_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '菜单名称',
  `menu_type` tinyint NULL DEFAULT NULL COMMENT '类型(1-目录 2-菜单 3-按钮)',
  `path` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '路由路径',
  `component` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '前端组件',
  `perms` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '权限标识(如:user:add)',
  `icon` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '图标',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `visible` tinyint NULL DEFAULT 1 COMMENT '是否可见(0-隐藏 1-显示)',
  `create_time` datetime NOT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 1, '/system', NULL, NULL, 'Setting', 10, 1, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (2, 1, '部门管理', 2, '/system/department', 'system/department/index', NULL, 'OfficeBuilding', 20, 1, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (3, 2, '部门列表', 3, NULL, NULL, 'dept:list', NULL, 1, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (4, 2, '新增部门', 3, NULL, NULL, 'dept:add', NULL, 2, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (5, 2, '编辑部门', 3, NULL, NULL, 'dept:edit', NULL, 3, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (6, 2, '删除部门', 3, NULL, NULL, 'dept:delete', NULL, 4, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (7, 1, '用户管理', 2, '/system/user', 'system/user/index', NULL, 'User', 30, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (8, 7, '用户列表', 3, NULL, NULL, 'user:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (9, 7, '新增用户', 3, NULL, NULL, 'user:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (10, 7, '编辑用户', 3, NULL, NULL, 'user:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (11, 7, '删除用户', 3, NULL, NULL, 'user:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (12, 7, '分配角色', 3, NULL, NULL, 'user:assign', NULL, 5, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (13, 1, '角色管理', 2, '/system/role', 'system/role/index', NULL, 'UserFilled', 40, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (14, 13, '角色列表', 3, NULL, NULL, 'role:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (15, 13, '新增角色', 3, NULL, NULL, 'role:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (16, 13, '编辑角色', 3, NULL, NULL, 'role:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (17, 13, '删除角色', 3, NULL, NULL, 'role:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (18, 13, '分配权限', 3, NULL, NULL, 'role:assign', NULL, 5, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (19, 1, '菜单管理', 2, '/system/menu', 'system/menu/index', NULL, 'Menu', 50, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (20, 19, '菜单列表', 3, NULL, NULL, 'menu:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (21, 19, '新增菜单', 3, NULL, NULL, 'menu:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (22, 19, '编辑菜单', 3, NULL, NULL, 'menu:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (23, 19, '删除菜单', 3, NULL, NULL, 'menu:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (24, 1, '操作日志', 2, '/system/log', 'system/log/index', NULL, 'Document', 60, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (25, 24, '日志列表', 3, NULL, NULL, 'operationLog:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (26, 0, '首页', 1, '/dashboard', '', '', 'HomeFilled', 0, 1, '2025-05-23 14:07:08', '2025-05-23 14:08:59');

-- ----------------------------
-- Table structure for sys_operation_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_operation_log`;
CREATE TABLE `sys_operation_log`  (
  `log_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL COMMENT '操作人',
  `operation` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '操作类型',
  `method` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '请求方法',
  `params` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL COMMENT '请求参数',
  `ip` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT 'IP地址',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '操作日志表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_operation_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_code` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色编码',
  `role_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色名称',
  `data_scope` tinyint NULL DEFAULT 3 COMMENT '数据权限(1-本人 2-部门 3-全部)',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`role_id`) USING BTREE,
  UNIQUE INDEX `role_code`(`role_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '角色表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, 'ADMIN', '管理员', 3, '系统管理员角色', '2025-05-22 23:03:02', '2025-05-23 15:59:05');
INSERT INTO `sys_role` VALUES (2, 'OPSUO101', '运营', 2, '负责用户增长、活跃度，社群管理与用户互动，市场推广与品牌建设', '2025-05-23 18:42:57', NULL);

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `menu_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_role_menu`(`role_id` ASC, `menu_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 66 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '角色菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (27, 1, 1);
INSERT INTO `sys_role_menu` VALUES (28, 1, 2);
INSERT INTO `sys_role_menu` VALUES (29, 1, 3);
INSERT INTO `sys_role_menu` VALUES (30, 1, 4);
INSERT INTO `sys_role_menu` VALUES (31, 1, 5);
INSERT INTO `sys_role_menu` VALUES (32, 1, 6);
INSERT INTO `sys_role_menu` VALUES (33, 1, 7);
INSERT INTO `sys_role_menu` VALUES (34, 1, 8);
INSERT INTO `sys_role_menu` VALUES (35, 1, 9);
INSERT INTO `sys_role_menu` VALUES (36, 1, 10);
INSERT INTO `sys_role_menu` VALUES (37, 1, 11);
INSERT INTO `sys_role_menu` VALUES (38, 1, 12);
INSERT INTO `sys_role_menu` VALUES (39, 1, 13);
INSERT INTO `sys_role_menu` VALUES (40, 1, 14);
INSERT INTO `sys_role_menu` VALUES (41, 1, 15);
INSERT INTO `sys_role_menu` VALUES (42, 1, 16);
INSERT INTO `sys_role_menu` VALUES (43, 1, 17);
INSERT INTO `sys_role_menu` VALUES (44, 1, 18);
INSERT INTO `sys_role_menu` VALUES (45, 1, 19);
INSERT INTO `sys_role_menu` VALUES (46, 1, 20);
INSERT INTO `sys_role_menu` VALUES (47, 1, 21);
INSERT INTO `sys_role_menu` VALUES (48, 1, 22);
INSERT INTO `sys_role_menu` VALUES (49, 1, 23);
INSERT INTO `sys_role_menu` VALUES (50, 1, 24);
INSERT INTO `sys_role_menu` VALUES (51, 1, 25);
INSERT INTO `sys_role_menu` VALUES (26, 1, 26);
INSERT INTO `sys_role_menu` VALUES (61, 2, 1);
INSERT INTO `sys_role_menu` VALUES (62, 2, 2);
INSERT INTO `sys_role_menu` VALUES (53, 2, 3);
INSERT INTO `sys_role_menu` VALUES (63, 2, 7);
INSERT INTO `sys_role_menu` VALUES (54, 2, 8);
INSERT INTO `sys_role_menu` VALUES (55, 2, 9);
INSERT INTO `sys_role_menu` VALUES (56, 2, 12);
INSERT INTO `sys_role_menu` VALUES (64, 2, 13);
INSERT INTO `sys_role_menu` VALUES (57, 2, 14);
INSERT INTO `sys_role_menu` VALUES (65, 2, 19);
INSERT INTO `sys_role_menu` VALUES (58, 2, 20);
INSERT INTO `sys_role_menu` VALUES (59, 2, 24);
INSERT INTO `sys_role_menu` VALUES (60, 2, 25);
INSERT INTO `sys_role_menu` VALUES (52, 2, 26);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '登录账号',
  `password` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '加密密码',
  `real_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '真实姓名',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '头像URL',
  `email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '手机号',
  `dept_id` bigint NULL DEFAULT NULL COMMENT '所属部门',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态(0-禁用 1-启用)',
  `last_login_time` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '系统用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '$2b$10$gGD6U4DSjGV76WSmReFURekr6RcfIPPq2Es64/b5c7jRmhrN93PfS', '汪义强', NULL, '3467520359@qq.com', '19360256621', 5, 1, '2025-05-23 18:45:17', '2025-05-22 14:52:33', '2025-05-23 17:30:10');
INSERT INTO `sys_user` VALUES (2, 'zhang', '$2b$10$Dcq3Sz61PwUauTTsSKPJSeA0Ck4FNdK7TN3vw4IdHRhSaW1nWqlM2', '张昕', NULL, 'wangyiqiang59@gmail.com', '18555444800', 1, 1, '2025-05-23 18:44:32', '2025-05-23 17:43:44', '2025-05-23 18:44:12');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_role`(`user_id` ASC, `role_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '用户角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1, 1);
INSERT INTO `sys_user_role` VALUES (3, 2, 2);

SET FOREIGN_KEY_CHECKS = 1;
