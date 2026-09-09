import { Router, type IRouter } from "express";
import {
  CreateCategoryBody,
  CreateCustomerBody,
  CreateProductBody,
  CreateSupplierBody,
  GetProductParams,
  ListProductsQueryParams,
  UpdateProductBody,
  UpdateProductParams,
} from "@workspace/api-zod";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
};

type Movement = {
  id: number;
  product: string;
  type: "Purchase" | "Sale" | "Adjustment" | "Return";
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  user: string;
  date: string;
};

const now = new Date();
const day = (offset: number) => {
  const value = new Date(now);
  value.setDate(value.getDate() - offset);
  return value.toISOString();
};

const products: Product[] = [
  {
    id: 1,
    name: "Logitech M185 Wireless Mouse",
    sku: "LOG-M185",
    category: "Computer Accessories",
    supplier: "TechSource Distributors",
    purchasePrice: 740,
    sellingPrice: 999,
    stock: 42,
    minStock: 15,
    status: "In Stock",
    lastUpdated: day(1),
  },
  {
    id: 2,
    name: "HP USB Keyboard K150",
    sku: "HP-K150",
    category: "Computer Accessories",
    supplier: "Digital Hub Suppliers",
    purchasePrice: 580,
    sellingPrice: 799,
    stock: 8,
    minStock: 12,
    status: "Low Stock",
    lastUpdated: day(0),
  },
  {
    id: 3,
    name: 'Dell 24" Professional Monitor',
    sku: "DEL-P2422H",
    category: "Monitors",
    supplier: "Prime Electronics",
    purchasePrice: 13200,
    sellingPrice: 16999,
    stock: 17,
    minStock: 5,
    status: "In Stock",
    lastUpdated: day(4),
  },
  {
    id: 4,
    name: "TP-Link Archer C6 Wi-Fi Router",
    sku: "TPL-C6",
    category: "Networking",
    supplier: "Prime Electronics",
    purchasePrice: 2150,
    sellingPrice: 2999,
    stock: 3,
    minStock: 8,
    status: "Low Stock",
    lastUpdated: day(2),
  },
  {
    id: 5,
    name: "SanDisk Ultra 128GB USB Drive",
    sku: "SDK-U128",
    category: "Storage",
    supplier: "OfficeTech India",
    purchasePrice: 780,
    sellingPrice: 1099,
    stock: 0,
    minStock: 10,
    status: "Out of Stock",
    lastUpdated: day(3),
  },
  {
    id: 6,
    name: "AmazonBasics HDMI Cable 2m",
    sku: "HDMI-2M",
    category: "Cables & Adapters",
    supplier: "Digital Hub Suppliers",
    purchasePrice: 290,
    sellingPrice: 449,
    stock: 64,
    minStock: 20,
    status: "In Stock",
    lastUpdated: day(6),
  },
  {
    id: 7,
    name: "Canon 925 Black Ink Cartridge",
    sku: "CAN-925BK",
    category: "Office Supplies",
    supplier: "OfficeTech India",
    purchasePrice: 1240,
    sellingPrice: 1649,
    stock: 11,
    minStock: 8,
    status: "In Stock",
    lastUpdated: day(5),
  },
  {
    id: 8,
    name: "Portronics My Buddy Laptop Stand",
    sku: "PTR-BUDDY",
    category: "Office Supplies",
    supplier: "TechSource Distributors",
    purchasePrice: 890,
    sellingPrice: 1299,
    stock: 6,
    minStock: 8,
    status: "Low Stock",
    lastUpdated: day(1),
  },
];

const categories = [
  { id: 1, name: "Computer Accessories", description: "Keyboards, mice and desk peripherals.", productCount: 2 },
  { id: 2, name: "Monitors", description: "Displays for home and office setups.", productCount: 1 },
  { id: 3, name: "Networking", description: "Routers, switches and connectivity equipment.", productCount: 1 },
  { id: 4, name: "Storage", description: "Portable and internal storage devices.", productCount: 1 },
  { id: 5, name: "Cables & Adapters", description: "Everyday cables and signal adapters.", productCount: 1 },
  { id: 6, name: "Office Supplies", description: "Printing and workspace essentials.", productCount: 2 },
];

const suppliers = [
  { id: 1, name: "TechSource Distributors", contact: "Ankit Mehra", phone: "+91 98765 43210", email: "ankit@techsource.in", location: "Nehru Place, New Delhi", productCount: 2 },
  { id: 2, name: "Digital Hub Suppliers", contact: "Priya Shah", phone: "+91 98201 11882", email: "orders@digitalhub.in", location: "Lamington Road, Mumbai", productCount: 2 },
  { id: 3, name: "Prime Electronics", contact: "Rakesh Kumar", phone: "+91 98450 22041", email: "sales@prime-electronics.in", location: "SP Road, Bengaluru", productCount: 2 },
  { id: 4, name: "OfficeTech India", contact: "Neha Iyer", phone: "+91 98404 78122", email: "hello@officetech.in", location: "Ritchie Street, Chennai", productCount: 2 },
];

