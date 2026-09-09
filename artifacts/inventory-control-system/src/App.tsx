import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation, useRoute } from 'wouter';
import {
  AlertTriangle,
  Boxes,
  Check,
  ChevronRight,
  Database,
  Edit3,
  FileBarChart,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Trash2,
  Truck,
  Users,
  X,
} from 'lucide-react';
import {
  getGetDashboardQueryKey,
  getGetProductQueryKey,
  getListCategoriesQueryKey,
  getListCustomersQueryKey,
  getListProductsQueryKey,
  getListSuppliersQueryKey,
  useCreateCategory,
  useCreateCustomer,
  useCreateProduct,
  useCreateSupplier,
  useDeleteProduct,
  useGetDashboard,
  useGetDatabaseInsights,
  useGetProduct,
  useGetReports,
  useListCategories,
  useListCustomers,
  useListMovements,
  useListProducts,
  useListSuppliers,
  useUpdateProduct,
} from '@workspace/api-client-react';
import type { Category, Customer, Product, ProductInput, Supplier } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Boxes },
  { href: '/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/movements', label: 'Stock movements', icon: RefreshCw },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/insights', label: 'DBMS insights', icon: Database },
];

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = navItems.find((item) => location.startsWith(item.href));
  return (
    <div className="app-shell flex">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[244px] shrink-0 flex-col bg-sidebar transition-transform md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid h-9 w-9 place-items-center bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">IC</span>
            <span>
              <span className="block text-[13px] font-bold tracking-[0.08em] text-sidebar-foreground">INVENTORY</span>
              <span className="block font-mono text-[9px] tracking-[0.2em] text-sidebar-foreground/55">CONTROL SYSTEM</span>
            </span>
          </Link>
          <button className="ml-auto text-sidebar-foreground/60 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
        </div>
        <div className="px-4 pt-7">
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.17em] text-sidebar-foreground/45">Workspace</p>
          <nav className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`sidebar-link text-[13px] ${location === href || (href !== '/dashboard' && location.startsWith(href)) ? 'active' : ''}`} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon size={16} strokeWidth={1.7} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 border-t border-sidebar-border pt-4">
            <Link href="/settings" className={`sidebar-link ${location === '/settings' ? 'active' : ''}`} data-testid="link-nav-settings"><SettingsIcon size={16} strokeWidth={1.7} /><span>Settings</span></Link>
          </div>
          <div className="border border-sidebar-border bg-sidebar-accent/50 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-sidebar-foreground/45">Current workspace</p>
            <p className="mt-1 text-xs font-medium text-sidebar-foreground">Sharma Electronics</p>
            <p className="mt-1 text-[11px] text-sidebar-foreground/55">Pune · Demo account</p>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" data-testid="button-overlay-close" />}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur md:px-9">
          <div className="flex items-center gap-3">
            <button className="text-foreground md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button>
            <div>
              <p className="eyebrow">{current?.label ?? 'Workspace'}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Operations console / Tuesday, 18 June 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 bg-status-good" /> SYSTEM ONLINE</span>
            <div className="grid h-8 w-8 place-items-center bg-primary text-[11px] font-bold text-primary-foreground">AM</div>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-5 md:p-9">{children}</div>
      </main>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
    <div><p className="eyebrow mb-2">{eyebrow}</p><h1 className="font-serif text-[31px] leading-none text-foreground">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}</div>
    {action}
  </div>;
}

function Button({ children, variant = 'primary', className = '', ...props }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = { primary: 'bg-primary text-primary-foreground hover:bg-primary/90', secondary: 'border border-border bg-card text-foreground hover:bg-muted', quiet: 'text-muted-foreground hover:bg-muted hover:text-foreground', danger: 'border border-destructive/25 bg-destructive/5 text-destructive hover:bg-destructive/10' };
  return <button className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'In Stock' || status === 'Purchase' || status === 'Active' ? 'good' : status === 'Low Stock' || status === 'Adjustment' ? 'warn' : 'bad';
  return <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] status-${tone}`} data-testid={`status-${status.toLowerCase().replaceAll(' ', '-')}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function Metric({ label, value, note, tone = 'blue' }: { label: string; value: string | number; note?: string; tone?: 'blue' | 'amber' | 'red' | 'green' }) {
  return <div className="panel relative overflow-hidden p-5"><div className={`absolute left-0 top-0 h-full w-1 metric-${tone}`} /><p className="eyebrow">{label}</p><p className="mt-3 font-mono text-[27px] font-medium tracking-[-0.06em] text-foreground">{value}</p>{note && <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>}</div>;
}

