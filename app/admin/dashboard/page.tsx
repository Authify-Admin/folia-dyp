'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import { productOperations, orderOperations } from '@/lib/firestore';
import type { Product, Order } from '@/lib/types';
import { Card, PageHeader, StatCard, Spinner } from '@/components/admin/ui';

const NAV_CARDS = [
  {
    href: '/admin/dashboard/products',
    title: 'Products',
    description: 'Add, edit, and manage your product inventory',
    Icon: Package,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    hoverBorder: 'hover:border-green-500',
  },
  {
    href: '/admin/dashboard/orders',
    title: 'Orders',
    description: 'View and manage all processed orders',
    Icon: ShoppingCart,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-500',
  },
  {
    href: '/admin/dashboard/returns',
    title: 'Return Requests',
    description: 'Manage product return and refund requests',
    Icon: RotateCcw,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    hoverBorder: 'hover:border-orange-500',
  },
  {
    href: '/admin/dashboard/coupons',
    title: 'Coupons',
    description: 'Create and manage discount coupon codes',
    Icon: Ticket,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    hoverBorder: 'hover:border-pink-500',
  },
  {
    href: '/admin/dashboard/statistics',
    title: 'Statistics',
    description: 'View sales analytics and performance metrics',
    Icon: BarChart3,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-500',
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        productOperations.getAll(),
        orderOperations.getAll(),
      ]);
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const revenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'processing')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <>
      <PageHeader
        title="Welcome to the Admin Panel"
        description="Manage your products, orders, and view analytics."
      />

      {/* Nav cards — uniform, equal-height */}
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {NAV_CARDS.map(({ href, title, description, Icon, iconBg, iconColor, hoverBorder }) => (
          <Link key={href} href={href} className="group h-full">
            <div
              className={`flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${hoverBorder}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick stats */}
      {loading ? (
        <Card className="mt-6">
          <Spinner label="Loading overview…" />
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <StatCard label="Total Products" value={products.length} />
          <StatCard label="Total Orders" value={orders.length} />
          <StatCard
            label="Out of Stock"
            value={products.filter((p) => p.quantity === 0).length}
            tone="red"
          />
          <StatCard label="Total Revenue" value={`₹${revenue.toFixed(2)}`} tone="green" />
        </div>
      )}
    </>
  );
}