const customers = [
  { id: 1, name: "Rahul Enterprises", phone: "+91 98100 71222", email: "accounts@rahulenterprises.in", location: "Gurugram, Haryana", orderCount: 14 },
  { id: 2, name: "Sharma Computers", phone: "+91 98210 46780", email: "purchase@sharmacomputers.in", location: "Pune, Maharashtra", orderCount: 9 },
  { id: 3, name: "City Office Solutions", phone: "+91 99002 11554", email: "admin@cityoffice.in", location: "Bengaluru, Karnataka", orderCount: 7 },
  { id: 4, name: "Kumar Electronics", phone: "+91 98867 09881", email: "kumar.electronics@gmail.com", location: "Hyderabad, Telangana", orderCount: 4 },
];

const movements: Movement[] = [
  { id: 1, product: "HP USB Keyboard K150", type: "Sale", quantity: 4, previousStock: 12, newStock: 8, reference: "SAL-2026-041", user: "Arjun Mehta", date: day(0) },
  { id: 2, product: "Logitech M185 Wireless Mouse", type: "Purchase", quantity: 20, previousStock: 22, newStock: 42, reference: "PUR-2026-018", user: "Arjun Mehta", date: day(1) },
  { id: 3, product: "TP-Link Archer C6 Wi-Fi Router", type: "Sale", quantity: 2, previousStock: 5, newStock: 3, reference: "SAL-2026-040", user: "Arjun Mehta", date: day(2) },
  { id: 4, product: "SanDisk Ultra 128GB USB Drive", type: "Adjustment", quantity: -2, previousStock: 2, newStock: 0, reference: "ADJ-2026-006", user: "Arjun Mehta", date: day(3) },
  { id: 5, product: 'Dell 24" Professional Monitor', type: "Purchase", quantity: 6, previousStock: 11, newStock: 17, reference: "PUR-2026-017", user: "Arjun Mehta", date: day(4) },
  { id: 6, product: "Canon 925 Black Ink Cartridge", type: "Sale", quantity: 3, previousStock: 14, newStock: 11, reference: "SAL-2026-036", user: "Arjun Mehta", date: day(5) },
];

const refreshStatus = (product: Product) => {
  product.status = product.stock === 0 ? "Out of Stock" : product.stock <= product.minStock ? "Low Stock" : "In Stock";
  product.lastUpdated = new Date().toISOString();
};

const dashboard = () => {
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock);
  const categoryStock = categories.map((category) => ({
    label: category.name,
    value: products.filter((product) => product.category === category.name).reduce((sum, product) => sum + product.stock, 0),
  })).filter((item) => item.value > 0);
  return {
    stats: {
      products: products.length,
      categories: categories.length,
      suppliers: suppliers.length,
      stockValue: products.reduce((sum, product) => sum + product.stock * product.purchasePrice, 0),
      lowStock: lowStockProducts.filter((product) => product.stock > 0).length,
      outOfStock: lowStockProducts.filter((product) => product.stock === 0).length,
    },
    categoryStock,
    recentMovements: movements.slice(0, 6),
    lowStockProducts,
  };
};

const router: IRouter = Router();

router.get("/dashboard", (_req, res) => res.json(dashboard()));

router.get("/products", (req, res) => {
  const query = ListProductsQueryParams.safeParse(req.query);
  const { search = "", category = "", status = "all" } = query.success ? query.data : {};
  const normalized = search.toLowerCase();
  const filtered = products.filter((product) => {
    const matchesSearch = !normalized || product.name.toLowerCase().includes(normalized) || product.sku.toLowerCase().includes(normalized);
    const matchesCategory = !category || category === "all" || product.category === category;
    const matchesStatus = status === "all" || (status === "in_stock" && product.status === "In Stock") || (status === "low_stock" && product.status === "Low Stock") || (status === "out_of_stock" && product.status === "Out of Stock");
    return matchesSearch && matchesCategory && matchesStatus;
  });
  res.json(filtered);
});

router.post("/products", (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please check the product fields and try again." });
  if (products.some((product) => product.sku.toLowerCase() === parsed.data.sku.toLowerCase())) return res.status(409).json({ error: "That SKU is already in use." });
  const product: Product = { id: Math.max(...products.map((item) => item.id)) + 1, ...parsed.data, status: "In Stock", lastUpdated: new Date().toISOString() };
  refreshStatus(product);
  products.unshift(product);
  return res.status(201).json(product);
});