function LoadingGrid({ rows = 5 }: { rows?: number }) {
  return <div className="space-y-2" aria-label="Loading"><div className="skeleton h-10 w-full" />{Array.from({ length: rows }).map((_, i) => <div className="skeleton h-12 w-full" key={i} />)}</div>;
}

function QueryState({ loading, error, empty, onRetry, children }: { loading?: boolean; error?: boolean; empty?: boolean; onRetry?: () => void; children: ReactNode }) {
  if (loading) return <LoadingGrid />;
  if (error) return <div className="panel flex flex-col items-center justify-center p-12 text-center"><AlertTriangle className="mb-3 text-status-bad" size={22} /><p className="font-semibold">The record could not be loaded</p><p className="mt-1 text-sm text-muted-foreground">Check the API server and try again.</p><Button className="mt-4" variant="secondary" onClick={onRetry} data-testid="button-retry"><RefreshCw size={14} />Retry</Button></div>;
  if (empty) return <div className="panel flex flex-col items-center justify-center p-12 text-center"><Boxes className="mb-3 text-muted-foreground" size={25} /><p className="font-semibold">Nothing here yet</p><p className="mt-1 text-sm text-muted-foreground">Create the first record to start building your control room.</p></div>;
  return <>{children}</>;
}

function DashboardPage() {
  const { data, isLoading, isError, refetch } = useGetDashboard();
  const stats = data?.stats;
  return <><PageHeader eyebrow="01 / Inventory overview" title="Good morning, Anil." description="A clear read on stock health before the day's first shipment." action={<Link href="/products" className="inline-flex items-center gap-2 bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground" data-testid="link-view-products">View product register <ChevronRight size={14} /></Link>} />
    <QueryState loading={isLoading} error={isError} onRetry={() => refetch()}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Products" value={stats?.products ?? 0} note="items in register" />
        <Metric label="Total stock value" value={`₹${(stats?.stockValue ?? 0).toLocaleString('en-IN')}`} note="at purchase price" tone="green" />
        <Metric label="Low stock" value={stats?.lowStock ?? 0} note="needs attention" tone="amber" />
        <Metric label="Out of stock" value={stats?.outOfStock ?? 0} note="currently unavailable" tone="red" />
        <Metric label="Suppliers" value={stats?.suppliers ?? 0} note={`${stats?.categories ?? 0} active categories`} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-5"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Stock by category</p><h2 className="mt-1 text-base font-semibold">Where inventory sits</h2></div><Link href="/reports" className="text-xs font-semibold text-primary" data-testid="link-category-report">Full report <ChevronRight className="inline" size={13} /></Link></div>
          <div className="space-y-4">{(data?.categoryStock ?? []).map((item, i) => { const max = Math.max(...(data?.categoryStock ?? []).map((x) => x.value), 1); return <div key={item.label} data-testid={`row-category-stock-${i}`}><div className="mb-1.5 flex justify-between text-xs"><span>{item.label}</span><span className="font-mono text-muted-foreground">{item.value} units</span></div><div className="h-2 bg-muted"><div className="h-2 bg-primary" style={{ width: `${(item.value / max) * 100}%` }} /></div></div>; })}</div>
        </section>
        <section className="panel p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Attention needed</p><h2 className="mt-1 text-base font-semibold">Low stock products</h2></div><Link href="/products?status=low" className="text-xs font-semibold text-primary" data-testid="link-low-stock">View all <ChevronRight className="inline" size={13} /></Link></div>
          <div className="divide-y divide-border">{(data?.lowStockProducts ?? []).slice(0, 5).map((product) => <div className="flex items-center justify-between py-3" key={product.id} data-testid={`row-low-stock-${product.id}`}><div><p className="text-sm font-medium">{product.name}</p><p className="font-mono text-[10px] text-muted-foreground">{product.sku}</p></div><div className="text-right"><p className="font-mono text-sm text-status-warn">{product.stock} / {product.minStock}</p><p className="text-[10px] text-muted-foreground">units / minimum</p></div></div>)}{!data?.lowStockProducts?.length && <p className="py-8 text-center text-sm text-muted-foreground">All shelves are above minimum.</p>}</div>
        </section>
      </div>
      <section className="panel mt-5 overflow-hidden"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="eyebrow">Latest activity</p><h2 className="mt-1 text-base font-semibold">Recent stock movements</h2></div><Link href="/movements" className="text-xs font-semibold text-primary" data-testid="link-movements">Movement history <ChevronRight className="inline" size={13} /></Link></div><MovementTable movements={data?.recentMovements ?? []} compact /></section>
    </QueryState>
  </>;
}

