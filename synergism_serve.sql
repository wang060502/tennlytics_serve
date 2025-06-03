/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : synergism_serve

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 03/06/2025 22:28:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account_password_permissions
-- ----------------------------
DROP TABLE IF EXISTS `account_password_permissions`;
CREATE TABLE `account_password_permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL,
  `created_by` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `can_view` tinyint(1) NULL DEFAULT 0,
  `can_edit` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `account_password_permissions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `sys_user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `account_password_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_password_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for account_passwords
-- ----------------------------
DROP TABLE IF EXISTS `account_passwords`;
CREATE TABLE `account_passwords`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL,
  `created_by` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `account_passwords_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `sys_user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of account_passwords
-- ----------------------------
INSERT INTO `account_passwords` VALUES (1, '3467520359@qq.com', 'da5acd4855e37f1ea14b171843f42a8d:fcedaf9c93a38ae058884566e1aa7a6c', 'https://www.qiniu.com/', '七牛云账号密码', 1, '2025-06-03 21:20:34', '2025-06-03 21:45:04');
INSERT INTO `account_passwords` VALUES (2, '714021488@qq.com', '232daf2f728f8c1ee0a11f5f6ed5e99f:8f7bc3f3c5eae1fb111c16a1c8464d48', 'https://www.airsecurecard.com/', '全球收款（需要二步验证）', 1, '2025-06-03 21:27:50', NULL);

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
  `component` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '组件路径',
  `perms` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '权限标识(如:user:add)',
  `icon` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '图标',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `visible` tinyint NULL DEFAULT 1 COMMENT '是否可见(0-隐藏 1-显示)',
  `create_time` datetime NOT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 1, '/system', NULL, NULL, 'Setting', 50, 1, '2025-05-22 23:13:45', '2025-05-24 15:57:08');
