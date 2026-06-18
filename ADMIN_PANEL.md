# Folia Admin Panel Documentation

## Overview

The admin panel is a comprehensive dashboard for managing products, orders, and viewing analytics for the Folia e-commerce platform.

## Access

- **URL**: `/admin`
- **Authentication**: Currently accepts any username and password (to be replaced with proper authentication)

## Features

### 1. Login Page (`/admin`)

Simple login interface that accepts any credentials for development purposes.

- Enter any username and password
- Redirects to dashboard upon successful login
- Session persists until browser is closed

### 2. Main Dashboard (`/admin/dashboard`)

Central hub with quick access to all admin features:

- **Quick Stats Cards**:
  - Total Products
  - Total Orders
  - Out of Stock Items
  - Total Revenue

- **Navigation Cards**:
  - Products Management
  - Orders Management
  - Statistics & Analytics

### 3. Products Management (`/admin/dashboard/products`)

Complete CRUD operations for product management:

#### Add New Product
- Product Name
- Category (e.g., Indoor Plants, Seeds, Tools)
- Price (₹)
- Weight/Volume (e.g., 500g, 1kg, 2L)
- Quantity in Stock
- Image URL
- Description

#### Product List Features
- View all products in a table format
- Search by product name or category
- Edit existing products
- Delete products
- Visual stock status indicators:
  - **Green**: In stock (10+ units)
  - **Yellow**: Low stock (<10 units)
  - **Red**: Sold out (0 units)

#### Product Display
- Product image thumbnail
- Category badge
- Price
- Weight/Volume
- Stock quantity with color-coded status
- Action buttons (Edit, Delete)

### 4. Orders Management (`/admin/dashboard/orders`)

View and manage customer orders:

#### Features
- Search by Order ID, customer name, or email
- Filter by status:
  - All
  - Pending
  - Processing
  - Completed
  - Cancelled

#### Order Information
- Order ID
- Customer details (name, email, phone)
- Order items with quantities and prices
- Total amount
- Shipping address
- Order date
- Status with visual indicators

#### Order Actions
- View detailed order information
- Update order status:
  - Pending → Processing
  - Processing → Completed
  - Cancel order (if not completed)

#### Sample Orders
The system includes 3 sample orders for demonstration:
- ORD-001: Completed order
- ORD-002: Processing order
- ORD-003: Pending order

### 5. Statistics & Analytics (`/admin/dashboard/statistics`)

Comprehensive analytics dashboard with visualizations:

#### Key Metrics Cards
- **Total Revenue**: Sum of all completed orders
- **Total Orders**: Count of all orders
- **Products Sold**: Total units sold
- **Out of Stock**: Count of products with 0 quantity

Each metric shows a trend indicator (percentage change from last month)

#### Visualizations

**1. Sales by Category (Pie Chart)**
- Visual representation of product distribution across categories
- Percentage breakdown
- Color-coded segments

**2. Products by Category (Bar Chart)**
- Number of products in each category
- Easy comparison across categories

**3. Monthly Sales Trend (Line Chart)**
- Sales revenue over the last 6 months
- Identifies sales patterns and trends

**4. Monthly Orders (Line Chart)**
- Order count over the last 6 months
- Track order volume trends

**5. Top Selling Products**
- List of 5 best-selling products
- Shows units sold for each
- Ranked by popularity

**6. Category Performance Table**
- Detailed breakdown by category
- Metrics include:
  - Number of products
  - Total sales
  - Average sales per product

## Data Storage

Currently using **localStorage** for data persistence:

- **Products**: `localStorage.getItem('products')`
- **Orders**: `localStorage.getItem('orders')`

### Database Schema

#### Product Schema
```typescript
{
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  weight: string;
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Order Schema
```typescript
{
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}
```

#### OrderItem Schema
```typescript
{
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
```

## API Endpoints

RESTful API routes for future integration:

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get single order
- `PATCH /api/orders/[id]` - Update order status

## Inventory Management

### Automatic Stock Updates
- When an order is placed, product quantities are automatically reduced
- "Sold Out" status displayed when quantity reaches 0
- Low stock warning when quantity < 10

### Manual Stock Management
- Edit product to update quantity
- Add new stock by editing the product

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **localStorage**: Client-side data persistence

## Future Enhancements

### Recommended Improvements

1. **Authentication**
   - Replace simple auth with proper authentication (NextAuth.js, Auth0, etc.)
   - Role-based access control
   - Admin user management

2. **Database**
   - Migrate from localStorage to a proper database:
     - PostgreSQL with Prisma
     - MongoDB with Mongoose
     - Supabase
     - Firebase

3. **Image Upload**
   - Replace URL input with file upload
   - Integration with cloud storage (Cloudinary, AWS S3)
   - Image optimization and resizing

4. **Advanced Features**
   - Export orders to CSV/PDF
   - Email notifications for orders
   - Inventory alerts for low stock
   - Product variants (size, color)
   - Bulk product import/export
   - Advanced filtering and sorting
   - Date range selection for analytics
   - Real-time updates with WebSockets

5. **UI Enhancements**
   - Dark mode
   - Responsive mobile optimization
   - Drag-and-drop product reordering
   - Image gallery for products
   - Rich text editor for descriptions

6. **Analytics**
   - Customer analytics
   - Revenue forecasting
   - Conversion rates
   - Abandoned cart tracking
   - Export reports

## Development

### Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Access Points

- **Main Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/admin/dashboard

## Security Considerations

### Current Implementation (Development Only)
- Simple authentication for development
- Client-side data storage
- No data encryption

### Production Requirements
- Implement proper authentication and authorization
- Use secure server-side database
- Add CSRF protection
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS
- Secure API endpoints with authentication
- Add audit logging
- Implement data backup

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test in development mode first
4. Check browser console for errors

## License

This admin panel is part of the Folia project.
