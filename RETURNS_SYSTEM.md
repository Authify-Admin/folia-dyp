# Returns Management System

## Overview

A complete return/refund request management system for the Folia e-commerce admin panel.

## Features Implemented

### ✅ Admin Panel - Return Requests Management

**Location**: `/admin/dashboard/returns`

**Features**:
- View all return requests in one place
- Filter by status: Pending, Approved, Rejected, Completed
- Search by order number, customer name, or email
- Pending requests counter with visual alert
- Approve or reject return requests
- Add admin notes to each request
- Mark approved returns as completed
- Beautiful UI with status indicators

**Status Flow**:
1. **Pending** → Customer submitted return request
2. **Approved** → Admin approved the return
3. **Rejected** → Admin rejected the return
4. **Completed** → Return processed and completed

**Admin Actions**:
- **For Pending Requests**:
  - Approve with optional notes
  - Reject with optional notes
- **For Approved Requests**:
  - Mark as completed

### 📊 What's Been Added

#### 1. New Data Type
Added `ReturnRequest` interface in [lib/types.ts](lib/types.ts):
```typescript
interface ReturnRequest {
  id: string;
  orderId: string;          // Firestore order ID
  orderNumber: string;      // Display order number (ORD-XXXXXX)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;           // Why they want to return
  description: string;      // Detailed description
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  resolvedAt?: string;      // When admin resolved it
  adminNotes?: string;      // Admin's notes
}
```

#### 2. Firestore Operations
Added `returnRequestOperations` in [lib/firestore.ts](lib/firestore.ts):
- `getAll()` - Get all return requests
- `getById(id)` - Get single return request
- `getByOrderId(orderId)` - Get returns for specific order
- `getByStatus(status)` - Filter by status
- `create(request)` - Create new return request
- `updateStatus(id, status, notes)` - Update request status
- `delete(id)` - Delete return request

#### 3. Admin Returns Page
Created [app/admin/dashboard/returns/page.tsx](app/admin/dashboard/returns/page.tsx):
- Full return requests management interface
- Search and filter functionality
- Status-based filtering with counts
- Modal for viewing return details
- Approve/Reject/Complete actions
- Admin notes functionality

#### 4. Dashboard Integration
Updated [app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx):
- Added "Return Requests" card to main dashboard
- Orange-themed card with RotateCcw icon
- Changed grid to 4 columns to accommodate new card

#### 5. Firestore Security Rules
Updated [firestore.rules](firestore.rules):
- Added `returnRequests` collection rules
- Allow public read/create for customer submissions
- Allow update/delete for admin management

## Access the Returns Panel

### For Admin:
1. Go to `/admin` and login
2. Click on **"Return Requests"** card in the dashboard
3. OR directly navigate to `/admin/dashboard/returns`

### Features:
- **Pending Alert**: Shows count of pending requests at top
- **Filter Buttons**: Quick filters for All, Pending, Approved, Rejected, Completed
- **Search**: Search by order number, name, or email
- **Click Request**: Click any request to view full details and take action

## Return Request Workflow

### Customer Side (Not Yet Implemented):
_Future feature: Customers can submit return requests from their profile or order confirmation page_

### Admin Side (Implemented):
1. **New Request Comes In**:
   - Shows in "Pending" status
   - Alert badge shows pending count

2. **Admin Reviews**:
   - Click on request to view details
   - Read customer's reason and description
   - Add admin notes (optional)

3. **Admin Takes Action**:
   - **Approve**: Moves to "Approved" status
   - **Reject**: Moves to "Rejected" status with notes

4. **Process Completion**:
   - For approved returns, mark as "Completed" when processed

## UI Features

### Status Colors:
- 🟡 **Pending**: Yellow (requires action)
- 🟢 **Approved**: Green (return accepted)
- 🔴 **Rejected**: Red (return denied)
- 🔵 **Completed**: Blue (fully processed)

### Icons:
- ⏱️ Pending: Clock icon
- ✅ Approved: Check circle
- ❌ Rejected: X circle
- 📦 Completed: Package X icon

### Filter Counts:
Each filter button shows the count of requests in that status:
- All (10)
- Pending (3)
- Approved (2)
- Rejected (1)
- Completed (4)

## Database Structure

### Firestore Collection: `returnRequests`

**Example Document**:
```json
{
  "id": "auto-generated",
  "orderId": "firestore-order-id",
  "orderNumber": "ORD-123456",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "reason": "Damaged product",
  "description": "The plant arrived with broken leaves and dry soil.",
  "status": "pending",
  "createdAt": "2025-01-20T10:30:00.000Z",
  "resolvedAt": null,
  "adminNotes": null
}
```

**After Admin Action**:
```json
{
  ...
  "status": "approved",
  "resolvedAt": "2025-01-20T14:45:00.000Z",
  "adminNotes": "Approved for full refund. Customer to ship back within 7 days."
}
```

## Next Steps (Optional Enhancements)

### Customer-Facing Features:
1. **Return Request Form**: Allow customers to submit returns from profile page
2. **Order History Integration**: Show "Request Return" button on completed orders
3. **Return Status Tracking**: Let customers see status of their return requests
4. **Email Notifications**: Send emails when return status changes

### Admin Enhancements:
1. **Return Statistics**: Add to statistics dashboard
2. **Refund Integration**: Connect with Razorpay for auto-refunds
3. **Return Shipping Labels**: Generate shipping labels for returns
4. **Return Photos**: Allow customers to upload photos of damaged products
5. **Return Reasons Dropdown**: Predefined reasons for faster processing
6. **Bulk Actions**: Approve/reject multiple requests at once

### Process Automation:
1. **Auto-reject after X days** if no admin action
2. **Auto-remind admin** of pending returns
3. **Track return shipping** with courier integration
4. **Inventory update** when return is completed

## Testing the System

### Manual Test (Admin Panel Only):

Since customer submission isn't implemented yet, you can test by manually creating return requests in Firestore:

1. Go to Firebase Console > Firestore
2. Create a new document in `returnRequests` collection
3. Add fields:
   ```
   orderNumber: "ORD-123456"
   orderId: (copy an actual order ID from orders collection)
   customerName: "Test Customer"
   customerEmail: "test@example.com"
   customerPhone: "1234567890"
   reason: "Product damaged"
   description: "The item arrived broken"
   status: "pending"
   createdAt: (auto or current timestamp)
   ```
4. Go to `/admin/dashboard/returns`
5. You should see the return request
6. Click it and test approve/reject actions

## File Structure

```
app/
  admin/
    dashboard/
      returns/
        page.tsx              ← Returns management page
lib/
  types.ts                    ← ReturnRequest interface
  firestore.ts                ← returnRequestOperations
firestore.rules               ← returnRequests security rules
RETURNS_SYSTEM.md             ← This file
```

## Important Notes

1. **Remember to update Firestore rules**: Deploy the updated rules from `firestore.rules` to Firebase Console

2. **Status cannot go backwards**: Once approved/rejected/completed, you cannot change it back to pending (you'd need to delete and recreate)

3. **Admin notes are optional**: But recommended for transparency with customers (when customer portal is built)

4. **Deleted return requests**: Permanently deleted from Firestore, cannot be recovered

## Support

The returns system is fully integrated with the existing admin panel. All return requests are managed through the beautiful UI at `/admin/dashboard/returns`.

---

**Status**: ✅ Admin Panel Complete | ⏳ Customer Portal Pending
