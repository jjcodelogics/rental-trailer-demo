# Quick Start Guide

This guide will help you get up and running with the Texas Tough Rentals project quickly.

## Prerequisites

- **Node.js** 18+ and npm
- Git
- A code editor (VS Code recommended)

## Installation

```bash
# 1. Navigate to the project
cd rental-trailer-demo

# 2. Install dependencies
npm install

# 3. Copy environment variables (optional for development)
cp .env.example .env
# Edit .env with your values if needed
```

## Development

```bash
# Start the development server
npm run dev

# Opens automatically at http://localhost:3000
```

The dev server includes:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh on file changes
- ✅ Source maps for debugging

## Project Structure Overview

```
rental-trailer-demo/
├── src/
│   ├── pages/          # HTML pages (index.html, trailer.html, etc.)
│   ├── js/             # JavaScript modules
│   │   ├── components/ # UI components (mobile-menu, date-picker, etc.)
│   │   └── utils/      # Utilities (form-handler, validation)
│   ├── css/            # Stylesheets
│   └── assets/         # Images and documents
├── api/                # Serverless functions
├── docs/               # Documentation
└── config/             # Configuration files
```

## Common Tasks

### Add a New Page

1. Create HTML file in `src/pages/`
2. Add to `vite.config.js` input:
   ```javascript
   input: {
     newPage: path.resolve(__dirname, 'src/pages/new-page.html')
   }
   ```
3. Link from navigation

### Add a New Component

1. Create file in `src/js/components/`
2. Export initialization function:
   ```javascript
   export function initMyComponent() {
     // Component logic
   }
   ```
3. Import in HTML:
   ```javascript
   import { initMyComponent } from '/src/js/components/my-component.js';
   ```

### Add Images

1. Place images in appropriate folder:
   - Logos → `src/assets/images/branding/`
   - Trailers → `src/assets/images/trailers/`
   - Icons → `src/assets/images/favicons/`

2. Reference in HTML:
   ```html
   <img src="/src/assets/images/branding/logo.jpg" alt="Logo">
   ```

3. Optimize to WebP:
   ```bash
   npm run convert:webp
   ```

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Build output is in the `dist/` folder.

## Deployment

### Vercel (Recommended)

1. **Push to Git repository**
2. **Connect to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects configuration

3. **Set environment variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add your API keys and configuration

4. **Deploy:**
   - Automatic on every git push
   - Or run: `vercel --prod`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guide.

## Configuration Files

- **`.editorconfig`** - Editor settings for consistent formatting
- **`.prettierrc`** - Code formatting rules
- **`vite.config.js`** - Build configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`vercel.json`** - Vercel deployment settings

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run generate:sitemap # Generate sitemap.xml
npm run convert:webp     # Convert images to WebP
npm run clean            # Remove dist folder
```

## Key Features

- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Optimized Images** - WebP format with fallbacks
- ✅ **Form Validation** - Client-side validation with Zod
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap
- ✅ **Fast Loading** - Optimized assets, code splitting
- ✅ **Modern Stack** - Vite, Tailwind CSS, vanilla JavaScript

## Customization

### Update Business Information

Edit `config/constants.js`:
```javascript
export const BUSINESS_CONFIG = {
  name: 'Your Business Name',
  phone: '+1-XXX-XXX-XXXX',
  email: 'your@email.com',
  // ...
};
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'your-primary': '#your-color',
  'your-secondary': '#your-color',
}
```

### Update Content

HTML files are in `src/pages/` - edit directly in your code editor.

## Getting Help

- 📖 **Documentation:** Check `docs/` folder
- 🐛 **Issues:** Open an issue on GitHub
- 💡 **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md)
- 📁 **Structure:** See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

## Tips

1. **Use browser DevTools** to debug JavaScript and CSS
2. **Check console** for any errors during development
3. **Test responsive** design using device emulation
4. **Run build** before deploying to catch errors early
5. **Keep dependencies updated** with `npm update`

## Troubleshooting

### Port 3000 already in use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### Build fails
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Images not loading
- Check path: `/src/assets/images/...`
- Verify file exists in correct folder
- Check case sensitivity (Linux/Mac)

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. 👉 Explore the code structure
4. 👉 Read [docs/README.md](docs/README.md) for detailed documentation
5. 👉 Customize for your needs
6. 👉 Deploy to production

**Happy coding! 🚀**
