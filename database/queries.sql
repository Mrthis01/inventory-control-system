-- 1. JOIN: show products with their normalized category and supplier labels.
SELECT p.product_name, p.sku, c.category_name, s.supplier_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id;

-- 2. WHERE: identify products that need reordering.
SELECT product_name, current_stock, minimum_stock
FROM products
WHERE current_stock <= minimum_stock
ORDER BY current_stock ASC;

-- 3. SUM: calculate inventory value.
SELECT SUM(current_stock * purchase_price) AS total_inventory_value
FROM products;

-- 4. COUNT: count products by category.
SELECT c.category_name, COUNT(p.product_id) AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.category_id
GROUP BY c.category_name;

-- 5. GROUP BY: total stock by category.
SELECT c.category_name, SUM(p.current_stock) AS total_stock
FROM products p
JOIN categories c ON c.category_id = p.category_id
GROUP BY c.category_name
ORDER BY total_stock DESC;

-- 6. HAVING: categories whose sales cross a threshold.
SELECT p.category_id, SUM(si.total_price) AS category_sales
FROM sale_items si
JOIN products p ON p.product_id = si.product_id
GROUP BY p.category_id
HAVING SUM(si.total_price) > 10000;

-- 7. ORDER BY: top-selling products.
SELECT p.product_name, SUM(si.quantity) AS units_sold
FROM sale_items si
JOIN products p ON p.product_id = si.product_id
GROUP BY p.product_name
ORDER BY units_sold DESC;

-- 8. Subquery: products priced above the average selling price.
SELECT product_name, selling_price
FROM products
WHERE selling_price > (SELECT AVG(selling_price) FROM products);

-- 9. Supplier-wise purchase totals.
SELECT s.supplier_name, SUM(pi.total_cost) AS total_purchased
FROM purchase_items pi
JOIN purchases pu ON pu.purchase_id = pi.purchase_id
JOIN suppliers s ON s.supplier_id = pu.supplier_id
GROUP BY s.supplier_name;

-- 10. Products that have never appeared in a sale.
SELECT p.product_name
FROM products p
LEFT JOIN sale_items si ON si.product_id = p.product_id
WHERE si.sale_item_id IS NULL;