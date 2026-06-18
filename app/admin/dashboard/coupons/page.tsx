'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Ticket,
  Copy,
  CheckCircle,
} from 'lucide-react';
import type { Coupon } from '@/lib/types';
import { couponOperations } from '@/lib/firestore';
import {
  Card,
  PageHeader,
  Button,
  Field,
  Input,
  Select,
  Badge,
  Table,
  THead,
  TH,
  TR,
  TD,
  EmptyState,
  Spinner,
  Modal,
} from '@/components/admin/ui';

export default function CouponsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    isActive: true,
    firstTimeUsersOnly: false,
    expiresAt: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        loadCoupons();
      }
    }
  }, [router]);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const fetchedCoupons = await couponOperations.getAll();
      setCoupons(fetchedCoupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
      alert('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCoupon) {
        // Update existing coupon
        const updates: Partial<Coupon> = {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          isActive: formData.isActive,
          firstTimeUsersOnly: formData.firstTimeUsersOnly,
          expiresAt: formData.expiresAt || undefined,
        };

        await couponOperations.update(editingCoupon.id, updates);
        alert('Coupon updated successfully!');
      } else {
        // Create new coupon
        const newCoupon: Omit<Coupon, 'id'> = {
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          usedCount: 0,
          isActive: formData.isActive,
          firstTimeUsersOnly: formData.firstTimeUsersOnly,
          expiresAt: formData.expiresAt || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await couponOperations.create(newCoupon);
        alert('Coupon added successfully!');
      }

      resetForm();
      await loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderValue: coupon.minOrderValue?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      isActive: coupon.isActive,
      firstTimeUsersOnly: coupon.firstTimeUsersOnly ?? false,
      expiresAt: coupon.expiresAt?.split('T')[0] || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      await couponOperations.delete(id);
      alert('Coupon deleted successfully!');
      await loadCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon. Please try again.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      isActive: true,
      firstTimeUsersOnly: false,
      expiresAt: '',
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% off`;
    } else {
      return `₹${coupon.discountValue} off`;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Coupon Management"
        description="Create and manage discount codes for your store."
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Coupon
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search coupons by code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Coupons List */}
      <Card padded={false}>
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            All Coupons ({filteredCoupons.length})
          </h2>
        </div>

        {loading ? (
          <Spinner label="Loading coupons..." />
        ) : filteredCoupons.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-6 w-6" />}
            title="No coupons found"
            description="Add your first coupon to start offering discounts."
          />
        ) : (
          <Table>
            <THead>
              <TH>Code</TH>
              <TH>Discount</TH>
              <TH>Usage</TH>
              <TH>Min Order</TH>
              <TH>Status</TH>
              <TH>Expires</TH>
              <TH className="text-right">Actions</TH>
            </THead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <TR key={coupon.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm font-semibold text-slate-900">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        aria-label="Copy code"
                        className="text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {copiedCode === coupon.code ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {coupon.firstTimeUsersOnly && (
                      <div className="mt-1.5">
                        <Badge tone="blue">First-time users only</Badge>
                      </div>
                    )}
                  </TD>
                  <TD>
                    <span className="text-sm font-semibold text-green-600">
                      {getDiscountText(coupon)}
                    </span>
                    {coupon.maxDiscount && (
                      <span className="block text-xs text-slate-500">Max: ₹{coupon.maxDiscount}</span>
                    )}
                  </TD>
                  <TD className="text-slate-700">
                    {coupon.usedCount} / {coupon.usageLimit === null ? '∞' : coupon.usageLimit}
                  </TD>
                  <TD className="text-slate-500">
                    {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : 'None'}
                  </TD>
                  <TD>
                    {coupon.isActive ? (
                      <Badge tone="green">Active</Badge>
                    ) : (
                      <Badge tone="red">Inactive</Badge>
                    )}
                  </TD>
                  <TD className="text-slate-500">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                  </TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleEdit(coupon)} variant="secondary" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(coupon.id)}
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Coupon Form Modal */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
        description={
          editingCoupon
            ? 'Update the details for this discount code.'
            : 'Configure a new discount code for your store.'
        }
        size="lg"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={resetForm} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" form="coupon-form" loading={submitting} disabled={submitting}>
              {submitting
                ? editingCoupon
                  ? 'Updating...'
                  : 'Adding...'
                : editingCoupon
                  ? 'Update Coupon'
                  : 'Add Coupon'}
            </Button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Coupon Code" htmlFor="code" required>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SUMMER20"
                required
              />
            </Field>

            <Field label="Discount Type" htmlFor="discountType" required>
              <Select
                id="discountType"
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })
                }
                required
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
              </Select>
            </Field>

            <Field
              label={formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)'}
              htmlFor="discountValue"
              required
            >
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                required
              />
            </Field>

            <Field label="Minimum Order Value (₹)" htmlFor="minOrderValue">
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="Optional"
              />
            </Field>

            {formData.discountType === 'percentage' && (
              <Field label="Maximum Discount (₹)" htmlFor="maxDiscount">
                <Input
                  id="maxDiscount"
                  type="number"
                  step="0.01"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="Optional"
                />
              </Field>
            )}

            <Field label="Usage Limit" htmlFor="usageLimit" hint="Leave empty for unlimited uses">
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </Field>

            <Field label="Expiration Date" htmlFor="expiresAt" hint="Leave empty for no expiration">
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="isActive" className="cursor-pointer text-sm font-medium text-slate-700">
              Coupon is active
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="firstTimeUsersOnly"
              checked={formData.firstTimeUsersOnly}
              onChange={(e) => setFormData({ ...formData, firstTimeUsersOnly: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="firstTimeUsersOnly"
              className="cursor-pointer text-sm font-medium text-slate-700"
            >
              First-time users only
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
