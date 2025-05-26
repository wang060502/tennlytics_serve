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

 Date: 26/05/2025 18:47:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`  (
  `customer_id` bigint NOT NULL AUTO_INCREMENT COMMENT '客户ID',
  `customer_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '客户名称',
  `customer_status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '客户状态（潜在客户，成交客户，战略合作，无效客户）',
  `customer_level` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '客户级别（重要客户，一般客户）',
  `payment_status` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '付款状态（待付款，已付款部分，已结清）',
  `customer_source` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '客户来源',
  `customer_address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '客户地址',
  `customer_detail` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL COMMENT '客户详情',
  `deal_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '客户成交价',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态(0-禁用 1-启用)',
  `creator` bigint NOT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`customer_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '客户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES (4, '刘易', '成交客户', '重要客户', '已结清', '小红书', '广东省东莞市长安镇建安路689号冠城电子信息产业园B栋三楼B2区101仓', '无', 26.00, 1, 1, '2025-05-24 14:17:56', '2025-05-26 18:44:49');
INSERT INTO `customer` VALUES (5, '陈茉函', '潜在客户', '重要客户', '已结清', '小红书', '无', '无', 122.00, 1, 1, '2025-05-24 14:52:45', '2025-05-26 17:33:32');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `product_id` bigint NOT NULL AUTO_INCREMENT COMMENT '产品ID',
  `product_title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '产品标题',
  `product_type` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '产品分类名称',
  `category_id` bigint UNSIGNED NOT NULL COMMENT '分类ID',
  `product_sku` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '产品SKU',
  `type_code` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '类型编码',
  `product_image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '产品图片',
  `product_detail` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL COMMENT '产品详情',
  `remark` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态(0-禁用 1-启用)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`product_id`) USING BTREE,
  UNIQUE INDEX `product_sku`(`product_sku` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '产品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (3, ' FW23', '卫裤', 3, ' 401 080 30 NAVY', ' 401 080 30 NAVY623764', 'http://localhost:3000/uploads/1748083619400-461924650.jpeg', '无', '无', 1, '2025-05-24 18:47:03', NULL);
INSERT INTO `product` VALUES (6, 'FW23', '卫裤', 3, '401 080 30 NAVY', '401 080 30 NAVY017561', 'http://localhost:3000/uploads/1748096015753-821994441.jpeg', 'Navy/藏青色', '无', 1, '2025-05-24 22:13:37', NULL);
INSERT INTO `product` VALUES (7, 'NBA#FW24', '短袖', 4, '125AL244000F', '125AL244000F073234', 'http://localhost:3000/uploads/1748096061678-354408401.png', '浅灰色（LIGHT HEATHER）', '无', 1, '2025-05-24 22:14:33', '2025-05-24 22:16:24');
INSERT INTO `product` VALUES (8, '10-2#SS24', '卫衣', 1, '202SP244311F', '202SP244311F169057', 'http://localhost:3000/uploads/1748096156652-648412964.png', '春园黄（DARK HEATHER OATMEAL/GARDEN YELLOW）', '无', 1, '2025-05-24 22:16:09', '2025-05-26 11:12:50');
INSERT INTO `product` VALUES (9, 'NBA#FW24', '短裤', 5, '160AL244000F', '160AL244000F261466', 'http://localhost:3000/uploads/1748096250985-822531364.png', '浅灰色（LIGHT HEATHER）', '无', 1, '2025-05-24 22:17:41', NULL);

-- ----------------------------
-- Table structure for product_category
-- ----------------------------
DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category`  (
  `category_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `category_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '分类名称',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 (0-禁用, 1-启用)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`category_id`) USING BTREE,
  UNIQUE INDEX `uk_category_name`(`category_name` ASC) USING BTREE COMMENT '分类名称唯一索引'
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '产品分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_category
-- ----------------------------
INSERT INTO `product_category` VALUES (1, '卫衣', 1, '2025-05-24 16:17:30', '2025-05-24 16:19:25');
INSERT INTO `product_category` VALUES (3, '卫裤', 1, '2025-05-24 16:17:59', NULL);
INSERT INTO `product_category` VALUES (4, '短袖', 1, '2025-05-24 22:15:03', NULL);
INSERT INTO `product_category` VALUES (5, '短裤', 1, '2025-05-24 22:17:04', NULL);

-- ----------------------------
-- Table structure for product_sales_record
-- ----------------------------
DROP TABLE IF EXISTS `product_sales_record`;
CREATE TABLE `product_sales_record`  (
  `record_id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `customer_id` bigint NOT NULL COMMENT '客户ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `product_sku` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '产品SKU',
  `quantity` int NOT NULL COMMENT '销售件数',
  `unit_price` decimal(10, 2) NOT NULL COMMENT '销售单价',
  `total_price` decimal(10, 2) NOT NULL COMMENT '销售总价',
  `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '备注',
  `sales_time` datetime NOT NULL COMMENT '销售时间',
  `creator` bigint NOT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `fk_customer_id`(`customer_id` ASC) USING BTREE,
  INDEX `fk_product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '产品销售记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_sales_record
-- ----------------------------
INSERT INTO `product_sales_record` VALUES (13, 5, 7, '125AL244000F', 1, 27.00, 27.00, NULL, '2025-05-26 09:33:14', 1, '2025-05-26 17:33:32', NULL);
INSERT INTO `product_sales_record` VALUES (14, 5, 6, '401 080 30 NAVY', 5, 19.00, 95.00, NULL, '2025-05-26 09:33:14', 1, '2025-05-26 17:33:32', NULL);
INSERT INTO `product_sales_record` VALUES (16, 4, 3, ' 401 080 30 NAVY', 1, 26.00, 26.00, NULL, '2025-05-26 09:35:20', 1, '2025-05-26 17:35:29', NULL);

-- ----------------------------
-- Table structure for product_warehouse
-- ----------------------------
DROP TABLE IF EXISTS `product_warehouse`;
CREATE TABLE `product_warehouse`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `product_id` bigint NOT NULL COMMENT '产品ID',
  `product_size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品尺码',
  `stock_quantity` int NULL DEFAULT 0 COMMENT '产品库存数量',
  `warehouse_id` bigint NOT NULL COMMENT '仓库ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_product`(`product_id` ASC) USING BTREE,
  INDEX `fk_warehouse`(`warehouse_id` ASC) USING BTREE,
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '产品仓库关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_warehouse
-- ----------------------------
INSERT INTO `product_warehouse` VALUES (1, 8, 's', 2, 2);
INSERT INTO `product_warehouse` VALUES (2, 8, 'xl', 5, 1);
INSERT INTO `product_warehouse` VALUES (4, 3, 'xl', 2, 2);
INSERT INTO `product_warehouse` VALUES (5, 6, 'xs', 15, 2);
INSERT INTO `product_warehouse` VALUES (6, 6, 'xxxl', 38, 1);
INSERT INTO `product_warehouse` VALUES (12, 8, 'M', 4, 1);
INSERT INTO `product_warehouse` VALUES (13, 8, 'L', 5, 2);
INSERT INTO `product_warehouse` VALUES (14, 8, 'XXL', 4, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

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
INSERT INTO `sys_menu` VALUES (27, 0, '客户管理', 1, '/customer', NULL, NULL, 'User', 15, 1, '2025-05-24 11:40:43', '2025-05-24 15:58:42');
INSERT INTO `sys_menu` VALUES (28, 27, '客户列表', 2, '/customer/list', NULL, 'customer:list', NULL, 1, 1, '2025-05-24 11:40:43', '2025-05-24 12:52:26');
INSERT INTO `sys_menu` VALUES (29, 28, '新增客户', 3, NULL, NULL, 'customer:add', NULL, 2, 0, '2025-05-24 11:40:43', '2025-05-24 11:44:24');
INSERT INTO `sys_menu` VALUES (30, 28, '编辑客户', 3, NULL, NULL, 'customer:edit', NULL, 3, 0, '2025-05-24 11:40:43', '2025-05-24 11:44:37');
INSERT INTO `sys_menu` VALUES (31, 28, '删除客户', 3, NULL, NULL, 'customer:delete', NULL, 4, 0, '2025-05-24 11:40:43', '2025-05-24 11:44:45');
INSERT INTO `sys_menu` VALUES (33, 0, '商品管理', 1, '/product', '', '', 'Goods', 5, 1, '2025-05-24 15:56:53', '2025-05-24 15:57:15');
INSERT INTO `sys_menu` VALUES (34, 33, '商品分类', 2, '/product/category', '', 'productCategory:list', '', 2, 1, '2025-05-24 15:59:15', '2025-05-24 16:38:00');
INSERT INTO `sys_menu` VALUES (35, 34, '新增商品分类', 3, '', '', 'productCategory:add', '', 1, 0, '2025-05-24 16:00:16', '2025-05-24 16:01:01');
INSERT INTO `sys_menu` VALUES (36, 34, '修改商品分类', 3, '', '', 'productCategory:edit', '', 2, 0, '2025-05-24 16:00:57', '2025-05-24 16:01:04');
INSERT INTO `sys_menu` VALUES (37, 34, '删除商品分类', 3, '', '', 'productCategory:delete', '', 3, 0, '2025-05-24 16:01:25', '2025-05-24 16:39:30');
INSERT INTO `sys_menu` VALUES (38, 33, '商品列表', 2, '/product/list', '', 'productCategory:list', '', 1, 1, '2025-05-24 16:37:54', NULL);
INSERT INTO `sys_menu` VALUES (39, 38, '新增商品', 3, '', '', 'product:add', '', 1, 0, '2025-05-24 16:38:27', '2025-05-26 10:50:04');
INSERT INTO `sys_menu` VALUES (40, 38, '修改商品', 3, '', '', 'product:edit', '', 2, 0, '2025-05-24 16:38:51', '2025-05-26 10:50:38');
INSERT INTO `sys_menu` VALUES (41, 38, '删除商品', 3, '', '', 'product:delete', '', 3, 0, '2025-05-24 16:39:11', '2025-05-26 10:52:21');
INSERT INTO `sys_menu` VALUES (42, 0, '仓库管理', 1, '/warehouse', '', '', 'House', 20, 1, '2025-05-25 16:24:16', NULL);
INSERT INTO `sys_menu` VALUES (43, 42, '仓库列表', 2, '/warehouse/list', '', 'warehouse:list', '', 1, 1, '2025-05-25 16:25:45', '2025-05-25 16:25:58');
INSERT INTO `sys_menu` VALUES (44, 43, '新增仓库', 3, '', '', 'warehouse:add', '', 2, 0, '2025-05-25 16:26:25', NULL);
INSERT INTO `sys_menu` VALUES (45, 43, '更新仓库', 3, '', '', 'warehouse:edit', '', 3, 0, '2025-05-25 16:26:55', '2025-05-25 16:27:01');
INSERT INTO `sys_menu` VALUES (46, 43, '删除仓库', 3, '', '', 'warehouse:delete', '', 4, 0, '2025-05-25 16:27:21', NULL);
INSERT INTO `sys_menu` VALUES (47, 42, '库存管理', 2, '/warehouse/inventory', '', '', '', 2, 1, '2025-05-25 18:38:41', '2025-05-25 18:38:51');
INSERT INTO `sys_menu` VALUES (48, 47, '库存列表', 3, '', '', 'inventory:list', '', 1, 0, '2025-05-25 18:39:33', NULL);
INSERT INTO `sys_menu` VALUES (49, 47, '新增库存', 3, '', '', 'inventory:add', '', 2, 0, '2025-05-25 18:40:19', NULL);
INSERT INTO `sys_menu` VALUES (50, 47, '更新库存', 3, '', '', 'inventory:update', '', 3, 0, '2025-05-25 18:40:43', NULL);
INSERT INTO `sys_menu` VALUES (51, 47, '删除库存', 3, '', '', 'inventory:delete', '', 4, 0, '2025-05-25 18:41:02', NULL);
INSERT INTO `sys_menu` VALUES (52, 33, '商品统计', 2, '/product/statistics', '', 'product:view', '', 3, 1, '2025-05-26 10:51:36', '2025-05-26 11:00:36');
INSERT INTO `sys_menu` VALUES (53, 27, '客户分析', 2, '/customer/analysis', '', 'customer:list', '', 2, 1, '2025-05-26 15:29:44', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 72 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '操作日志表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 319 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin COMMENT = '角色菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (294, 1, 1);
INSERT INTO `sys_role_menu` VALUES (295, 1, 2);
INSERT INTO `sys_role_menu` VALUES (296, 1, 3);
INSERT INTO `sys_role_menu` VALUES (297, 1, 4);
INSERT INTO `sys_role_menu` VALUES (298, 1, 5);
INSERT INTO `sys_role_menu` VALUES (299, 1, 6);
INSERT INTO `sys_role_menu` VALUES (300, 1, 7);
INSERT INTO `sys_role_menu` VALUES (301, 1, 8);
INSERT INTO `sys_role_menu` VALUES (302, 1, 9);
INSERT INTO `sys_role_menu` VALUES (303, 1, 10);
INSERT INTO `sys_role_menu` VALUES (304, 1, 11);
INSERT INTO `sys_role_menu` VALUES (305, 1, 12);
INSERT INTO `sys_role_menu` VALUES (306, 1, 13);
INSERT INTO `sys_role_menu` VALUES (307, 1, 14);
INSERT INTO `sys_role_menu` VALUES (308, 1, 15);
INSERT INTO `sys_role_menu` VALUES (309, 1, 16);
INSERT INTO `sys_role_menu` VALUES (310, 1, 17);
INSERT INTO `sys_role_menu` VALUES (311, 1, 18);
INSERT INTO `sys_role_menu` VALUES (312, 1, 19);
INSERT INTO `sys_role_menu` VALUES (313, 1, 20);
INSERT INTO `sys_role_menu` VALUES (314, 1, 21);
INSERT INTO `sys_role_menu` VALUES (315, 1, 22);
INSERT INTO `sys_role_menu` VALUES (316, 1, 23);
INSERT INTO `sys_role_menu` VALUES (317, 1, 24);
INSERT INTO `sys_role_menu` VALUES (318, 1, 25);
INSERT INTO `sys_role_menu` VALUES (268, 1, 26);
INSERT INTO `sys_role_menu` VALUES (279, 1, 27);
INSERT INTO `sys_role_menu` VALUES (280, 1, 28);
INSERT INTO `sys_role_menu` VALUES (281, 1, 29);
INSERT INTO `sys_role_menu` VALUES (282, 1, 30);
INSERT INTO `sys_role_menu` VALUES (283, 1, 31);
INSERT INTO `sys_role_menu` VALUES (269, 1, 33);
INSERT INTO `sys_role_menu` VALUES (274, 1, 34);
INSERT INTO `sys_role_menu` VALUES (275, 1, 35);
INSERT INTO `sys_role_menu` VALUES (276, 1, 36);
INSERT INTO `sys_role_menu` VALUES (277, 1, 37);
INSERT INTO `sys_role_menu` VALUES (270, 1, 38);
INSERT INTO `sys_role_menu` VALUES (271, 1, 39);
INSERT INTO `sys_role_menu` VALUES (272, 1, 40);
INSERT INTO `sys_role_menu` VALUES (273, 1, 41);
INSERT INTO `sys_role_menu` VALUES (284, 1, 42);
INSERT INTO `sys_role_menu` VALUES (285, 1, 43);
INSERT INTO `sys_role_menu` VALUES (286, 1, 44);
INSERT INTO `sys_role_menu` VALUES (287, 1, 45);
INSERT INTO `sys_role_menu` VALUES (288, 1, 46);
INSERT INTO `sys_role_menu` VALUES (289, 1, 47);
INSERT INTO `sys_role_menu` VALUES (290, 1, 48);
INSERT INTO `sys_role_menu` VALUES (291, 1, 49);
INSERT INTO `sys_role_menu` VALUES (292, 1, 50);
INSERT INTO `sys_role_menu` VALUES (293, 1, 51);
INSERT INTO `sys_role_menu` VALUES (278, 1, 52);
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
INSERT INTO `sys_user` VALUES (1, 'admin', '$2b$10$gGD6U4DSjGV76WSmReFURekr6RcfIPPq2Es64/b5c7jRmhrN93PfS', '汪义强', NULL, '3467520359@qq.com', '19360256621', 5, 1, '', '2025-05-26 15:05:41', '2025-05-22 14:52:33', '2025-05-24 10:41:36');
INSERT INTO `sys_user` VALUES (2, 'zhang', '$2b$10$Dcq3Sz61PwUauTTsSKPJSeA0Ck4FNdK7TN3vw4IdHRhSaW1nWqlM2', '张昕', NULL, 'wangyiqiang59@gmail.com', '18555444800', 1, 1, NULL, '2025-05-26 15:03:19', '2025-05-23 17:43:44', '2025-05-23 18:44:12');

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

-- ----------------------------
-- Table structure for warehouse
-- ----------------------------
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse`  (
  `warehouse_id` bigint NOT NULL AUTO_INCREMENT COMMENT '仓库ID',
  `warehouse_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '仓库名称',
  `warehouse_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '仓库地址',
  `warehouse_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '仓库状态（0启用、1禁用）',
  `warehouse_type` int NOT NULL DEFAULT 0 COMMENT '仓库类型（0本地仓、1海外仓、2边境仓、3平台仓）',
  `product_quantity` int NULL DEFAULT 0 COMMENT '仓库产品数量',
  `warehouse_manager` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '仓库主管',
  `contact_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '联系电话',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`warehouse_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '仓库表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of warehouse
-- ----------------------------
INSERT INTO `warehouse` VALUES (1, '庄哥仓（美西）', '8042 Whitmore St, Rosemead, CA 91770', '0', 1, 0, '庄哥', '8052801201', '收件人：Liangliang Zhuang \n电话：8052801201');
INSERT INTO `warehouse` VALUES (2, 'Nick xu海外仓（美西）', 'Nick xu 4695885276 1656 W Orange Grove Ave，pomona，CA，91768', '0', 0, 0, '🍫🥩阿南_', '4695885276', NULL);

SET FOREIGN_KEY_CHECKS = 1;
