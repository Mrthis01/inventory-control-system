# Inventory Control System

An approachable inventory management application made for a DBMS semester project. It gives a small electronics business one place to track products, stock levels, suppliers, customers, purchases, sales, and the database ideas behind the system.

## Features

- Dashboard with stock value, low-stock alerts, category totals, and movement history
- Product CRUD with SKU uniqueness, search, category/status filtering, and stock status rules
- Categories, suppliers, and customers
- Stock movement history
- Inventory, sales, purchase, and supplier reports
- Database Insights page with JOIN, GROUP BY, SUM, COUNT, WHERE, HAVING, ORDER BY, and subquery examples
- PostgreSQL schema, seed data, useful SQL queries, and Mermaid ER diagram

## Tech stack

- React, Vite, TypeScript, Tailwind CSS, Lucide icons
- Node.js, Express, OpenAPI code generation
- PostgreSQL with Drizzle ORM
- pnpm workspaces

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/api-server run dev
```

The workspace workflows run the API and frontend together in Replit.

## Database setup

The project uses the PostgreSQL database provided by Replit. For a local database, copy `.env.example` to `.env`, set `DATABASE_URL`, and run `database/schema.sql` followed by `database/seed.sql`. The teaching/reference SQL is in `database/queries.sql`.

## DBMS concepts demonstrated

Relational schema, primary keys, foreign keys, unique and check constraints, normalization, CRUD, joins, aggregation, ordering, filtering, subqueries, transactions, and inventory calculations.

## Future improvements

Add Clerk-based login, transaction-backed purchase and sales forms, role permissions, CSV export, and an immutable audit log backed by the PostgreSQL schema.