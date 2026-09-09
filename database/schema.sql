-- Inventory Control System — normalized PostgreSQL schema
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(160) NOT NULL,
  contact_person VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(160) NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  email VARCHAR(160) NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(180) NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(category_id),
  supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id),
  purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
  selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0),
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  purchase_id SERIAL PRIMARY KEY,
  supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id),
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  created_by INTEGER
);

CREATE TABLE IF NOT EXISTS purchase_items (
  purchase_item_id SERIAL PRIMARY KEY,
  purchase_id INTEGER NOT NULL REFERENCES purchases(purchase_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
  total_cost NUMERIC(12, 2) NOT NULL CHECK (total_cost >= 0)
);

CREATE TABLE IF NOT EXISTS sales (
  sale_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id),
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  created_by INTEGER
);

CREATE TABLE IF NOT EXISTS sale_items (
  sale_item_id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(sale_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  movement_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL CHECK (previous_stock >= 0),
  new_stock INTEGER NOT NULL CHECK (new_stock >= 0),
  reference_id VARCHAR(80) NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_supplier_idx ON products(supplier_id);
CREATE INDEX IF NOT EXISTS movements_product_idx ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS movements_created_at_idx ON stock_movements(created_at);