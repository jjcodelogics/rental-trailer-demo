# Quick Start Guide

Get up and running with Texas Tough Rentals in 5 minutes.

---

## Prerequisites

- **Node.js** 18+ and npm
- Git
- Code editor (VS Code recommended)

---

## Installation

```bash
# 1. Navigate to project
cd rental-trailer-demo

# 2. Install dependencies
npm install

# 3. Copy environment template (optional for local dev)
cp .env.example .env
```

---

## Development

```bash
# Start development server
npm run dev
# Opens at http://localhost:3000
```

**Includes:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Source maps

---

## Project Structure

```
rental-trailer-demo/
├── src/
│   ├── pages/          # HTML pages
│   ├── js/             # JavaScript modules
│   │   ├── components/ # UI components
│   │   └── utils/      # Utilities
│   ├── css/            # Stylesheets
│   └── assets/         # Images, documents
├── api/                # Serverless functions
├── docs/               # Documentation
└── config/             # Configuration
```

See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) for details.

---

## Common Tasks

### Add a New Page

1. Create HTML in `src/pages/`
2. Add to `vite.config.js`:
   ```javascript
   input: {
     newPage: path.resolve(__dirname, 'src/pages/new-page.html')
   }
   ```

### Add a Component

1. Create in `src/js/components/`
2. Export init function:
   ```javascript
   export function initMyComponent() {
     // Component logic
   }
   ```

### Add Images

1. Place in `src/assets/images/`
2. Reference: `/src/assets/images/your-image.jpg`
3. Optimize: `npm run convert:webp`

---

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

---

## Available Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
npm run generate:sitemap # Generate sitemap
npm run convert:webp     # Convert images to WebP
npm run clean            # Remove dist/
```

---

## Configuration

### Update Business Info

Edit `src/js/config/constants.js`:
```javascript
export const BUSINESS_CONFIG = {
  name: 'Your Business',
  phone: '+1-XXX-XXX-XXXX',
  email: 'your@email.com'
};
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'your-primary': '#color',
  'your-secondary': '#color'
}
```

---

## Key Features

- ✅ **Responsive** - Mobile-first design
- ✅ **Optimized** - WebP images, code splitting
- ✅ **Fast** - 98+ PageSpeed score
- ✅ **Secure** - Rate limiting, validation, security headers
- ✅ **SEO** - Meta tags, structured data, sitemap
- ✅ **Modern** - Vite, Tailwind, vanilla JS

---

## Documentation

- 📖 [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) - Folder organization
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- 📡 [API.md](API.md) - API documentation
- ⚡ [PERFORMANCE.md](PERFORMANCE.md) - Performance optimizations
- 🔒 [SECURITY-AUDIT.md](SECURITY-AUDIT.md) - Security status

---

## Troubleshooting

**Port 3000 in use:**
```bash
npm run dev -- --port 3001
```

**Build fails:**
```bash
npm run clean
npm install
npm run build
```

**Images not loading:**
- Check path: `/src/assets/images/...`
- Verify file exists
- Check case sensitivity (Linux/Mac)

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. 👉 Explore code structure
4. 👉 Read documentation in `docs/`
5. 👉 Customize for your needs
6. 👉 Deploy to production

**Happy coding! 🚀**