router.get("/products/:id", (req, res) => {
  const parsed = GetProductParams.safeParse(req.params);
  const product = parsed.success ? products.find((item) => item.id === parsed.data.id) : undefined;
  return product ? res.json(product) : res.status(404).json({ error: "Product not found." });
});

router.patch("/products/:id", (req, res) => {
  const params = UpdateProductParams.safeParse(req.params);
  const body = UpdateProductBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Please check the product fields and try again." });
  const product = products.find((item) => item.id === params.data.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  if (products.some((item) => item.id !== product.id && item.sku.toLowerCase() === body.data.sku.toLowerCase())) return res.status(409).json({ error: "That SKU is already in use." });
  Object.assign(product, body.data);
  refreshStatus(product);
  return res.json(product);
});

router.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((item) => item.id === id);
  if (index < 0) return res.status(404).json({ error: "Product not found." });
  products.splice(index, 1);
  return res.status(204).send();
});

router.get("/categories", (_req, res) => res.json(categories.map((category) => ({ ...category, productCount: products.filter((product) => product.category === category.name).length }))));
router.post("/categories", (req, res) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Category name is required." });
  const category = { id: Math.max(...categories.map((item) => item.id)) + 1, name: parsed.data.name, description: parsed.data.description ?? "", productCount: 0 };
  categories.push(category);
  return res.status(201).json(category);
});

router.get("/suppliers", (_req, res) => res.json(suppliers.map((supplier) => ({ ...supplier, productCount: products.filter((product) => product.supplier === supplier.name).length }))));
router.post("/suppliers", (req, res) => {
  const parsed = CreateSupplierBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please complete the supplier details." });
  const supplier = { id: Math.max(...suppliers.map((item) => item.id)) + 1, ...parsed.data, productCount: 0 };
  suppliers.push(supplier);
  return res.status(201).json(supplier);
});

router.get("/customers", (_req, res) => res.json(customers));
router.post("/customers", (req, res) => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please complete the customer details." });
  const customer = { id: Math.max(...customers.map((item) => item.id)) + 1, ...parsed.data, orderCount: 0 };
  customers.push(customer);
  return res.status(201).json(customer);
});

router.get("/movements", (_req, res) => res.json(movements));
router.get("/reports", (_req, res) => res.json({
  inventoryValue: products.reduce((sum, product) => sum + product.stock * product.purchasePrice, 0),
  totalStock: products.reduce((sum, product) => sum + product.stock, 0),
  salesTotal: 146580,
  purchaseTotal: 203420,
  topProducts: [
    { name: "Logitech M185 Wireless Mouse", units: 36, revenue: 35964 },
    { name: "HP USB Keyboard K150", units: 28, revenue: 22372 },
    { name: "AmazonBasics HDMI Cable 2m", units: 24, revenue: 10776 },
  ],
  supplierSpend: suppliers.map((supplier, index) => ({ name: supplier.name, amount: [65240, 48900, 71400, 17880][index] ?? 0 })),
}));

router.get("/insights", (_req, res) => res.json({
  queries: [
    { concept: "JOIN", title: "Products with their category and supplier", sql: "SELECT p.product_name, c.category_name, s.supplier_name FROM products p JOIN categories c ON p.category_id = c.category_id JOIN suppliers s ON p.supplier_id = s.supplier_id;", explanation: "Combines normalized tables without duplicating category or supplier details." },
    { concept: "GROUP BY", title: "Stock grouped by category", sql: "SELECT c.category_name, SUM(p.current_stock) AS total_stock FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name;", explanation: "Builds the category stock overview shown on the dashboard." },
    { concept: "WHERE", title: "Products that need reordering", sql: "SELECT * FROM products WHERE current_stock <= minimum_stock;", explanation: "Finds low-stock and out-of-stock items using a business rule." },
    { concept: "HAVING", title: "Categories with meaningful sales", sql: "SELECT category_id, SUM(total_price) FROM sale_items GROUP BY category_id HAVING SUM(total_price) > 10000;", explanation: "Filters grouped results after aggregation." },
    { concept: "SUBQUERY", title: "Products above average selling price", sql: "SELECT product_name, selling_price FROM products WHERE selling_price > (SELECT AVG(selling_price) FROM products);", explanation: "Uses a nested query to compare each product to the overall average." },
  ],
  relationships: [
    { from: "categories", to: "products", relationship: "1 to many" },
    { from: "suppliers", to: "products", relationship: "1 to many" },
    { from: "suppliers", to: "purchases", relationship: "1 to many" },
    { from: "products", to: "stock_movements", relationship: "1 to many" },
    { from: "customers", to: "sales", relationship: "1 to many" },
  ],
}));

export default router;