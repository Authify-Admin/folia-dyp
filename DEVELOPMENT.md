# Folia Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
folia/
├── app/                      # Next.js App Router pages
│   ├── (routes)/
│   │   ├── page.tsx         # Home page
│   │   ├── shop/            # Shop pages
│   │   │   ├── page.tsx     # Product listing
│   │   │   └── [slug]/      # Product detail
│   │   ├── about/           # About page
│   │   └── contact/         # Contact page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── robots.ts            # SEO robots
│   └── sitemap.ts           # SEO sitemap
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ProductCard.tsx      # Product card component
│   ├── SectionHeader.tsx    # Section header component
│   └── AnimateOnScroll.tsx  # Animation wrapper
├── lib/                     # Utility functions
│   ├── utils.ts            # General utilities
│   ├── products.ts         # Product helpers
│   └── constants.ts        # App constants
├── types/                   # TypeScript types
│   └── product.ts          # Product types
├── data/                    # Static data
│   └── products.json       # Product database
└── public/                  # Static assets

```

## 🎨 Design System

### Colors
- **Primary Green**: `#22c55e` (hsl: 142, 76%, 36%)
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Same as primary for consistency

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes (3xl-7xl)
- **Body**: Regular weight, comfortable line height

### Components
All UI components are built with:
- **Tailwind CSS** for styling
- **shadcn/ui** patterns for consistency
- **CVA (Class Variance Authority)** for variants

## 🛍️ Adding Products

Products are stored in `data/products.json`. Each product follows this structure:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Short description",
  "longDescription": "Detailed description",
  "price": 49.99,
  "originalPrice": 69.99,  // Optional for discounts
  "category": "plants|pots|tools|kits",
  "images": ["image-url-1", "image-url-2"],
  "featured": true,
  "inStock": true,
  "difficulty": "Easy|Moderate|Advanced",  // For plants
  "light": "Low|Medium|Bright",            // For plants
  "watering": "Low|Moderate|High",         // For plants
  "features": ["Feature 1", "Feature 2"]
}
```

## 🎯 Key Features

### Implemented
✅ Responsive design (mobile-first)
✅ Product filtering by category
✅ Product detail pages with image carousel
✅ Contact form with validation
✅ SEO optimization (meta tags, sitemap, robots.txt)
✅ Smooth animations and hover effects
✅ 30-day guarantee and shipping info
✅ Newsletter signup
✅ Social media integration

### Future Enhancements
- [ ] Shopping cart functionality
- [ ] Payment integration (Stripe)
- [ ] User authentication
- [ ] Order history
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Real-time inventory management
- [ ] Blog/content management
- [ ] Search functionality
- [ ] Product recommendations

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Environment Variables:**
If you add any API keys or secrets, add them in Vercel's dashboard:
- Project Settings → Environment Variables

### Deploy to Other Platforms

The project can also be deployed to:
- **Netlify**: Use the Next.js build plugin
- **Railway**: Full-stack deployment
- **AWS Amplify**: Automatic CI/CD
- **Self-hosted**: Build with `npm run build` and serve with `npm start`

## 🔧 Customization

### Changing Colors
Edit `tailwind.config.ts` and `app/globals.css` to update the color scheme:

```css
:root {
  --primary: 142 76% 36%;  /* Change this for different brand color */
}
```

### Adding Pages
1. Create a new folder in `app/`
2. Add a `page.tsx` file
3. Update navigation in `components/layout/Navbar.tsx`

### Modifying Layout
- **Navbar**: Edit `components/layout/Navbar.tsx`
- **Footer**: Edit `components/layout/Footer.tsx`
- **Global Layout**: Edit `app/layout.tsx`

## 📱 Responsive Breakpoints

```
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large devices
2xl: 1400px - Container max-width
```

## 🐛 Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Image Issues
- Ensure images are accessible (check URLs)
- Add domains to `next.config.mjs` if using external images

### Type Errors
- Run type check: `npm run build` (includes type checking)
- Check `tsconfig.json` for strict mode settings

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is built for educational and demonstration purposes. Feel free to use it as a template for your own projects!

---

Built with ❤️ and 🌱 by the Folia team

