'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import type { Order } from '@/lib/types';
import { orderOperations } from '@/lib/firestore';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Spinner,
  Table,
  TD,
  TH,
  THead,
  TR,
} from '@/components/admin/ui';

type StatusTone = 'amber' | 'blue' | 'green' | 'red' | 'slate';

export default function OrdersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        loadOrders();
      }
    }
  }, [router]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await orderOperations.getAll();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderOperations.updateStatus(orderId, newStatus);
      // Update local state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      // Keep the open modal in sync if it shows this order
      setSelectedOrder(prev =>
        prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
      );
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTone = (status: string): StatusTone => {
    switch (status) {
      case 'pending':
        return 'amber';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'slate';
    }
  };

  const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return null;
  }

  const statusFilters: { value: string; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div>
      <PageHeader
        title="Orders Management"
        description="Review customer orders, update fulfilment status and inspect order details."
      />

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(({ value, label }) => (
            <Button
              key={value}
              variant={filterStatus === value ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus(value)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <Card padded={false}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            All Orders <span className="text-slate-400">({filteredOrders.length})</span>
          </h2>
        </div>

        {loading ? (
          <Spinner label="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No orders found"
            description="Orders placed by customers will appear here."
          />
        ) : (
          <Table>
            <THead>
              <TH>Order</TH>
              <TH>Customer</TH>
              <TH className="text-right">Items</TH>
              <TH className="text-right">Total</TH>
              <TH>Status</TH>
              <TH>Date</TH>
              <TH className="text-right">Actions</TH>
            </THead>
            <tbody>
              {filteredOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                return (
                  <TR key={order.id}>
                    <TD>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold text-slate-900">
                          {order.orderId}
                        </span>
                      </div>
                    </TD>
                    <TD>
                      <div className="font-medium text-slate-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-slate-500">{order.customerEmail}</div>
                      {order.customerPhone && (
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      )}
                    </TD>
                    <TD className="text-right">{itemCount}</TD>
                    <TD className="text-right font-medium text-slate-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </TD>
                    <TD>
                      <Badge tone={getStatusTone(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </TD>
                    <TD className="whitespace-nowrap text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TD>
                    <TD className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="secondary"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                        {order.status === 'pending' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            size="sm"
                          >
                            Start Processing
                          </Button>
                        )}

                        {order.status === 'processing' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            size="sm"
                          >
                            Mark Complete
                          </Button>
                        )}

                        {order.status !== 'cancelled' &&
                          order.status !== 'completed' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              size="sm"
                              variant="danger"
                            >
                              Cancel
                            </Button>
                          )}
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        }
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Order ID
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedOrder.orderId}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <div className="mt-1.5">
                  <Badge tone={getStatusTone(selectedOrder.status)}>
                    {formatStatus(selectedOrder.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Customer
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedOrder.customerName}
              </p>
              <p className="text-sm text-slate-600">{selectedOrder.customerEmail}</p>
              {selectedOrder.customerPhone && (
                <p className="text-sm text-slate-600">{selectedOrder.customerPhone}</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Items
              </p>
              <Table>
                <THead>
                  <TH>Product</TH>
                  <TH>Size</TH>
                  <TH className="text-right">Qty</TH>
                  <TH className="text-right">Price</TH>
                  <TH className="text-right">Total</TH>
                </THead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <TR key={idx}>
                      <TD className="font-medium text-slate-900">
                        {item.productName}
                      </TD>
                      <TD>{item.size ? <Badge tone="slate">{item.size}</Badge> : '—'}</TD>
                      <TD className="text-right">{item.quantity}</TD>
                      <TD className="text-right">₹{item.price.toFixed(2)}</TD>
                      <TD className="text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TD>
                    </TR>
                  ))}
                  <TR>
                    <TD className="text-right font-semibold text-slate-900" />
                    <TD />
                    <TD />
                    <TD className="text-right font-semibold text-slate-900">Total</TD>
                    <TD className="text-right font-semibold text-slate-900">
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </TD>
                  </TR>
                </tbody>
              </Table>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Shipping Address
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                  {selectedOrder.shippingAddress}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Order Date
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {(selectedOrder.paymentMethod || selectedOrder.paymentId) && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {selectedOrder.paymentMethod && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Payment Method
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {selectedOrder.paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : 'Razorpay'}
                    </p>
                  </div>
                )}
                {selectedOrder.paymentId && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Payment ID
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-700">
                      {selectedOrder.paymentId}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
