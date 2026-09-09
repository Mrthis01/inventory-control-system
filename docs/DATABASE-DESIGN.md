# Database Design Notes

## Objective

Inventory Control System keeps products, suppliers, customers, purchases, sales, and stock history in a small relational model that a store manager can use every day.

## Main entities

- `categories` describes product groups.
- `suppliers` stores vendor contact details.
- `customers` stores buyer details.
- `products` stores prices, stock, SKU, and foreign-key relationships.
- `purchases` and `purchase_items` record incoming inventory.
- `sales` and `sale_items` record outgoing inventory.
- `stock_movements` provides an audit trail for every stock change.

## Normalization

The design follows 3NF for the core business data: category and supplier names are not copied into every transaction, one purchase or sale can contain many item rows, and calculated totals are derived from quantity and unit price.

## Transactions

A purchase should run as one transaction: insert purchase, insert purchase item, update product stock, insert movement, then commit. A sale follows the same pattern after checking available stock. Any failure rolls the transaction back so the stock and transaction tables cannot disagree.

## Constraints

SKUs are unique, numeric prices and quantities cannot be negative, stock movements cannot create negative stock, and foreign keys keep products and transaction items attached to valid records.