INSERT INTO `sys_menu` VALUES (2, 1, '部门管理', 2, '/system/department', NULL, NULL, 'OfficeBuilding', 20, 1, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (3, 2, '部门列表', 3, NULL, NULL, 'dept:list', NULL, 1, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (4, 2, '新增部门', 3, NULL, NULL, 'dept:add', NULL, 2, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (5, 2, '编辑部门', 3, NULL, NULL, 'dept:edit', NULL, 3, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (6, 2, '删除部门', 3, NULL, NULL, 'dept:delete', NULL, 4, 0, '2025-05-22 23:13:45', NULL);
INSERT INTO `sys_menu` VALUES (7, 1, '用户管理', 2, '/system/user', NULL, NULL, 'User', 30, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (8, 7, '用户列表', 3, NULL, NULL, 'user:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (9, 7, '新增用户', 3, NULL, NULL, 'user:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (10, 7, '编辑用户', 3, NULL, NULL, 'user:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (11, 7, '删除用户', 3, NULL, NULL, 'user:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (12, 7, '分配角色', 3, NULL, NULL, 'user:assign', NULL, 5, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (13, 1, '角色管理', 2, '/system/role', NULL, NULL, 'UserFilled', 40, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (14, 13, '角色列表', 3, NULL, NULL, 'role:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (15, 13, '新增角色', 3, NULL, NULL, 'role:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (16, 13, '编辑角色', 3, NULL, NULL, 'role:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (17, 13, '删除角色', 3, NULL, NULL, 'role:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (18, 13, '分配权限', 3, NULL, NULL, 'role:assign', NULL, 5, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (19, 1, '菜单管理', 2, '/system/menu', NULL, NULL, 'Menu', 50, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (20, 19, '菜单列表', 3, NULL, NULL, 'menu:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (21, 19, '新增菜单', 3, NULL, NULL, 'menu:add', NULL, 2, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (22, 19, '编辑菜单', 3, NULL, NULL, 'menu:edit', NULL, 3, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (23, 19, '删除菜单', 3, NULL, NULL, 'menu:delete', NULL, 4, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (24, 1, '操作日志', 2, '/system/log', NULL, NULL, 'Document', 60, 1, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (25, 24, '日志列表', 3, NULL, NULL, 'operationLog:list', NULL, 1, 0, '2025-05-23 11:49:14', NULL);
INSERT INTO `sys_menu` VALUES (26, 0, '首页', 1, '/dashboard', NULL, '', 'HomeFilled', 0, 1, '2025-05-23 14:07:08', '2025-05-24 12:07:36');
INSERT INTO `sys_menu` VALUES (54, 0, '账密管理', 1, '/account', '', '', 'Key', 1, 1, '2025-06-03 21:07:00', '2025-06-03 21:07:23');
INSERT INTO `sys_menu` VALUES (55, 54, '账密列表', 2, '/account/list', '', 'account_password:list', '', 0, 1, '2025-06-03 21:08:39', '2025-06-03 21:46:48');
INSERT INTO `sys_menu` VALUES (56, 55, '创建账密', 3, '', '', 'account_password:create', '', 0, 0, '2025-06-03 21:09:22', NULL);
INSERT INTO `sys_menu` VALUES (57, 55, '修改账密', 3, '', '', 'account_password:edit', '', 1, 0, '2025-06-03 21:10:02', NULL);
INSERT INTO `sys_menu` VALUES (58, 55, '删除账密', 3, '', '', 'account_password:delete', '', 3, 0, '2025-06-03 21:10:41', NULL);
INSERT INTO `sys_menu` VALUES (59, 55, '查看账密', 3, '', '', 'account_password:view', '', 4, 0, '2025-06-03 21:11:09', '2025-06-03 21:51:27');
INSERT INTO `sys_menu` VALUES (60, 55, '查看账密列表', 3, '', '', 'account_password:list', '', 5, 0, '2025-06-03 21:51:24', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 119 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '操作日志表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_operation_log
-- ----------------------------
INSERT INTO `sys_operation_log` VALUES (1, 1, 'updateUser', 'PUT', '{\"userId\":\"1\",\"realName\":\"汪义强\",\"avatar\":null,\"email\":\"3467520359@qq.com\",\"mobile\":\"19360256621\",\"deptId\":5,\"status\":1,\"remark\":\"1\",\"roleId\":1}', '::1', '2025-05-24 10:24:39');
INSERT INTO `sys_operation_log` VALUES (2, 1, 'updateUser', 'PUT', '{\"userId\":\"1\",\"realName\":\"汪义强\",\"avatar\":null,\"email\":\"3467520359@qq.com\",\"mobile\":\"19360256621\",\"deptId\":5,\"status\":1,\"remark\":\"1\",\"roleId\":1}', '::1', '2025-05-24 10:35:25');
INSERT INTO `sys_operation_log` VALUES (3, 1, 'updateUser', 'PUT', '{\"userId\":\"1\",\"realName\":\"汪义强\",\"avatar\":null,\"email\":\"3467520359@qq.com\",\"mobile\":\"19360256621\",\"deptId\":5,\"status\":1,\"remark\":\"\",\"roleId\":1}', '::1', '2025-05-24 10:41:36');
INSERT INTO `sys_operation_log` VALUES (4, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":26,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/system/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 11:42:16');
INSERT INTO `sys_operation_log` VALUES (5, 1, 'updateMenu', 'PUT', '{\"menuId\":\"29\",\"parentId\":27,\"menuName\":\"新增客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:add\",\"icon\":null,\"sort\":2,\"visible\":0}', '::1', '2025-05-24 11:43:06');
INSERT INTO `sys_operation_log` VALUES (6, 1, 'updateMenu', 'PUT', '{\"menuId\":\"31\",\"parentId\":27,\"menuName\":\"删除客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:delete\",\"icon\":null,\"sort\":4,\"visible\":0}', '::1', '2025-05-24 11:43:28');
INSERT INTO `sys_operation_log` VALUES (7, 1, 'updateMenu', 'PUT', '{\"menuId\":\"30\",\"parentId\":27,\"menuName\":\"编辑客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:edit\",\"icon\":null,\"sort\":3,\"visible\":0}', '::1', '2025-05-24 11:43:35');
INSERT INTO `sys_operation_log` VALUES (8, 1, 'updateMenu', 'PUT', '{\"menuId\":\"29\",\"parentId\":28,\"menuName\":\"新增客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:add\",\"icon\":null,\"sort\":2,\"visible\":0}', '::1', '2025-05-24 11:44:24');
INSERT INTO `sys_operation_log` VALUES (9, 1, 'updateMenu', 'PUT', '{\"menuId\":\"30\",\"parentId\":28,\"menuName\":\"编辑客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:edit\",\"icon\":null,\"sort\":3,\"visible\":0}', '::1', '2025-05-24 11:44:37');
INSERT INTO `sys_operation_log` VALUES (10, 1, 'updateMenu', 'PUT', '{\"menuId\":\"31\",\"parentId\":28,\"menuName\":\"删除客户\",\"menuType\":3,\"path\":null,\"component\":null,\"perms\":\"customer:delete\",\"icon\":null,\"sort\":4,\"visible\":0}', '::1', '2025-05-24 11:44:45');
INSERT INTO `sys_operation_log` VALUES (11, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/system/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 11:53:40');
INSERT INTO `sys_operation_log` VALUES (12, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":26,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/system/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 11:57:43');
INSERT INTO `sys_operation_log` VALUES (13, 1, 'createMenu', 'POST', '{\"menuName\":\"1\",\"menuType\":1,\"path\":\"312\",\"component\":\"\",\"perms\":\"21wq\",\"icon\":\"AddLocation\",\"sort\":0,\"visible\":1}', '::1', '2025-05-24 11:58:43');
INSERT INTO `sys_operation_log` VALUES (14, 1, 'deleteMenu', 'DELETE', '{\"menuId\":32}', '::1', '2025-05-24 12:05:43');
INSERT INTO `sys_operation_log` VALUES (15, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/system/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 12:05:51');
INSERT INTO `sys_operation_log` VALUES (16, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":0,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/system/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 12:07:00');
INSERT INTO `sys_operation_log` VALUES (17, 1, 'updateMenu', 'PUT', '{\"menuId\":\"26\",\"parentId\":27,\"menuName\":\"首页\",\"menuType\":1,\"path\":\"/dashboard\",\"component\":\"\",\"perms\":\"\",\"icon\":\"HomeFilled\",\"sort\":0,\"visible\":1}', '::1', '2025-05-24 12:07:30');
INSERT INTO `sys_operation_log` VALUES (18, 1, 'updateMenu', 'PUT', '{\"menuId\":\"26\",\"parentId\":0,\"menuName\":\"首页\",\"menuType\":1,\"path\":\"/dashboard\",\"component\":\"\",\"perms\":\"\",\"icon\":\"HomeFilled\",\"sort\":0,\"visible\":1}', '::1', '2025-05-24 12:07:36');
INSERT INTO `sys_operation_log` VALUES (19, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":0,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/customer\",\"component\":\"system/customer/index\",\"perms\":null,\"icon\":\"UserGroup\",\"sort\":70,\"visible\":1}', '::1', '2025-05-24 12:45:49');
INSERT INTO `sys_operation_log` VALUES (20, 1, 'updateMenu', 'PUT', '{\"menuId\":\"28\",\"parentId\":27,\"menuName\":\"客户列表\",\"menuType\":3,\"path\":\"/customer/list\",\"component\":null,\"perms\":\"customer:list\",\"icon\":null,\"sort\":1,\"visible\":0}', '::1', '2025-05-24 12:46:43');
INSERT INTO `sys_operation_log` VALUES (21, 1, 'updateMenu', 'PUT', '{\"menuId\":\"28\",\"parentId\":27,\"menuName\":\"客户列表\",\"menuType\":2,\"path\":\"/customer/list\",\"perms\":\"customer:list\",\"icon\":null,\"sort\":1,\"visible\":0}', '::1', '2025-05-24 12:50:54');
INSERT INTO `sys_operation_log` VALUES (22, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":0,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/customer\",\"component\":null,\"perms\":null,\"icon\":\"UserGroup\",\"sort\":5,\"visible\":1}', '::1', '2025-05-24 12:51:18');
INSERT INTO `sys_operation_log` VALUES (23, 1, 'updateMenu', 'PUT', '{\"menuId\":\"28\",\"parentId\":27,\"menuName\":\"客户列表\",\"menuType\":2,\"path\":\"/customer/list\",\"component\":null,\"perms\":\"customer:list\",\"icon\":null,\"sort\":1,\"visible\":1}', '::1', '2025-05-24 12:52:26');
INSERT INTO `sys_operation_log` VALUES (24, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-24 13:00:18');
INSERT INTO `sys_operation_log` VALUES (25, 1, 'createMenu', 'POST', '{\"menuName\":\"商品管理\",\"menuType\":1,\"path\":\"/product\",\"component\":\"\",\"perms\":\"\",\"icon\":\"Goods\",\"sort\":6,\"visible\":1}', '::1', '2025-05-24 15:56:53');
INSERT INTO `sys_operation_log` VALUES (26, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":0,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/customer\",\"component\":null,\"perms\":null,\"icon\":\"UserGroup\",\"sort\":15,\"visible\":1}', '::1', '2025-05-24 15:57:00');
INSERT INTO `sys_operation_log` VALUES (27, 1, 'updateMenu', 'PUT', '{\"menuId\":\"1\",\"parentId\":0,\"menuName\":\"系统管理\",\"menuType\":1,\"path\":\"/system\",\"component\":null,\"perms\":null,\"icon\":\"Setting\",\"sort\":50,\"visible\":1}', '::1', '2025-05-24 15:57:08');
INSERT INTO `sys_operation_log` VALUES (28, 1, 'updateMenu', 'PUT', '{\"menuId\":\"33\",\"parentId\":0,\"menuName\":\"商品管理\",\"menuType\":1,\"path\":\"/product\",\"component\":\"\",\"perms\":\"\",\"icon\":\"Goods\",\"sort\":5,\"visible\":1}', '::1', '2025-05-24 15:57:15');
INSERT INTO `sys_operation_log` VALUES (29, 1, 'updateMenu', 'PUT', '{\"menuId\":\"27\",\"parentId\":0,\"menuName\":\"客户管理\",\"menuType\":1,\"path\":\"/customer\",\"component\":null,\"perms\":null,\"icon\":\"User\",\"sort\":15,\"visible\":1}', '::1', '2025-05-24 15:58:42');
INSERT INTO `sys_operation_log` VALUES (30, 1, 'createMenu', 'POST', '{\"parentId\":33,\"menuName\":\"商品分类\",\"menuType\":2,\"path\":\"/product/category\",\"component\":\"\",\"perms\":\"\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-24 15:59:15');
INSERT INTO `sys_operation_log` VALUES (31, 1, 'updateMenu', 'PUT', '{\"menuId\":\"34\",\"parentId\":33,\"menuName\":\"商品分类\",\"menuType\":2,\"path\":\"/product/category\",\"component\":\"\",\"perms\":\"productCategory:list\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-24 15:59:47');
INSERT INTO `sys_operation_log` VALUES (32, 1, 'createMenu', 'POST', '{\"parentId\":34,\"menuName\":\"新增商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:add\",\"icon\":\"\",\"sort\":1,\"visible\":1}', '::1', '2025-05-24 16:00:16');
INSERT INTO `sys_operation_log` VALUES (33, 1, 'updateMenu', 'PUT', '{\"menuId\":\"34\",\"parentId\":33,\"menuName\":\"商品分类\",\"menuType\":2,\"path\":\"/product/category\",\"component\":\"\",\"perms\":\"productCategory:list\",\"icon\":\"\",\"sort\":1,\"visible\":1}', '::1', '2025-05-24 16:00:24');
INSERT INTO `sys_operation_log` VALUES (34, 1, 'createMenu', 'POST', '{\"parentId\":34,\"menuName\":\"修改商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:edit\",\"icon\":\"\",\"sort\":2,\"visible\":1}', '::1', '2025-05-24 16:00:57');
INSERT INTO `sys_operation_log` VALUES (35, 1, 'updateMenu', 'PUT', '{\"menuId\":\"35\",\"parentId\":34,\"menuName\":\"新增商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:add\",\"icon\":\"\",\"sort\":1,\"visible\":0}', '::1', '2025-05-24 16:01:01');
INSERT INTO `sys_operation_log` VALUES (36, 1, 'updateMenu', 'PUT', '{\"menuId\":\"36\",\"parentId\":34,\"menuName\":\"修改商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:edit\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-24 16:01:04');
INSERT INTO `sys_operation_log` VALUES (37, 1, 'createMenu', 'POST', '{\"parentId\":34,\"menuName\":\"删除商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:delete\",\"icon\":\"\",\"sort\":3,\"visible\":1}', '::1', '2025-05-24 16:01:25');
INSERT INTO `sys_operation_log` VALUES (38, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,33,34,35,36,37,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-24 16:02:30');
INSERT INTO `sys_operation_log` VALUES (39, 1, 'createMenu', 'POST', '{\"parentId\":33,\"menuName\":\"商品列表\",\"menuType\":2,\"path\":\"/product/list\",\"component\":\"\",\"perms\":\"productCategory:list\",\"icon\":\"\",\"sort\":1,\"visible\":1}', '::1', '2025-05-24 16:37:54');
INSERT INTO `sys_operation_log` VALUES (40, 1, 'updateMenu', 'PUT', '{\"menuId\":\"34\",\"parentId\":33,\"menuName\":\"商品分类\",\"menuType\":2,\"path\":\"/product/category\",\"component\":\"\",\"perms\":\"productCategory:list\",\"icon\":\"\",\"sort\":2,\"visible\":1}', '::1', '2025-05-24 16:38:00');
INSERT INTO `sys_operation_log` VALUES (41, 1, 'createMenu', 'POST', '{\"parentId\":38,\"menuName\":\"新增商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:add\",\"icon\":\"\",\"sort\":1,\"visible\":0}', '::1', '2025-05-24 16:38:27');
INSERT INTO `sys_operation_log` VALUES (42, 1, 'createMenu', 'POST', '{\"parentId\":38,\"menuName\":\"修改商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:edit\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-24 16:38:51');
INSERT INTO `sys_operation_log` VALUES (43, 1, 'createMenu', 'POST', '{\"parentId\":38,\"menuName\":\"删除商品\",\"menuType\":1,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:delete\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-24 16:39:11');
INSERT INTO `sys_operation_log` VALUES (44, 1, 'updateMenu', 'PUT', '{\"menuId\":\"37\",\"parentId\":34,\"menuName\":\"删除商品分类\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"productCategory:delete\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-24 16:39:30');
INSERT INTO `sys_operation_log` VALUES (45, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,33,38,39,40,41,34,35,36,37,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-24 16:40:11');
INSERT INTO `sys_operation_log` VALUES (46, 1, 'createMenu', 'POST', '{\"menuName\":\"仓库管理\",\"menuType\":1,\"path\":\"/warehouse\",\"component\":\"\",\"perms\":\"\",\"icon\":\"House\",\"sort\":20,\"visible\":1}', '::1', '2025-05-25 16:24:16');
INSERT INTO `sys_operation_log` VALUES (47, 1, 'createMenu', 'POST', '{\"parentId\":42,\"menuName\":\"仓库列表\",\"menuType\":2,\"path\":\"/warehouse/list\",\"component\":\"\",\"perms\":\"warehouse:list\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-25 16:25:45');
INSERT INTO `sys_operation_log` VALUES (48, 1, 'updateMenu', 'PUT', '{\"menuId\":\"43\",\"parentId\":42,\"menuName\":\"仓库列表\",\"menuType\":2,\"path\":\"/warehouse/list\",\"component\":\"\",\"perms\":\"warehouse:list\",\"icon\":\"\",\"sort\":1,\"visible\":1}', '::1', '2025-05-25 16:25:58');
INSERT INTO `sys_operation_log` VALUES (49, 1, 'createMenu', 'POST', '{\"parentId\":43,\"menuName\":\"新增仓库\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"warehouse:add\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-25 16:26:25');
INSERT INTO `sys_operation_log` VALUES (50, 1, 'createMenu', 'POST', '{\"parentId\":43,\"menuName\":\"更新仓库\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"warehouse:edit\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-25 16:26:55');
INSERT INTO `sys_operation_log` VALUES (51, 1, 'updateMenu', 'PUT', '{\"menuId\":\"45\",\"parentId\":43,\"menuName\":\"更新仓库\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"warehouse:edit\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-25 16:27:01');
INSERT INTO `sys_operation_log` VALUES (52, 1, 'createMenu', 'POST', '{\"parentId\":43,\"menuName\":\"删除仓库\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"warehouse:delete\",\"icon\":\"\",\"sort\":4,\"visible\":0}', '::1', '2025-05-25 16:27:21');
INSERT INTO `sys_operation_log` VALUES (53, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,33,38,39,40,41,34,35,36,37,27,28,29,30,31,42,43,44,45,46,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-25 16:28:35');
INSERT INTO `sys_operation_log` VALUES (54, 1, 'createMenu', 'POST', '{\"parentId\":42,\"menuName\":\"库存管理\",\"menuType\":2,\"path\":\"/warehouse/inventory\",\"component\":\"\",\"perms\":\"\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-25 18:38:41');
INSERT INTO `sys_operation_log` VALUES (55, 1, 'updateMenu', 'PUT', '{\"menuId\":\"47\",\"parentId\":42,\"menuName\":\"库存管理\",\"menuType\":2,\"path\":\"/warehouse/inventory\",\"component\":\"\",\"perms\":\"\",\"icon\":\"\",\"sort\":2,\"visible\":1}', '::1', '2025-05-25 18:38:51');
INSERT INTO `sys_operation_log` VALUES (56, 1, 'createMenu', 'POST', '{\"parentId\":47,\"menuName\":\"库存列表\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"inventory:list\",\"icon\":\"\",\"sort\":1,\"visible\":0}', '::1', '2025-05-25 18:39:33');
INSERT INTO `sys_operation_log` VALUES (57, 1, 'createMenu', 'POST', '{\"parentId\":47,\"menuName\":\"新增库存\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"inventory:add\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-25 18:40:19');
INSERT INTO `sys_operation_log` VALUES (58, 1, 'createMenu', 'POST', '{\"parentId\":47,\"menuName\":\"更新库存\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"inventory:update\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-25 18:40:43');
INSERT INTO `sys_operation_log` VALUES (59, 1, 'createMenu', 'POST', '{\"parentId\":47,\"menuName\":\"删除库存\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"inventory:delete\",\"icon\":\"\",\"sort\":4,\"visible\":0}', '::1', '2025-05-25 18:41:02');
INSERT INTO `sys_operation_log` VALUES (60, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,33,38,39,40,41,34,35,36,37,27,28,29,30,31,42,43,44,45,46,47,48,49,50,51,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-25 18:41:21');
INSERT INTO `sys_operation_log` VALUES (61, 1, 'updateMenu', 'PUT', '{\"menuId\":\"39\",\"parentId\":38,\"menuName\":\"新增商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"product:add\",\"icon\":\"\",\"sort\":1,\"visible\":0}', '::1', '2025-05-26 10:50:04');
INSERT INTO `sys_operation_log` VALUES (62, 1, 'updateMenu', 'PUT', '{\"menuId\":\"40\",\"parentId\":38,\"menuName\":\"修改商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"product:update\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-26 10:50:19');
INSERT INTO `sys_operation_log` VALUES (63, 1, 'updateMenu', 'PUT', '{\"menuId\":\"40\",\"parentId\":38,\"menuName\":\"修改商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"product:edit\",\"icon\":\"\",\"sort\":2,\"visible\":0}', '::1', '2025-05-26 10:50:38');
INSERT INTO `sys_operation_log` VALUES (64, 1, 'updateMenu', 'PUT', '{\"menuId\":\"41\",\"parentId\":38,\"menuName\":\"删除商品\",\"menuType\":1,\"path\":\"\",\"component\":\"\",\"perms\":\"product:delete\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-26 10:50:52');
INSERT INTO `sys_operation_log` VALUES (65, 1, 'createMenu', 'POST', '{\"parentId\":38,\"menuName\":\"商品统计\",\"menuType\":2,\"path\":\"\",\"component\":\"\",\"perms\":\"product:view\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-26 10:51:36');
INSERT INTO `sys_operation_log` VALUES (66, 1, 'updateMenu', 'PUT', '{\"menuId\":\"52\",\"parentId\":33,\"menuName\":\"商品统计\",\"menuType\":2,\"path\":\"\",\"component\":\"\",\"perms\":\"product:view\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-05-26 10:51:55');
INSERT INTO `sys_operation_log` VALUES (67, 1, 'updateMenu', 'PUT', '{\"menuId\":\"52\",\"parentId\":33,\"menuName\":\"商品统计\",\"menuType\":2,\"path\":\"\",\"component\":\"\",\"perms\":\"product:view\",\"icon\":\"\",\"sort\":3,\"visible\":1}', '::1', '2025-05-26 10:52:10');
INSERT INTO `sys_operation_log` VALUES (68, 1, 'updateMenu', 'PUT', '{\"menuId\":\"41\",\"parentId\":38,\"menuName\":\"删除商品\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"product:delete\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-05-26 10:52:21');
INSERT INTO `sys_operation_log` VALUES (69, 1, 'updateMenu', 'PUT', '{\"menuId\":\"52\",\"parentId\":33,\"menuName\":\"商品统计\",\"menuType\":2,\"path\":\"/product/statistics\",\"component\":\"\",\"perms\":\"product:view\",\"icon\":\"\",\"sort\":3,\"visible\":1}', '::1', '2025-05-26 11:00:36');
INSERT INTO `sys_operation_log` VALUES (70, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,33,38,39,40,41,34,35,36,37,52,27,28,29,30,31,42,43,44,45,46,47,48,49,50,51,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-05-26 11:00:52');
INSERT INTO `sys_operation_log` VALUES (71, 1, 'createMenu', 'POST', '{\"parentId\":27,\"menuName\":\"客户分析\",\"menuType\":2,\"path\":\"/customer/analysis\",\"component\":\"\",\"perms\":\"customer:list\",\"icon\":\"\",\"sort\":2,\"visible\":1}', '::1', '2025-05-26 15:29:44');
INSERT INTO `sys_operation_log` VALUES (72, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 12:59:30');
INSERT INTO `sys_operation_log` VALUES (73, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 12:59:45');
INSERT INTO `sys_operation_log` VALUES (74, 1, 'deleteMenu', 'DELETE', '{\"menuId\":44}', '::1', '2025-06-03 13:00:06');
INSERT INTO `sys_operation_log` VALUES (75, 1, 'deleteMenu', 'DELETE', '{\"menuId\":46}', '::1', '2025-06-03 13:00:10');
INSERT INTO `sys_operation_log` VALUES (76, 1, 'deleteMenu', 'DELETE', '{\"menuId\":45}', '::1', '2025-06-03 13:00:12');
INSERT INTO `sys_operation_log` VALUES (77, 1, 'deleteMenu', 'DELETE', '{\"menuId\":43}', '::1', '2025-06-03 13:00:13');
INSERT INTO `sys_operation_log` VALUES (78, 1, 'deleteMenu', 'DELETE', '{\"menuId\":51}', '::1', '2025-06-03 13:00:19');
INSERT INTO `sys_operation_log` VALUES (79, 1, 'deleteMenu', 'DELETE', '{\"menuId\":50}', '::1', '2025-06-03 13:00:21');
INSERT INTO `sys_operation_log` VALUES (80, 1, 'deleteMenu', 'DELETE', '{\"menuId\":49}', '::1', '2025-06-03 13:00:23');
INSERT INTO `sys_operation_log` VALUES (81, 1, 'deleteMenu', 'DELETE', '{\"menuId\":48}', '::1', '2025-06-03 13:00:25');
INSERT INTO `sys_operation_log` VALUES (82, 1, 'deleteMenu', 'DELETE', '{\"menuId\":47}', '::1', '2025-06-03 13:00:26');
INSERT INTO `sys_operation_log` VALUES (83, 1, 'deleteMenu', 'DELETE', '{\"menuId\":42}', '::1', '2025-06-03 13:00:29');
INSERT INTO `sys_operation_log` VALUES (84, 1, 'deleteMenu', 'DELETE', '{\"menuId\":53}', '::1', '2025-06-03 13:00:33');
INSERT INTO `sys_operation_log` VALUES (85, 1, 'deleteMenu', 'DELETE', '{\"menuId\":31}', '::1', '2025-06-03 13:00:37');
INSERT INTO `sys_operation_log` VALUES (86, 1, 'deleteMenu', 'DELETE', '{\"menuId\":30}', '::1', '2025-06-03 13:00:39');
INSERT INTO `sys_operation_log` VALUES (87, 1, 'deleteMenu', 'DELETE', '{\"menuId\":29}', '::1', '2025-06-03 13:00:40');
INSERT INTO `sys_operation_log` VALUES (88, 1, 'deleteMenu', 'DELETE', '{\"menuId\":28}', '::1', '2025-06-03 13:00:42');
INSERT INTO `sys_operation_log` VALUES (89, 1, 'deleteMenu', 'DELETE', '{\"menuId\":27}', '::1', '2025-06-03 13:00:44');
INSERT INTO `sys_operation_log` VALUES (90, 1, 'deleteMenu', 'DELETE', '{\"menuId\":52}', '::1', '2025-06-03 13:00:48');
INSERT INTO `sys_operation_log` VALUES (91, 1, 'deleteMenu', 'DELETE', '{\"menuId\":37}', '::1', '2025-06-03 13:00:51');
INSERT INTO `sys_operation_log` VALUES (92, 1, 'deleteMenu', 'DELETE', '{\"menuId\":36}', '::1', '2025-06-03 13:00:52');
INSERT INTO `sys_operation_log` VALUES (93, 1, 'deleteMenu', 'DELETE', '{\"menuId\":35}', '::1', '2025-06-03 13:00:54');
INSERT INTO `sys_operation_log` VALUES (94, 1, 'deleteMenu', 'DELETE', '{\"menuId\":34}', '::1', '2025-06-03 13:00:55');
INSERT INTO `sys_operation_log` VALUES (95, 1, 'deleteMenu', 'DELETE', '{\"menuId\":41}', '::1', '2025-06-03 13:01:00');
INSERT INTO `sys_operation_log` VALUES (96, 1, 'deleteMenu', 'DELETE', '{\"menuId\":40}', '::1', '2025-06-03 13:01:01');
INSERT INTO `sys_operation_log` VALUES (97, 1, 'deleteMenu', 'DELETE', '{\"menuId\":39}', '::1', '2025-06-03 13:01:03');
INSERT INTO `sys_operation_log` VALUES (98, 1, 'deleteMenu', 'DELETE', '{\"menuId\":38}', '::1', '2025-06-03 13:01:05');
INSERT INTO `sys_operation_log` VALUES (99, 1, 'deleteMenu', 'DELETE', '{\"menuId\":33}', '::1', '2025-06-03 13:01:07');
INSERT INTO `sys_operation_log` VALUES (100, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 13:01:13');
INSERT INTO `sys_operation_log` VALUES (101, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"2\",\"menuIds\":[26,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,1]}', '::1', '2025-06-03 13:01:18');
INSERT INTO `sys_operation_log` VALUES (102, 1, 'updateRole', 'PUT', '{\"roleId\":\"2\",\"roleName\":\"运营\",\"remark\":\"负责用户增长、活跃度，社群管理与用户互动，市场推广与品牌建设\",\"dataScope\":1}', '::1', '2025-06-03 13:01:23');
INSERT INTO `sys_operation_log` VALUES (103, 1, 'updateRole', 'PUT', '{\"roleId\":\"2\",\"roleName\":\"运营\",\"remark\":\"负责用户增长、活跃度，社群管理与用户互动，市场推广与品牌建设\",\"dataScope\":2}', '::1', '2025-06-03 13:01:32');
INSERT INTO `sys_operation_log` VALUES (104, 1, 'createMenu', 'POST', '{\"menuName\":\"账密管理\",\"menuType\":1,\"path\":\"/account/list\",\"component\":\"\",\"perms\":\"\",\"icon\":\"Key\",\"sort\":1,\"visible\":1}', '::1', '2025-06-03 21:07:00');
INSERT INTO `sys_operation_log` VALUES (105, 1, 'updateMenu', 'PUT', '{\"menuId\":\"54\",\"parentId\":0,\"menuName\":\"账密管理\",\"menuType\":1,\"path\":\"/account\",\"component\":\"\",\"perms\":\"\",\"icon\":\"Key\",\"sort\":1,\"visible\":1}', '::1', '2025-06-03 21:07:23');
INSERT INTO `sys_operation_log` VALUES (106, 1, 'createMenu', 'POST', '{\"parentId\":54,\"menuName\":\"账密列表\",\"menuType\":2,\"path\":\"/account/list\",\"component\":\"\",\"perms\":\"account_password:view\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-06-03 21:08:39');
INSERT INTO `sys_operation_log` VALUES (107, 1, 'createMenu', 'POST', '{\"parentId\":55,\"menuName\":\"创建账密\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:create\",\"icon\":\"\",\"sort\":0,\"visible\":0}', '::1', '2025-06-03 21:09:22');
INSERT INTO `sys_operation_log` VALUES (108, 1, 'createMenu', 'POST', '{\"parentId\":55,\"menuName\":\"修改账密\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:edit\",\"icon\":\"\",\"sort\":1,\"visible\":0}', '::1', '2025-06-03 21:10:02');
INSERT INTO `sys_operation_log` VALUES (109, 1, 'createMenu', 'POST', '{\"parentId\":55,\"menuName\":\"删除账密\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:delete\",\"icon\":\"\",\"sort\":3,\"visible\":0}', '::1', '2025-06-03 21:10:41');
INSERT INTO `sys_operation_log` VALUES (110, 1, 'createMenu', 'POST', '{\"parentId\":55,\"menuName\":\"查看账密\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:view\",\"icon\":\"\",\"sort\":4,\"visible\":1}', '::1', '2025-06-03 21:11:09');
INSERT INTO `sys_operation_log` VALUES (111, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,54,55,56,57,58,59,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 21:12:49');
INSERT INTO `sys_operation_log` VALUES (112, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,54,55,56,57,58,59,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 21:16:51');
INSERT INTO `sys_operation_log` VALUES (113, 1, 'updateMenu', 'PUT', '{\"menuId\":\"55\",\"parentId\":54,\"menuName\":\"账密列表\",\"menuType\":2,\"path\":\"/account/list\",\"component\":\"\",\"perms\":\"account_password:list\",\"icon\":\"\",\"sort\":0,\"visible\":1}', '::1', '2025-06-03 21:46:48');
INSERT INTO `sys_operation_log` VALUES (114, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,54,55,56,57,58,59,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 21:46:55');
INSERT INTO `sys_operation_log` VALUES (115, 2, 'createMenu', 'POST', '{\"parentId\":55,\"menuName\":\"查看账密列表\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:list\",\"icon\":\"\",\"sort\":5,\"visible\":0}', '::1', '2025-06-03 21:51:24');
INSERT INTO `sys_operation_log` VALUES (116, 2, 'updateMenu', 'PUT', '{\"menuId\":\"59\",\"parentId\":55,\"menuName\":\"查看账密\",\"menuType\":3,\"path\":\"\",\"component\":\"\",\"perms\":\"account_password:view\",\"icon\":\"\",\"sort\":4,\"visible\":0}', '::1', '2025-06-03 21:51:27');
INSERT INTO `sys_operation_log` VALUES (117, 2, 'assignRoleMenus', 'POST', '{\"roleId\":\"2\",\"menuIds\":[26,60,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,54,55]}', '::1', '2025-06-03 21:51:35');
INSERT INTO `sys_operation_log` VALUES (118, 1, 'assignRoleMenus', 'POST', '{\"roleId\":\"1\",\"menuIds\":[26,54,55,56,57,58,59,60,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]}', '::1', '2025-06-03 22:02:12');

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
INSERT INTO `sys_role` VALUES (2, 'OPSUO101', '运营', 2, '负责用户增长、活跃度，社群管理与用户互动，市场推广与品牌建设', '2025-05-23 18:42:57', '2025-06-03 13:01:32');

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
) ENGINE = InnoDB AUTO_INCREMENT = 576 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '角色菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (551, 1, 1);
INSERT INTO `sys_role_menu` VALUES (552, 1, 2);
INSERT INTO `sys_role_menu` VALUES (553, 1, 3);
INSERT INTO `sys_role_menu` VALUES (554, 1, 4);
INSERT INTO `sys_role_menu` VALUES (555, 1, 5);
INSERT INTO `sys_role_menu` VALUES (556, 1, 6);
INSERT INTO `sys_role_menu` VALUES (557, 1, 7);
INSERT INTO `sys_role_menu` VALUES (558, 1, 8);
INSERT INTO `sys_role_menu` VALUES (559, 1, 9);
INSERT INTO `sys_role_menu` VALUES (560, 1, 10);
INSERT INTO `sys_role_menu` VALUES (561, 1, 11);
INSERT INTO `sys_role_menu` VALUES (562, 1, 12);
INSERT INTO `sys_role_menu` VALUES (563, 1, 13);
INSERT INTO `sys_role_menu` VALUES (564, 1, 14);
INSERT INTO `sys_role_menu` VALUES (565, 1, 15);
INSERT INTO `sys_role_menu` VALUES (566, 1, 16);
INSERT INTO `sys_role_menu` VALUES (567, 1, 17);
INSERT INTO `sys_role_menu` VALUES (568, 1, 18);
INSERT INTO `sys_role_menu` VALUES (569, 1, 19);
INSERT INTO `sys_role_menu` VALUES (570, 1, 20);
INSERT INTO `sys_role_menu` VALUES (571, 1, 21);
INSERT INTO `sys_role_menu` VALUES (572, 1, 22);
INSERT INTO `sys_role_menu` VALUES (573, 1, 23);
INSERT INTO `sys_role_menu` VALUES (574, 1, 24);
INSERT INTO `sys_role_menu` VALUES (575, 1, 25);
INSERT INTO `sys_role_menu` VALUES (543, 1, 26);
INSERT INTO `sys_role_menu` VALUES (544, 1, 54);
INSERT INTO `sys_role_menu` VALUES (545, 1, 55);
INSERT INTO `sys_role_menu` VALUES (546, 1, 56);
INSERT INTO `sys_role_menu` VALUES (547, 1, 57);
INSERT INTO `sys_role_menu` VALUES (548, 1, 58);
INSERT INTO `sys_role_menu` VALUES (549, 1, 59);
INSERT INTO `sys_role_menu` VALUES (550, 1, 60);
INSERT INTO `sys_role_menu` VALUES (516, 2, 1);
INSERT INTO `sys_role_menu` VALUES (517, 2, 2);
INSERT INTO `sys_role_menu` VALUES (518, 2, 3);
INSERT INTO `sys_role_menu` VALUES (519, 2, 4);
INSERT INTO `sys_role_menu` VALUES (520, 2, 5);
INSERT INTO `sys_role_menu` VALUES (521, 2, 6);
INSERT INTO `sys_role_menu` VALUES (522, 2, 7);
INSERT INTO `sys_role_menu` VALUES (523, 2, 8);
INSERT INTO `sys_role_menu` VALUES (524, 2, 9);
INSERT INTO `sys_role_menu` VALUES (525, 2, 10);
INSERT INTO `sys_role_menu` VALUES (526, 2, 11);
INSERT INTO `sys_role_menu` VALUES (527, 2, 12);
INSERT INTO `sys_role_menu` VALUES (528, 2, 13);
INSERT INTO `sys_role_menu` VALUES (529, 2, 14);
INSERT INTO `sys_role_menu` VALUES (530, 2, 15);
INSERT INTO `sys_role_menu` VALUES (531, 2, 16);
INSERT INTO `sys_role_menu` VALUES (532, 2, 17);
INSERT INTO `sys_role_menu` VALUES (533, 2, 18);
INSERT INTO `sys_role_menu` VALUES (534, 2, 19);
INSERT INTO `sys_role_menu` VALUES (535, 2, 20);
INSERT INTO `sys_role_menu` VALUES (536, 2, 21);
INSERT INTO `sys_role_menu` VALUES (537, 2, 22);
INSERT INTO `sys_role_menu` VALUES (538, 2, 23);
INSERT INTO `sys_role_menu` VALUES (539, 2, 24);
INSERT INTO `sys_role_menu` VALUES (540, 2, 25);
INSERT INTO `sys_role_menu` VALUES (514, 2, 26);
INSERT INTO `sys_role_menu` VALUES (541, 2, 54);
INSERT INTO `sys_role_menu` VALUES (542, 2, 55);
INSERT INTO `sys_role_menu` VALUES (515, 2, 60);

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
  `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '备注',
  `last_login_time` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '系统用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '$2b$10$gGD6U4DSjGV76WSmReFURekr6RcfIPPq2Es64/b5c7jRmhrN93PfS', '汪义强', NULL, '3467520359@qq.com', '19360256621', 5, 1, '', '2025-06-03 22:01:49', '2025-05-22 14:52:33', '2025-05-24 10:41:36');
INSERT INTO `sys_user` VALUES (2, 'zhang', '$2b$10$Dcq3Sz61PwUauTTsSKPJSeA0Ck4FNdK7TN3vw4IdHRhSaW1nWqlM2', '张昕', NULL, 'wangyiqiang59@gmail.com', '18555444800', 1, 1, NULL, '2025-06-03 21:53:24', '2025-05-23 17:43:44', '2025-05-23 18:44:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '用户角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (6, 1, 1);
INSERT INTO `sys_user_role` VALUES (3, 2, 2);

SET FOREIGN_KEY_CHECKS = 1;
