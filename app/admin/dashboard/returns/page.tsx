'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  PackageX,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import type { ReturnRequest } from '@/lib/types';
import { returnRequestOperations } from '@/lib/firestore';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Spinner,
  Textarea,
} from '@/components/admin/ui';

export default function ReturnsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        loadReturns();
      }
    }
  }, [router]);

  const loadReturns = async () => {
    setLoading(true);
    try {
      const fetchedReturns = await returnRequestOperations.getAll();
      setReturns(fetchedReturns);
    } catch (error) {
      console.error('Error loading return requests:', error);
      alert('Failed to load return requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateReturnStatus = async (
    returnId: string,
    newStatus: ReturnRequest['status'],
    notes?: string
  ) => {
    try {
      await returnRequestOperations.updateStatus(returnId, newStatus, notes);

      const updatedReturns = returns.map((ret) =>
        ret.id === returnId
          ? { ...ret, status: newStatus, resolvedAt: new Date().toISOString(), adminNotes: notes }
          : ret
      );
      setReturns(updatedReturns);

      // Send email notification if status is approved or rejected
      if ((newStatus === 'approved' || newStatus === 'rejected') && selectedReturn && notes) {
        try {
          console.log(`📧 Sending ${newStatus} email to:`, selectedReturn.customerEmail);
          const emailResponse = await fetch('/api/send-return-status-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              returnRequest: selectedReturn,
              status: newStatus,
              adminResponse: notes,
            }),
          });

          const emailResult = await emailResponse.json();

          if (emailResult.success) {
            console.log('✅ Return status email sent successfully');
          } else {
            console.warn('⚠️ Failed to send return status email, but status was updated');
          }
        } catch (emailError) {
          // Don't fail the status update if email fails
          console.error('❌ Error sending return status email:', emailError);
          console.log('⚠️ Status was updated successfully but email notification failed');
        }
      }

      setSelectedReturn(null);
      setAdminNotes('');
      alert('Return request status updated successfully!');
    } catch (error) {
      console.error('Error updating return request status:', error);
      alert('Failed to update return request status. Please try again.');
    }
  };

  const deleteReturnRequest = async (returnId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this return request? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await returnRequestOperations.delete(returnId);
      setReturns(returns.filter((ret) => ret.id !== returnId));
      alert('Return request deleted successfully!');
    } catch (error) {
      console.error('Error deleting return request:', error);
      alert('Failed to delete return request. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <PackageX className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusTone = (status: string): 'amber' | 'green' | 'red' | 'blue' | 'slate' => {
    switch (status) {
      case 'pending':
        return 'amber';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'slate';
    }
  };

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch =
      ret.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ret.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = returns.filter((r) => r.status === 'pending').length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Return Requests"
        description="Review customer return requests and respond with approve, reject, or completed."
        actions={
          pendingCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {pendingCount} Pending Request{pendingCount !== 1 ? 's' : ''}
              </span>
            </div>
          ) : undefined
        }
      />

      <Card className="mb-6" padded={false}>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sm:w-52"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Spinner label="Loading return requests..." />
      ) : filteredReturns.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={<PackageX className="h-6 w-6" />}
            title="No return requests found"
            description="Return requests submitted by customers will appear here."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReturns.map((returnReq) => (
            <Card key={returnReq.id}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Order #{returnReq.orderNumber}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Customer: {returnReq.customerName} ({returnReq.customerEmail})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(returnReq.status)}
                    <Badge tone={getStatusTone(returnReq.status)}>
                      {returnReq.status.charAt(0).toUpperCase() + returnReq.status.slice(1)}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => deleteReturnRequest(returnReq.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4 space-y-3 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Reason:</span>
                  <p className="text-slate-600">{returnReq.reason}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Description:</span>
                  <p className="text-slate-600">{returnReq.description}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Request Date:</span>
                  <p className="text-slate-600">
                    {new Date(returnReq.createdAt).toLocaleString()}
                  </p>
                </div>
                {returnReq.adminNotes && (
                  <div>
                    <span className="font-medium text-slate-700">Admin Notes:</span>
                    <p className="text-slate-600">{returnReq.adminNotes}</p>
                  </div>
                )}
                {returnReq.images && returnReq.images.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700">Customer Images:</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {returnReq.images.map((image, idx) => (
                        <a
                          key={idx}
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-green-500"
                        >
                          <Image
                            src={image}
                            alt={`Return evidence ${idx + 1}`}
                            width={200}
                            height={200}
                            sizes="(max-width: 768px) 33vw, 200px"
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {returnReq.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedReturn(returnReq)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    Manage Request
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedReturn}
        onClose={() => {
          setSelectedReturn(null);
          setAdminNotes('');
        }}
        title="Manage Return Request"
        size="lg"
        footer={
          selectedReturn ? (
            <>
              <Button
                onClick={() => {
                  setSelectedReturn(null);
                  setAdminNotes('');
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteReturnRequest(selectedReturn.id);
                  setSelectedReturn(null);
                  setAdminNotes('');
                }}
                variant="danger"
              >
                <Trash2 className="h-4 w-4" />
                Delete Request
              </Button>
            </>
          ) : undefined
        }
      >
        {selectedReturn && (
          <div className="space-y-5">
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                Order: <strong className="text-slate-900">{selectedReturn.orderNumber}</strong>
              </p>
              <p>
                Customer: <strong className="text-slate-900">{selectedReturn.customerName}</strong>
              </p>
              <p className="pt-1">
                Reason: <strong className="text-slate-900">{selectedReturn.reason}</strong>
              </p>
              <p>Description: {selectedReturn.description}</p>
            </div>

            {selectedReturn.images && selectedReturn.images.length > 0 && (
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-2 text-sm font-medium text-slate-700">Customer Images:</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedReturn.images.map((image, idx) => (
                    <a
                      key={idx}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 transition-colors hover:border-green-500"
                    >
                      <Image
                        src={image}
                        alt={`Return evidence ${idx + 1}`}
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 33vw, 200px"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Click images to view full size</p>
              </div>
            )}

            <Field
              label="Response to Customer"
              htmlFor="admin-notes"
              required
              hint="📧 Your response will be emailed to the customer when you approve or reject this request"
            >
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Write your response to the customer. This will be sent via email when you approve or reject the request..."
              />
            </Field>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  if (!adminNotes.trim()) {
                    alert('Please provide a response to the customer before approving the request.');
                    return;
                  }
                  updateReturnStatus(selectedReturn.id, 'approved', adminNotes);
                }}
                variant="primary"
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => {
                  if (!adminNotes.trim()) {
                    alert('Please provide a response to the customer before rejecting the request.');
                    return;
                  }
                  updateReturnStatus(selectedReturn.id, 'rejected', adminNotes);
                }}
                variant="danger"
                className="flex-1"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() => updateReturnStatus(selectedReturn.id, 'completed', adminNotes)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600/40"
              >
                <PackageX className="h-4 w-4" />
                Mark as Completed
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
