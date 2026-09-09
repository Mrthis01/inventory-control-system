import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: serial("category_id").primaryKey(),
  name: text("category_name").notNull(),
  description: text("description").notNull().default(""),
}, (table) => ({
  nameUnique: uniqueIndex("categories_name_unique").on(table.name),
}));

export const suppliersTable = pgTable("suppliers", {
  id: serial("supplier_id").primaryKey(),
  name: text("supplier_name").notNull(),
  contact: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  location: text("address").notNull(),
});

export const customersTable = pgTable("customers", {
  id: serial("customer_id").primaryKey(),
  name: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  location: text("address").notNull(),
});

export const productsTable = pgTable("products", {
  id: serial("product_id").primaryKey(),
  name: text("product_name").notNull(),
  sku: text("sku").notNull(),
  category: text("category_name").notNull(),
  supplier: text("supplier_name").notNull(),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }).notNull(),
  sellingPrice: numeric("selling_price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("current_stock").notNull().default(0),
  minStock: integer("minimum_stock").notNull().default(0),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  skuUnique: uniqueIndex("products_sku_unique").on(table.sku),
}));

export const stockMovementsTable = pgTable("stock_movements", {
  id: serial("movement_id").primaryKey(),
  productId: integer("product_id").notNull(),
  movementType: text("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reference: text("reference").notNull(),
  reason: text("reason").notNull().default(""),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categoriesTable);
export const insertSupplierSchema = createInsertSchema(suppliersTable);
export const insertCustomerSchema = createInsertSchema(customersTable);
export const insertProductSchema = createInsertSchema(productsTable);
export const insertStockMovementSchema = createInsertSchema(stockMovementsTable);

export type Category = typeof categoriesTable.$inferSelect;
export type Supplier = typeof suppliersTable.$inferSelect;
export type Customer = typeof customersTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type StockMovement = typeof stockMovementsTable.$inferSelect;