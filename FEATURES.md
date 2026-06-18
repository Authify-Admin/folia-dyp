# Folia - Feature Documentation

## 📋 Complete Feature List

### 🏠 Home Page

#### Hero Section
- **Gradient Background**: Subtle green-to-white gradient with pattern overlay
- **Animated Title**: Large, bold typography with primary color accent
- **Call-to-Action Buttons**: 
  - "Shop Plants" (primary action)
  - "Our Story" (secondary action)
- **Trust Badges**: 30-Day Guarantee and Free Shipping indicators
- **Smooth Animations**: Fade-in effects on scroll

#### Featured Products
- **Dynamic Product Grid**: Responsive 1-4 column layout
- **Product Cards**: Hover effects, image zoom, and quick add-to-cart
- **Category Badges**: For plants - difficulty and light requirements
- **Discount Tags**: Prominent display of sales and discounts
- **View All CTA**: Link to shop page

#### Why Folia Section
- **4 Value Propositions**:
  1. Sustainably Sourced
  2. Safe Delivery
  3. 30-Day Guarantee
  4. Expert Care Guides
- **Icon Animations**: Icons change color on hover
- **Clean Layout**: Grid with hover effects

#### Testimonials
- **Customer Reviews**: 3 featured testimonials
- **Star Ratings**: Visual 5-star display
- **Social Proof**: Real customer names and roles
- **Card Hover Effects**: Subtle shadow lift

#### CTA Section
- **Gradient Background**: Green gradient for visual impact
- **Dual Actions**: Shop Now and Get Expert Advice
- **Contrasting Colors**: White text on green background

---

### 🛍️ Shop Page

#### Category Filter
- **5 Categories**: All, Plants, Pots, Tools, Kits
- **Active State**: Visual indicator for selected category
- **Client-Side Filtering**: Instant results without page reload
- **Responsive Layout**: Wraps on mobile devices

#### Product Grid
- **Responsive Grid**: 1-4 columns based on screen size
- **Product Count**: Display number of results
- **Empty State**: Helpful message when no products found
- **Smooth Transitions**: Fade effects on filter change

#### Product Cards
- **High-Quality Images**: Optimized with Next.js Image component
- **Quick Info**: Name, description, price at a glance
- **Stock Status**: Visual indicator for out-of-stock items
- **Discount Display**: Original price strikethrough
- **Category-Specific Badges**: Difficulty, light, watering info for plants
- **Quick Add to Cart**: Icon button on each card
- **Hover Effects**: Image zoom and shadow lift

---

### 📦 Product Detail Page

#### Breadcrumb Navigation
- **Path Display**: Home > Shop > Product Name
- **Clickable Links**: Easy navigation back

#### Image Gallery
- **Primary Image Display**: Large, high-quality product image
- **Multiple Images**: Carousel navigation with arrows
- **Thumbnail Navigation**: Click to switch images
- **Discount Badge**: Floating tag for sales
- **Responsive**: Adapts to mobile and desktop

#### Product Information
- **Product Title**: Large, prominent heading
- **Description**: Brief overview
- **Price Display**: Large, easy-to-read with original price strikethrough
- **Plant Care Tags**: Difficulty, light, and watering requirements
- **Quantity Selector**: +/- buttons with validation
- **Add to Cart**: Large, prominent button
- **Wishlist**: Heart icon for saving favorites
- **Key Features**: Bulleted list with checkmarks
- **Shipping Info**: Free shipping and guarantee badges

#### Long Description
- **Detailed Info**: Comprehensive product description
- **Formatted Text**: Easy-to-read paragraphs
- **Category Context**: "About This Plant/Product" heading

#### Related Products
- **Smart Suggestions**: Same-category products
- **Grid Display**: 4 related items
- **Same Product Cards**: Consistent UI across site

---

### ℹ️ About Page

#### Hero Section
- **Mission Statement**: Clear, concise brand message
- **Gradient Background**: Consistent with home page

#### Our Story
- **Narrative Section**: Engaging brand story
- **Paragraph Format**: Easy-to-read text blocks
- **Personal Touch**: Connects with audience

#### Values Section
- **4 Core Values**:
  1. Sustainable Practices
  2. Customer First
  3. Community Driven
  4. Environmental Impact
- **Icon Cards**: Visual representation
- **Hover Effects**: Background color change

#### Sustainability Commitment
- **4 Key Initiatives**:
  1. Carbon-Neutral Shipping
  2. Recyclable Packaging
  3. Local Sourcing
  4. Tree Planting Program
- **Icon Badges**: Green-themed indicators
- **Detailed Descriptions**: What we do and why

#### Timeline
- **4 Milestones**: 2021-2024
- **Visual Timeline**: Connected dots with lines
- **Year Badges**: Circular indicators
- **Interactive Cards**: Hover effects

---

### 📧 Contact Page

#### Hero Section
- **Welcoming Message**: Friendly invitation to reach out
- **Gradient Background**: Consistent branding

#### Contact Form
- **Form Fields**:
  - Name (required)
  - Email (required)
  - Subject (required)
  - Message (required)
