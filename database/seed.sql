-- Run after schema.sql. Sample data is intentionally small and realistic.
INSERT INTO categories (category_name, description) VALUES
  ('Computer Accessories', 'Keyboards, mice and desk peripherals.'),
  ('Monitors', 'Displays for home and office setups.'),
  ('Networking', 'Routers, switches and connectivity equipment.'),
  ('Storage', 'Portable and internal storage devices.'),
  ('Cables & Adapters', 'Everyday cables and signal adapters.'),
  ('Office Supplies', 'Printing and workspace essentials.')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES
  ('TechSource Distributors', 'Ankit Mehra', '+91 98765 43210', 'ankit@techsource.in', 'Nehru Place, New Delhi'),
  ('Digital Hub Suppliers', 'Priya Shah', '+91 98201 11882', 'orders@digitalhub.in', 'Lamington Road, Mumbai'),
  ('Prime Electronics', 'Rakesh Kumar', '+91 98450 22041', 'sales@prime-electronics.in', 'SP Road, Bengaluru'),
  ('OfficeTech India', 'Neha Iyer', '+91 98404 78122', 'hello@officetech.in', 'Ritchie Street, Chennai');

INSERT INTO products (product_name, sku, category_id, supplier_id, purchase_price, selling_price, current_stock, minimum_stock, description)
SELECT 'Logitech M185 Wireless Mouse', 'LOG-M185', c.category_id, s.supplier_id, 740, 999, 42, 15, 'Reliable wireless mouse for everyday work.'
FROM categories c, suppliers s WHERE c.category_name = 'Computer Accessories' AND s.supplier_name = 'TechSource Distributors'
ON CONFLICT (sku) DO NOTHING;