# Entity Relationship Diagram

```mermaid
erDiagram
  CATEGORIES ||--o{ PRODUCTS : contains
  SUPPLIERS ||--o{ PRODUCTS : supplies
  SUPPLIERS ||--o{ PURCHASES : receives
  PURCHASES ||--|{ PURCHASE_ITEMS : includes
  PRODUCTS ||--o{ PURCHASE_ITEMS : appears_in
  CUSTOMERS ||--o{ SALES : places
  SALES ||--|{ SALE_ITEMS : includes
  PRODUCTS ||--o{ SALE_ITEMS : appears_in
  PRODUCTS ||--o{ STOCK_MOVEMENTS : records
```

Categories and suppliers are kept in separate tables so a product stores foreign keys rather than repeated text. Purchases and sales use item tables because one transaction can include many products. Each stock change gets its own movement record for traceability.