- **Validation**: HTML5 form validation
- **Submit State**: Loading indicator
- **Success Message**: Confirmation after submission
- **Responsive Layout**: Full-width on mobile

#### Contact Information
- **3 Contact Methods**:
  - Email (clickable mailto link)
  - Phone (clickable tel link)
  - Location
- **Icon Cards**: Visual indicators
- **Hover Effects**: Subtle background change

#### Social Media
- **3 Social Platforms**: Instagram, Facebook, Twitter
- **Icon Buttons**: Circular, hover effects
- **External Links**: Open in new tab

#### Business Hours
- **Weekly Schedule**: Monday-Sunday hours
- **Formatted Display**: Easy-to-scan table
- **Timezone Info**: PST indication

#### FAQ Section
- **4 Common Questions**:
  1. Shipping times
  2. Damaged plants
  3. Consultations
  4. Returns
- **Card Layout**: Clean, organized
- **Concise Answers**: Quick information

---

## 🎨 Design Features

### Color Palette
- **Primary**: Green (#22c55e) - Nature, growth
- **Secondary**: Gray tones - Professional, clean
- **Accents**: Yellow, blue for plant care badges
- **Backgrounds**: White, light gray, gradient greens

### Typography
- **Font Family**: Inter
- **Headings**: Bold, 3xl-7xl sizes
- **Body**: Regular, 16px base
- **Line Height**: Comfortable 1.5-1.75

### Spacing
- **Consistent Padding**: 4, 6, 8, 12, 16 units
- **Section Spacing**: py-16 (64px) between sections
- **Card Spacing**: gap-6 (24px) in grids

### Animations
- **Hover Effects**: Scale, shadow, color transitions
- **Page Transitions**: Smooth fade-ins
- **Loading States**: Button disable with text change
- **Scroll Animations**: Elements fade in on scroll

---

## 🔧 Technical Features

### Performance
- **Next.js 14 App Router**: Latest React features
- **Image Optimization**: Automatic with next/image
- **Code Splitting**: Automatic route-based splitting
- **Fast Refresh**: Instant feedback during development

### SEO
- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media preview images
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling rules
- **Semantic HTML**: Proper heading hierarchy

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab-accessible elements
- **Focus States**: Visible focus indicators
- **Alt Text**: All images have descriptive alt text
- **Color Contrast**: WCAG AA compliant

### Mobile-First
- **Responsive Grid**: 1-4 columns based on viewport
- **Touch-Friendly**: Large tap targets (min 44px)
- **Mobile Menu**: Hamburger navigation
- **Swipe Gestures**: Image carousel navigation
- **Viewport Meta**: Proper scaling on mobile

### Developer Experience
- **TypeScript**: Full type safety
- **ESLint**: Code quality checks
- **Prettier**: Code formatting
- **Component Library**: Reusable UI components
- **Utility Functions**: Helper functions for common tasks

---

## 🚀 Future Enhancements

### Shopping Cart
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persistence (localStorage)
- [ ] Cart total calculation

### Checkout
- [ ] Shipping information form
- [ ] Payment integration (Stripe)
- [ ] Order confirmation
- [ ] Email receipts

### User Accounts
- [ ] User registration
- [ ] Login/logout
- [ ] Profile management
- [ ] Order history
- [ ] Saved addresses

### Product Features
- [ ] Product reviews and ratings
- [ ] Wishlist/favorites
- [ ] Product comparison
- [ ] Stock notifications
- [ ] Product recommendations

### Content
- [ ] Blog/articles
- [ ] Plant care guides
- [ ] Video tutorials
- [ ] FAQ database
- [ ] Community forum

### Admin
- [ ] Product management
- [ ] Order management
- [ ] Customer management
- [ ] Analytics dashboard
- [ ] Inventory tracking

---

## 📊 Component Inventory

### UI Components (shadcn/ui based)
- ✅ Button (with variants)
- ✅ Card (with sub-components)
- ✅ Input
- ✅ Textarea
- ✅ Label

### Custom Components
- ✅ Navbar (sticky, mobile menu)
- ✅ Footer (multi-column, newsletter)
- ✅ ProductCard (with all features)
- ✅ SectionHeader (centered, with subtitle)
- ✅ AnimateOnScroll (intersection observer)

### Layout Components
- ✅ Root Layout (with metadata)
- ✅ Page Layouts (consistent structure)

### Utility Functions
- ✅ cn() - Class name merger
- ✅ Product helpers (get, filter, search)
- ✅ Constants (site config, categories)

---

## 🎯 User Experience Highlights

1. **Fast Loading**: Optimized images and code splitting
2. **Intuitive Navigation**: Clear menu structure
3. **Visual Hierarchy**: Important info stands out
4. **Helpful Feedback**: Loading states, success messages
5. **Trust Signals**: Guarantees, reviews, security badges
6. **Easy Shopping**: Quick filters, clear pricing
7. **Mobile Optimized**: Works great on all devices
8. **Accessible**: Screen reader friendly
9. **Beautiful Design**: Modern, clean aesthetic
10. **Consistent Branding**: Cohesive visual language

---

Built with attention to detail and love for plants 🌱