function MovementTable({ movements, compact = false }: { movements: any[]; compact?: boolean }) {
  return <div className="overflow-x-auto"><table className="data-table w-full min-w-[720px] text-sm"><thead><tr><th>Product</th><th>Movement</th><th>Quantity</th><th>Stock after</th><th>Reference</th><th>Date</th></tr></thead><tbody>{movements.slice(0, compact ? 6 : undefined).map((movement) => <tr key={movement.id} data-testid={`row-movement-${movement.id}`}><td><p className="font-medium">{movement.product}</p><p className="font-mono text-[10px] text-muted-foreground">{movement.user}</p></td><td><StatusBadge status={movement.type} /></td><td className="font-mono">{movement.type === 'Sale' ? '-' : '+'}{movement.quantity}</td><td className="font-mono">{movement.newStock}</td><td className="font-mono text-xs text-muted-foreground">{movement.reference}</td><td className="text-xs text-muted-foreground">{new Date(movement.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td></tr>)}</tbody></table>{movements.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">No movements recorded.</p>}</div>;
}

function ProductForm({ initial, onDone, onCancel, onMessage }: { initial?: Product; onDone: () => void; onCancel: () => void; onMessage: (message: string) => void }) {
  const client = useQueryClient();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const [form, setForm] = useState<ProductInput>({ name: initial?.name ?? '', sku: initial?.sku ?? '', category: initial?.category ?? '', supplier: initial?.supplier ?? '', purchasePrice: initial?.purchasePrice ?? 0, sellingPrice: initial?.sellingPrice ?? 0, stock: initial?.stock ?? 0, minStock: initial?.minStock ?? 0 });
  const set = (key: keyof ProductInput, value: string) => setForm((current) => ({ ...current, [key]: ['purchasePrice', 'sellingPrice', 'stock', 'minStock'].includes(key) ? Number(value) : value }));
  const submit = (event: FormEvent) => { event.preventDefault(); const action = initial ? update : create; const payload = initial ? { id: initial.id, data: form } : { data: form }; action.mutate(payload as never, { onSuccess: () => { client.invalidateQueries({ queryKey: getListProductsQueryKey() }); client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); if (initial) client.invalidateQueries({ queryKey: getGetProductQueryKey(initial.id) }); onMessage(initial ? 'Product updated successfully.' : 'Product added to register.'); onDone(); }, onError: () => onMessage('Could not save product. Check the fields and try again.') }); };
  const fields: Array<[keyof ProductInput, string, string]> = [['name', 'Product name', 'text'], ['sku', 'SKU / item code', 'text'], ['category', 'Category', 'text'], ['supplier', 'Supplier', 'text'], ['purchasePrice', 'Purchase price (₹)', 'number'], ['sellingPrice', 'Selling price (₹)', 'number'], ['stock', 'Current stock', 'number'], ['minStock', 'Minimum stock', 'number']];
  return <form onSubmit={submit} className="space-y-4">{fields.map(([key, label, type]) => <label className="block" key={key}><span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span><input required={['name', 'sku', 'category', 'supplier'].includes(key)} min={type === 'number' ? 0 : undefined} type={type} value={form[key] as string | number} onChange={(e) => set(key, e.target.value)} className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid={`input-product-${key}`} /></label>)}<div className="flex justify-end gap-2 border-t border-border pt-4"><Button type="button" variant="secondary" onClick={onCancel} data-testid="button-cancel-product">Cancel</Button><Button type="submit" disabled={create.isPending || update.isPending} data-testid="button-save-product">{create.isPending || update.isPending ? 'Saving…' : initial ? 'Save changes' : 'Add product'}</Button></div></form>;
}

function ProductModal({ product, onClose, onMessage }: { product?: Product; onClose: () => void; onMessage: (message: string) => void }) {
  const [match, params] = useRoute('/products/:id');
  const editingId = product?.id ?? (match ? Number(params?.id) : undefined);
  const { data: fetched } = useGetProduct(editingId ?? 0, { query: { enabled: !!editingId, queryKey: getGetProductQueryKey(editingId ?? 0) } });
  const active = product ?? fetched;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(219_29%_18%/.45)] p-4"><div className="max-h-[92vh] w-full max-w-xl overflow-y-auto bg-card p-6 shadow-xl" role="dialog" aria-modal="true"><div className="mb-5 flex items-start justify-between"><div><p className="eyebrow">{active ? 'Edit record' : 'New record'}</p><h2 className="mt-1 font-serif text-2xl">{active ? 'Update product' : 'Add a product'}</h2></div><button onClick={onClose} aria-label="Close product form" data-testid="button-close-product-form"><X size={19} /></button></div><ProductForm initial={active} onDone={onClose} onCancel={onClose} onMessage={onMessage} /></div></div>;
}

function ProductsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [modal, setModal] = useState<'new' | Product | null>(null);
  const [message, setMessage] = useState('');
  const client = useQueryClient();
  const { data, isLoading, isError, refetch } = useListProducts();
  const remove = useDeleteProduct();
  const products = useMemo(() => (data ?? []).filter((product) => `${product.name} ${product.sku} ${product.category} ${product.supplier}`.toLowerCase().includes(search.toLowerCase())).filter((product) => status === 'all' || (status === 'in_stock' ? product.status === 'In Stock' : status === 'low_stock' ? product.status === 'Low Stock' : product.status === 'Out of Stock')), [data, search, status]);
  const del = (product: Product) => { if (!window.confirm(`Delete ${product.name}? This only works when no records refer to it.`)) return; remove.mutate({ id: product.id }, { onSuccess: () => { client.invalidateQueries({ queryKey: getListProductsQueryKey() }); client.invalidateQueries({ queryKey: getGetDashboardQueryKey() }); setMessage('Product removed from register.'); }, onError: () => setMessage('Product could not be deleted because it is referenced by another record.') }); };
  return <><PageHeader eyebrow="02 / Product register" title="Products" description="Every item, price, and reorder threshold in one working register." action={<Button onClick={() => setModal('new')} data-testid="button-add-product"><Plus size={15} /> Add product</Button>} />
    {message && <div className="mb-5 flex items-center justify-between border border-status-good/25 bg-status-good/5 px-4 py-3 text-sm text-status-good" role="status" data-testid="status-product-message"><span className="flex items-center gap-2"><Check size={15} />{message}</span><button onClick={() => setMessage('')} data-testid="button-dismiss-product-message"><X size={15} /></button></div>}
    <div className="mb-4 flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, SKU, category, or supplier" className="h-9 w-full border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" data-testid="input-search-products" /></label><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 border border-input bg-card px-3 text-xs outline-none focus:border-primary" data-testid="select-product-status"><option value="all">All statuses</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option></select></div>
    <QueryState loading={isLoading} error={isError} empty={!products.length} onRetry={() => refetch()}><div className="panel overflow-x-auto"><table className="data-table w-full min-w-[1040px] text-sm"><thead><tr><th>Product</th><th>Category</th><th>Supplier</th><th>Purchase</th><th>Sell</th><th>Stock</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} data-testid={`row-product-${product.id}`}><td><p className="font-semibold">{product.name}</p><p className="font-mono text-[10px] text-muted-foreground">{product.sku}</p></td><td>{product.category}</td><td>{product.supplier}</td><td className="font-mono">₹{product.purchasePrice.toLocaleString('en-IN')}</td><td className="font-mono">₹{product.sellingPrice.toLocaleString('en-IN')}</td><td className="font-mono">{product.stock} <span className="text-[10px] text-muted-foreground">/ {product.minStock}</span></td><td><StatusBadge status={product.status} /></td><td><div className="flex justify-end gap-1"><button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setModal(product)} aria-label={`Edit ${product.name}`} data-testid={`button-edit-product-${product.id}`}><Edit3 size={15} /></button><button className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => del(product)} aria-label={`Delete ${product.name}`} data-testid={`button-delete-product-${product.id}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div></QueryState>
    {modal && <ProductModal product={typeof modal === 'object' ? modal : undefined} onClose={() => setModal(null)} onMessage={setMessage} />}
  </>;
}

function SimpleCreatePage({ kind }: { kind: 'categories' | 'suppliers' | 'customers' }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});
  const categoryQuery = useListCategories();
  const supplierQuery = useListSuppliers();
  const customerQuery = useListCustomers();
  const createCategory = useCreateCategory();
  const createSupplier = useCreateSupplier();
  const createCustomer = useCreateCustomer();
  const config = {
    categories: { title: 'Categories', eyebrow: '03 / Product taxonomy', description: 'Keep the product register easy to group, filter, and explain.', fields: [['name', 'Category name'], ['description', 'Description']] },
    suppliers: { title: 'Suppliers', eyebrow: '04 / Procurement partners', description: 'The people and businesses behind every incoming shipment.', fields: [['name', 'Supplier name'], ['contact', 'Primary contact'], ['phone', 'Phone'], ['email', 'Email'], ['location', 'Location']] },
    customers: { title: 'Customers', eyebrow: '05 / Sales relationships', description: 'A simple customer register for clean sales references.', fields: [['name', 'Customer name'], ['phone', 'Phone'], ['email', 'Email'], ['location', 'Location']] },
  }[kind];
  const list = kind === 'categories' ? categoryQuery.data ?? [] : kind === 'suppliers' ? supplierQuery.data ?? [] : customerQuery.data ?? [];
  const loading = kind === 'categories' ? categoryQuery.isLoading : kind === 'suppliers' ? supplierQuery.isLoading : customerQuery.isLoading;
  const error = kind === 'categories' ? categoryQuery.isError : kind === 'suppliers' ? supplierQuery.isError : customerQuery.isError;
  const submit = (event: FormEvent) => { event.preventDefault(); const action = kind === 'categories' ? createCategory : kind === 'suppliers' ? createSupplier : createCustomer; action.mutate({ data: form } as never, { onSuccess: () => { client.invalidateQueries({ queryKey: kind === 'categories' ? getListCategoriesQueryKey() : kind === 'suppliers' ? getListSuppliersQueryKey() : getListCustomersQueryKey() }); setOpen(false); setForm({}); setMessage(`${config.title.slice(0, -1)} created successfully.`); }, onError: () => setMessage(`Could not create ${kind.slice(0, -1)}. Please review the fields.`) }); };
  return <><PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} action={<Button onClick={() => setOpen(true)} data-testid={`button-add-${kind}`}><Plus size={15} /> Add {kind.slice(0, -1)}</Button>} />{message && <div className="mb-5 flex items-center gap-2 border border-status-good/25 bg-status-good/5 px-4 py-3 text-sm text-status-good" role="status" data-testid={`status-${kind}-message`}><Check size={15} />{message}</div>}<QueryState loading={loading} error={error} empty={!list.length}><div className={`grid gap-3 ${kind === 'categories' ? 'md:grid-cols-2 xl:grid-cols-3' : 'xl:grid-cols-2'}`}>{list.map((item: Category | Supplier | Customer) => <div className="panel p-5" key={item.id} data-testid={`card-${kind}-${item.id}`}><div className="flex items-start justify-between"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{'description' in item ? item.description || 'No description added.' : 'contact' in item ? item.contact : item.email}</p></div><span className="font-mono text-xs text-primary">{'productCount' in item ? `${item.productCount} products` : `${item.orderCount} orders`}</span></div>{'location' in item && <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground"><span>{item.location}</span><span>{item.phone}</span></div>}</div>)}</div></QueryState>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(219_29%_18%/.45)] p-4"><form onSubmit={submit} className="w-full max-w-lg bg-card p-6 shadow-xl"><div className="mb-5 flex items-start justify-between"><div><p className="eyebrow">New record</p><h2 className="mt-1 font-serif text-2xl">Add {kind.slice(0, -1)}</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close form" data-testid={`button-close-${kind}-form`}><X size={19} /></button></div><div className="grid gap-4 sm:grid-cols-2">{config.fields.map(([key, label]) => <label className={key === 'description' ? 'sm:col-span-2' : ''} key={key}><span className="mb-1.5 block text-xs font-semibold">{label}</span>{key === 'description' ? <textarea rows={3} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid={`input-${kind}-${key}`} /> : <input required={key === 'name'} type={key === 'email' ? 'email' : 'text'} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid={`input-${kind}-${key}`} />}</label>)}</div><div className="mt-6 flex justify-end gap-2 border-t border-border pt-4"><Button type="button" variant="secondary" onClick={() => setOpen(false)} data-testid={`button-cancel-${kind}`}>Cancel</Button><Button type="submit" disabled={createCategory.isPending || createSupplier.isPending || createCustomer.isPending} data-testid={`button-save-${kind}`}>Create record</Button></div></form></div>}
  </>;
}

function MovementsPage() {
  const { data, isLoading, isError, refetch } = useListMovements();
  return <><PageHeader eyebrow="06 / Audit trail" title="Stock movements" description="A chronological record of what entered, left, or changed in the store." action={<div className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs text-muted-foreground"><RefreshCw size={14} /> Live register</div>} /><QueryState loading={isLoading} error={isError} empty={!data?.length} onRetry={() => refetch()}><section className="panel overflow-hidden"><MovementTable movements={data ?? []} /></section></QueryState></>;
}

function ReportsPage() {
  const { data, isLoading, isError, refetch } = useGetReports();
  const maxUnits = Math.max(...(data?.topProducts ?? []).map((item) => item.units), 1);
  return <><PageHeader eyebrow="07 / Business reporting" title="Reports" description="The numbers behind purchasing, stock value, and sales performance." action={<Button variant="secondary" onClick={() => window.print()} data-testid="button-print-report"><FileBarChart size={15} /> Print report</Button>} /><QueryState loading={isLoading} error={isError} onRetry={() => refetch()}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Inventory value" value={`₹${(data?.inventoryValue ?? 0).toLocaleString('en-IN')}`} note="current purchase value" tone="green" /><Metric label="Total stock" value={data?.totalStock ?? 0} note="units across register" /><Metric label="Sales total" value={`₹${(data?.salesTotal ?? 0).toLocaleString('en-IN')}`} note="recorded sales" tone="blue" /><Metric label="Purchase total" value={`₹${(data?.purchaseTotal ?? 0).toLocaleString('en-IN')}`} note="recorded purchases" tone="amber" /></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="panel p-5"><p className="eyebrow">Top products</p><h2 className="mt-1 text-base font-semibold">Units moved</h2><div className="mt-5 space-y-4">{(data?.topProducts ?? []).map((item, i) => <div key={item.name} data-testid={`row-top-product-${i}`}><div className="mb-1.5 flex justify-between text-sm"><span>{item.name}</span><span className="font-mono text-xs text-muted-foreground">{item.units} units · ₹{item.revenue.toLocaleString('en-IN')}</span></div><div className="h-2 bg-muted"><div className="h-2 bg-primary" style={{ width: `${item.units / maxUnits * 100}%` }} /></div></div>)}</div></section><section className="panel p-5"><p className="eyebrow">Supplier spend</p><h2 className="mt-1 text-base font-semibold">Purchase value by partner</h2><div className="mt-5 divide-y divide-border">{(data?.supplierSpend ?? []).map((item, i) => <div className="flex items-center justify-between py-3" key={item.name} data-testid={`row-supplier-spend-${i}`}><span className="text-sm">{item.name}</span><span className="font-mono text-sm font-medium">₹{item.amount.toLocaleString('en-IN')}</span></div>)}</div></section></div></QueryState></>;
}

function InsightsPage() {
  const { data, isLoading, isError, refetch } = useGetDatabaseInsights();
  return <><PageHeader eyebrow="08 / Database notebook" title="DBMS insights" description="A practical map of how the inventory system's tables work together." action={<div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><Database size={14} /> Relational model</div>} /><QueryState loading={isLoading} error={isError} onRetry={() => refetch()}><div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]"><section className="panel p-5"><p className="eyebrow">Entity relationships</p><h2 className="mt-1 text-base font-semibold">How records connect</h2><div className="mt-6 space-y-3">{(data?.relationships ?? []).map((relationship, i) => <div className="border-l-2 border-primary/40 bg-muted/40 p-3" key={i} data-testid={`relationship-${i}`}><div className="flex items-center gap-2 font-mono text-xs"><span className="font-semibold text-primary">{relationship.from}</span><ChevronRight size={13} className="text-muted-foreground" /><span className="font-semibold">{relationship.to}</span></div><p className="mt-1 text-xs text-muted-foreground">{relationship.relationship}</p></div>)}</div></section><section className="space-y-3">{(data?.queries ?? []).map((query, i) => <details className="panel group" key={i} open={i === 0} data-testid={`card-sql-query-${i}`}><summary className="flex cursor-pointer list-none items-center justify-between p-5"><div><p className="eyebrow">{query.concept}</p><h2 className="mt-1 text-sm font-semibold">{query.title}</h2></div><ChevronRight size={16} className="transition-transform group-open:rotate-90" /></summary><div className="border-t border-border px-5 pb-5 pt-4"><pre className="overflow-x-auto bg-sidebar p-4 font-mono text-xs leading-6 text-sidebar-foreground"><code>{query.sql}</code></pre><p className="mt-3 text-sm leading-6 text-muted-foreground">{query.explanation}</p></div></details>)}</section></div></QueryState></>;
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [compact, setCompact] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSaved(true); };
  return <><PageHeader eyebrow="Workspace / Preferences" title="Settings" description="Demo account and application defaults for this semester project." /><form onSubmit={submit} className="max-w-3xl space-y-5"><section className="panel p-5"><p className="eyebrow">Demo account</p><h2 className="mt-1 text-base font-semibold">Store identity</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">Business name</span><input defaultValue="Sharma Electronics" className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid="input-settings-business" /></label><label><span className="mb-1.5 block text-xs font-semibold">Manager name</span><input defaultValue="Anil Sharma" className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid="input-settings-manager" /></label><label><span className="mb-1.5 block text-xs font-semibold">Store location</span><input defaultValue="Pune, Maharashtra" className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid="input-settings-location" /></label><label><span className="mb-1.5 block text-xs font-semibold">Currency</span><select defaultValue="INR" className="w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" data-testid="select-settings-currency"><option value="INR">Indian Rupee (₹)</option></select></label></div></section><section className="panel p-5"><p className="eyebrow">Application</p><h2 className="mt-1 text-base font-semibold">Working preferences</h2><label className="mt-5 flex items-center justify-between border-t border-border pt-4"><span><span className="block text-sm font-medium">Compact table density</span><span className="block text-xs text-muted-foreground">Show more records before scrolling</span></span><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} className="h-4 w-4 accent-primary" data-testid="input-settings-compact" /></label></section><div className="flex items-center gap-3"><Button type="submit" data-testid="button-save-settings"><Check size={15} /> Save settings</Button>{saved && <span className="text-sm text-status-good" role="status" data-testid="status-settings-saved">Settings saved for this session.</span>}</div></form></>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Shell><Switch><Route path="/"><Redirect to="/dashboard" /></Route><Route path="/dashboard" component={DashboardPage} /><Route path="/products" component={ProductsPage} /><Route path="/products/new" component={ProductsPage} /><Route path="/products/:id" component={ProductsPage} /><Route path="/categories"><SimpleCreatePage kind="categories" /></Route><Route path="/suppliers"><SimpleCreatePage kind="suppliers" /></Route><Route path="/customers"><SimpleCreatePage kind="customers" /></Route><Route path="/movements" component={MovementsPage} /><Route path="/reports" component={ReportsPage} /><Route path="/insights" component={InsightsPage} /><Route path="/settings" component={SettingsPage} /><Route component={NotFound} /></Switch></Shell></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;