# 🌿 Getting Started with Folia

Welcome to your new Folia urban gardening website! This guide will help you get up and running in minutes.

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 What's Been Built

### Pages
✅ **Home Page** (`/`)
- Hero section with CTA buttons
- Featured products grid
- Why Folia section (4 value props)
- Customer testimonials
- Call-to-action section

✅ **Shop Page** (`/shop`)
- Product grid with 15 sample products
- Category filtering (Plants, Pots, Tools, Kits)
- Responsive layout (1-4 columns)

✅ **Product Detail** (`/shop/[slug]`)
- Image carousel with thumbnails
- Product information and pricing
- Quantity selector
- Add to cart button
- Plant care badges (difficulty, light, watering)
- Related products section

✅ **About Page** (`/about`)
- Brand story and mission
- Core values section
- Sustainability commitment
- Company timeline

✅ **Contact Page** (`/contact`)
- Contact form with validation
- Contact information cards
- Social media links
- Business hours
- FAQ section

✅ **404 Page**
- Custom not found page

### Components

**Layout Components:**
- `Navbar` - Sticky header with mobile menu
- `Footer` - Multi-column footer with newsletter

**UI Components (shadcn/ui):**
- `Button` - Multiple variants and sizes
- `Card` - With header, content, footer
- `Input` - Form input field
- `Textarea` - Multi-line input
- `Label` - Form labels

**Custom Components:**
- `ProductCard` - Featured product display
- `SectionHeader` - Page section titles
- `AnimateOnScroll` - Scroll animations

### Data & Types
- 15 sample products in `data/products.json`
- TypeScript types in `types/product.ts`
- Product helper functions in `lib/products.ts`

### SEO & Metadata
- Meta tags on all pages
- Open Graph images
- Sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Dynamic metadata for products

---

## 📂 Key Files to Know

```
folia/
├── app/
│   ├── page.tsx              ← Home page
│   ├── shop/page.tsx         ← Shop listing
│   ├── shop/[slug]/page.tsx  ← Product detail
│   ├── about/page.tsx        ← About page
│   ├── contact/page.tsx      ← Contact page
│   └── layout.tsx            ← Root layout with Navbar/Footer
├── components/
│   ├── layout/               ← Navbar and Footer
│   ├── ui/                   ← Base UI components
│   ├── ProductCard.tsx       ← Product card component
│   └── SectionHeader.tsx     ← Section headers
├── data/
│   └── products.json         ← Product database
├── lib/
│   ├── products.ts           ← Product helpers
│   └── utils.ts              ← Utility functions
└── tailwind.config.ts        ← Tailwind configuration
```

---

## 🎯 Next Steps

### 1. Customize Content

**Update Product Data:**
Edit `data/products.json` to add your real products.

**Change Brand Info:**
- Update `lib/constants.ts` for site-wide settings
- Modify footer links in `components/layout/Footer.tsx`
- Update contact info in `app/contact/page.tsx`

**Change Colors:**
Edit the CSS variables in `app/globals.css`:
```css
:root {
  --primary: 142 76% 36%;  /* Your brand color */
}
```

### 2. Add Images

Replace the placeholder Unsplash URLs in `products.json` with your own images:
- Use high-quality photos (800x800px minimum)
- Optimize images before uploading
- Host on a CDN for best performance

### 3. Set Up Environment Variables

Create `.env.local` for API keys:
```bash
# Example
NEXT_PUBLIC_STRIPE_KEY=your_key_here
EMAIL_API_KEY=your_key_here
```

### 4. Implement Shopping Cart

Add cart functionality:
- Create cart context/store
- Add "Add to Cart" functionality
- Build cart page
- Implement checkout

### 5. Deploy to Production

**Deploy to Vercel (Easiest):**
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# Then connect to Vercel
# Visit vercel.com and import your repo
```

---

## 🛠️ Common Tasks

### Add a New Product
1. Open `data/products.json`
2. Copy an existing product object
3. Update all fields with new product info
4. Increment the ID
5. Create a unique slug

### Add a New Page
1. Create `app/your-page/page.tsx`
2. Add navigation link in `components/layout/Navbar.tsx`
3. Update footer links if needed

### Change Site Colors
1. Edit `app/globals.css` (CSS variables)
2. Update `tailwind.config.ts` if needed
3. Restart dev server

### Add More Product Categories
1. Update `types/product.ts` to add category
2. Add category to `lib/products.ts` getCategories()
3. Products will automatically filter

---

## 📱 Testing

### Test on Different Devices
- Desktop (Chrome, Firefox, Safari)
- Mobile (iOS Safari, Chrome)
- Tablet (iPad, Android)

### Test Key Flows
1. Browse products → Filter → View detail
2. Read about page → Navigate to shop
3. Submit contact form
4. Mobile menu navigation

---

## 🚀 Performance Tips

1. **Optimize Images:**
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Use Next.js Image component (already implemented)

2. **Enable Caching:**
   - Deploy to Vercel for automatic edge caching
   - Configure CDN for images

3. **Monitor Performance:**
   - Use Lighthouse in Chrome DevTools
   - Check Core Web Vitals
   - Monitor with Vercel Analytics

---

## 🐛 Troubleshooting

**Issue: Port 3000 already in use**
```bash
# Kill the process or use different port
npm run dev -- -p 3001
```

**Issue: TypeScript errors**
```bash
# Check types
npm run build
```

**Issue: Styles not updating**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue: Images not loading**
- Check image URLs are accessible
- Verify `next.config.mjs` has correct domains
- Use absolute URLs for external images

---

## 📚 Learn More

**Documentation:**
- [Full Feature List](FEATURES.md)
- [Development Guide](DEVELOPMENT.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

**Inspiration:**
- Original inspiration: [MyAangan](https://www.myaangan.in/)
- Plant shop examples: The Sill, Bloomscape, Léon & George

---

## 💡 Tips for Success

1. **Start Small**: Get familiar with the codebase before major changes
2. **Use TypeScript**: The types will help prevent bugs
3. **Test Mobile First**: Most users will browse on phones
4. **Optimize Early**: Don't wait until launch to optimize images
5. **Get Feedback**: Show to friends/family and iterate
6. **Monitor Analytics**: Track what users do on your site
7. **Keep It Simple**: Don't over-complicate features initially

---

## 🎉 You're All Set!

Your Folia website is ready to grow! Start by customizing the content, adding your products, and making it your own.

**Need Help?**
- Check `FEATURES.md` for detailed feature documentation
- Read `DEVELOPMENT.md` for technical details
- Review the code comments for inline guidance

Happy gardening! 🌱

---

**Built with:**
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Love for plants 💚

