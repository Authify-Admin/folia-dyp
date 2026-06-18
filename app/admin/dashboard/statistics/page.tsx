'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { Product, Order } from '@/lib/types';
import { productOperations, orderOperations } from '@/lib/firestore';
import {
  Card,
  PageHeader,
  StatCard,
  Spinner,
  Badge,
  EmptyState,
  Table,
  THead,
  TH,
  TR,
  TD
} from '@/components/admin/ui';

// Revenue-bearing orders: paid online (status 'processing') or fulfilled
// ('completed'). Razorpay orders land as 'processing' and COD as 'pending',
// so counting only 'completed' showed ₹0 until each order was hand-completed.
const REVENUE_STATUSES: Order['status'][] = ['completed', 'processing'];
const isRevenueOrder = (o: Order) => REVENUE_STATUSES.includes(o.status);

interface CategoryStats {
  name: string;
  value: number;
  sales: number;
  [key: string]: string | number;
}

interface MonthlyStats {
  month: string;
  sales: number;
  orders: number;
  [key: string]: string | number;
}

export default function StatisticsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        loadData();
      }
    }
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load products and orders from Firestore
      const fetchedProducts = await productOperations.getAll();
      const fetchedOrders = await orderOperations.getAll();

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);

      // Calculate stats with both products and orders
      calculateCategoryStats(fetchedProducts, fetchedOrders);
      calculateMonthlyStats(fetchedOrders);
    } catch (error) {
      console.error('Error loading statistics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryStats = (prods: Product[], ords: Order[]) => {
    const categoryMap = new Map<string, { count: number; sales: number }>();

    // Initialize categories from products
    prods.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, { count: 0, sales: 0 });
      }
      const existing = categoryMap.get(product.category)!;
      categoryMap.set(product.category, {
        count: existing.count + 1,
        sales: existing.sales
      });
    });

    // Calculate actual sales from COMPLETED orders only
    ords
      .filter(isRevenueOrder)
      .forEach(order => {
        order.items.forEach(item => {
          // Find the product to get its category
          const product = prods.find(p => p.id === item.productId);
          if (product) {
            const existing = categoryMap.get(product.category);
            if (existing) {
              categoryMap.set(product.category, {
                count: existing.count,
                sales: existing.sales + (item.price * item.quantity)
              });
            }
          }
        });
      });

    const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      value: data.count,
      sales: data.sales
    }));

    setCategoryStats(stats);
  };

  const calculateMonthlyStats = (ords: Order[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap = new Map<string, { sales: number; orders: number }>();

    // Initialize last 6 months. Build each bucket from a first-of-month date
    // so subtracting months never overflows (e.g. on the 31st, plain setMonth
    // would skip or duplicate a month).
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthMap.set(monthKey, { sales: 0, orders: 0 });
    }

    // Calculate stats from COMPLETED orders only
    ords
      .filter(isRevenueOrder)
      .forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        const existing = monthMap.get(monthKey);
        if (existing) {
          monthMap.set(monthKey, {
            sales: existing.sales + order.totalAmount,
            orders: existing.orders + 1
          });
        }
      });

    const stats: MonthlyStats[] = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      sales: data.sales,
      orders: data.orders
    }));

    setMonthlyStats(stats);
  };

  const getTotalRevenue = () => {
    return orders
      .filter(isRevenueOrder)
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getTotalProductsSold = () => {
    return orders
      .filter(isRevenueOrder)
      .reduce((sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
      );
  };

  const getTotalVariants = () => {
    let totalCount = 0;

    products.forEach(product => {
      if (product.hasVariants && product.variants) {
        // Count each variant
        totalCount += product.variants.length;
      } else {
        // Count as 1 product
        totalCount += 1;
      }
    });

    return totalCount;
  };

  const getOutOfStock = () => {
    let outOfStockCount = 0;

    products.forEach(product => {
      if (product.hasVariants && product.variants) {
        // Count each variant that is out of stock
        outOfStockCount += product.variants.filter(v => v.quantity === 0).length;
      } else {
        // Count product if it's out of stock
        if (product.quantity === 0) {
          outOfStockCount += 1;
        }
      }
    });

    return outOfStockCount;
  };

  // Calculate percentage changes
  const getRevenueChange = () => {
    if (monthlyStats.length < 2) return { percent: 0, isPositive: true };

    const currentMonth = monthlyStats[monthlyStats.length - 1]?.sales || 0;
    const previousMonth = monthlyStats[monthlyStats.length - 2]?.sales || 0;

    if (previousMonth === 0) return { percent: currentMonth > 0 ? 100 : 0, isPositive: true };

    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    return { percent: Math.abs(change), isPositive: change >= 0 };
  };

  const getOrdersChange = () => {
    if (monthlyStats.length < 2) return { percent: 0, isPositive: true };

    const currentMonth = monthlyStats[monthlyStats.length - 1]?.orders || 0;
    const previousMonth = monthlyStats[monthlyStats.length - 2]?.orders || 0;

    if (previousMonth === 0) return { percent: currentMonth > 0 ? 100 : 0, isPositive: true };

    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    return { percent: Math.abs(change), isPositive: change >= 0 };
  };

  const getProductsSoldChange = () => {
    // Calculate products sold this month vs last month (COMPLETED orders only)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return isRevenueOrder(order) &&
             orderDate.getMonth() === currentMonth &&
             orderDate.getFullYear() === currentYear;
    });

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return isRevenueOrder(order) &&
             orderDate.getMonth() === lastMonth &&
             orderDate.getFullYear() === lastMonthYear;
    });

    const thisMonthSold = thisMonthOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const lastMonthSold = lastMonthOrders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    if (lastMonthSold === 0) return { percent: thisMonthSold > 0 ? 100 : 0, isPositive: true };

    const change = ((thisMonthSold - lastMonthSold) / lastMonthSold) * 100;
    return { percent: Math.abs(change), isPositive: change >= 0 };
  };

  const getTopSellingProducts = () => {
    const productSales = new Map<string, number>();

    // Only count COMPLETED orders
    orders
      .filter(isRevenueOrder)
      .forEach(order => {
        order.items.forEach(item => {
          const current = productSales.get(item.productName) || 0;
          productSales.set(item.productName, current + item.quantity);
        });
      });

    return Array.from(productSales.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  if (!isAuthenticated) {
    return null;
  }

  const topProducts = getTopSellingProducts();
  const revenueChange = getRevenueChange();
  const ordersChange = getOrdersChange();
  const productsSoldChange = getProductsSoldChange();

  return (
    <>
      <PageHeader
        title="Statistics & Analytics"
        description="Revenue, sales and catalog insights — paid online orders count as revenue."
      />

      {loading ? (
        <Spinner label="Loading statistics..." />
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value={`₹${getTotalRevenue().toFixed(2)}`}
              tone="green"
              hint={`${revenueChange.percent.toFixed(1)}% from last month`}
            />
            <StatCard
              label="Paid Orders"
              value={orders.filter(isRevenueOrder).length}
              tone="blue"
              hint={`${ordersChange.percent.toFixed(1)}% from last month`}
            />
            <StatCard
              label="Products Sold"
              value={getTotalProductsSold()}
              tone="slate"
              hint={`${productsSoldChange.percent.toFixed(1)}% from last month`}
            />
            <StatCard
              label="Out of Stock Variants"
              value={getOutOfStock()}
              tone="red"
              hint={`${getTotalVariants()} total variants`}
            />
          </div>

          {/* Trend badges */}
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              {revenueChange.isPositive ? (
                <Badge tone="green">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                  Revenue up {revenueChange.percent.toFixed(1)}%
                </Badge>
              ) : (
                <Badge tone="red">
                  <TrendingDown className="mr-1 h-3.5 w-3.5" />
                  Revenue down {revenueChange.percent.toFixed(1)}%
                </Badge>
              )}
            </div>
            <div>
              {ordersChange.isPositive ? (
                <Badge tone="blue">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                  Orders up {ordersChange.percent.toFixed(1)}%
                </Badge>
              ) : (
                <Badge tone="red">
                  <TrendingDown className="mr-1 h-3.5 w-3.5" />
                  Orders down {ordersChange.percent.toFixed(1)}%
                </Badge>
              )}
            </div>
            <div>
              {productsSoldChange.isPositive ? (
                <Badge tone="purple">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                  Sold up {productsSoldChange.percent.toFixed(1)}%
                </Badge>
              ) : (
                <Badge tone="red">
                  <TrendingDown className="mr-1 h-3.5 w-3.5" />
                  Sold down {productsSoldChange.percent.toFixed(1)}%
                </Badge>
              )}
            </div>
            <div />
          </div>

          {/* Charts Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Gross Revenue by Category - Pie Chart */}
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Gross Revenue by Category</h2>
              <p className="mb-4 mt-1 text-xs text-slate-500">Item totals before any coupon discounts</p>
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
                  No category data available
                </div>
              )}
            </Card>

            {/* Catalog by Category - Bar Chart */}
            <Card>
              <h2 className="text-lg font-semibold text-slate-900">Catalog by Category</h2>
              <p className="mb-4 mt-1 text-xs text-slate-500">How many products you currently stock — not sales</p>
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" name="Products" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
                  No category data available
                </div>
              )}
            </Card>

            {/* Monthly Sales - Line Chart */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Monthly Sales Trend</h2>
              {monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#10b981" name="Sales (₹)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
                  No sales data available
                </div>
              )}
            </Card>

            {/* Monthly Orders - Line Chart */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Monthly Orders</h2>
              {monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
                  No order data available
                </div>
              )}
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card className="mt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Top Selling Products</h2>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{product.quantity} units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package className="h-6 w-6" />}
                title="No sales data available"
              />
            )}
          </Card>

          {/* Category Performance Table */}
          <Card className="mt-6" padded={false}>
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-semibold text-slate-900">Category Performance</h2>
            </div>
            {categoryStats.length > 0 ? (
              <Table>
                <THead>
                  <TH>Category</TH>
                  <TH>Products</TH>
                  <TH>Gross Sales</TH>
                  <TH>Avg per Product</TH>
                </THead>
                <tbody>
                  {categoryStats.map((category, index) => (
                    <TR key={index}>
                      <TD>
                        <div className="flex items-center">
                          <div
                            className="mr-3 h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-slate-900">{category.name}</span>
                        </div>
                      </TD>
                      <TD>{category.value}</TD>
                      <TD>₹{category.sales.toFixed(2)}</TD>
                      <TD>₹{(category.sales / category.value).toFixed(2)}</TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState
                icon={<Package className="h-6 w-6" />}
                title="No category data available"
              />
            )}
          </Card>
        </>
      )}
    </>
  );
}
