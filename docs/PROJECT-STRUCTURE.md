# Project Structure

This document describes the updated project structure after reorganization.

## Directory Tree

```
rental-trailer-demo/
├── .editorconfig                 # Editor configuration
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Code formatting rules
├── CONTRIBUTING.md               # Contribution guidelines
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Main project documentation
├── tailwind.config.js            # Tailwind CSS configuration
├── vercel.json                   # Vercel deployment config
├── vite.config.js                # Vite build configuration
│
├── api/                          # Serverless API functions
│   ├── handlers/                 # API endpoint handlers
│   │   ├── confirm-booking.js
│   │   └── submit-trailer-inquiry.js
│   └── utils/                    # API utility functions
│
├── config/                       # Application configuration
│   ├── constants.js              # Business constants
│   └── env/                      # Environment-specific configs
│
├── docs/                         # Project documentation
│   ├── API.md                    # API documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── IMAGE-OPTIMIZATION.md     # Image optimization details
│   ├── PERFORMANCE.md            # Performance improvements
│   ├── PERFORMANCE-IMPROVEMENTS.md
│   └── README.md                 # Main project docs
│
├── images/                       # Legacy images (for reference)
│   ├── favicons/
│   └── ...
│
├── public/                       # Static public assets
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/                      # Build and utility scripts
│   ├── convert-to-webp.js       # Image optimization script
│   └── generate-sitemap.js      # Sitemap generation
│
└── src/                          # Source code
    ├── assets/                   # Static assets
    │   ├── documents/            # PDF documents
    │   │   └── trailer-liability-flyer.pdf
    │   └── images/               # Organized images
    │       ├── branding/         # Logo images
    │       ├── favicons/         # Site favicons
    │       └── trailers/         # Trailer photos
    │
    ├── css/                      # Stylesheets
    │   └── style.css             # Main stylesheet
    │
    ├── js/                       # JavaScript modules
    │   ├── components/           # UI components
    │   │   ├── back-to-top.js
    │   │   ├── date-picker.js
    │   │   ├── delivery-option.js
    │   │   └── mobile-menu.js
    │   ├── config/               # JS configuration
    │   │   └── config.js
    │   ├── main.js               # Main entry point
    │   ├── structured-data.js    # SEO structured data
    │   └── utils/                # Utility functions
    │       ├── api/              # API utilities
    │       │   └── form-handler.js
    │       └── validation/       # Form validation
    │           ├── schemas.js
    │           └── trailer-schema.js
    │
    └── pages/                    # HTML pages
        ├── about-me.html
        ├── confirm-booking.html
        ├── contact.html
        ├── index.html
        └── trailer.html
```

## Key Changes

### 1. **HTML Pages** → `src/pages/`
- All HTML files moved from root to `src/pages/`
- Better organization and separation of concerns
- Easier to manage in larger projects

### 2. **JavaScript Modularization** → `src/js/`
- **components/** - Reusable UI components (mobile menu, date picker, etc.)
- **utils/api/** - API communication and form handling
- **utils/validation/** - Form validation schemas
- **config/** - JavaScript configuration files

### 3. **Assets Organization** → `src/assets/`
- **images/branding/** - Logo and brand assets
- **images/favicons/** - Site favicons
- **images/trailers/** - Trailer photos
- **documents/** - PDF and document files

### 4. **API Structure** → `api/`
- **handlers/** - API endpoint implementations
- **utils/** - Shared API utility functions

### 5. **Documentation** → `docs/`
- Consolidated all documentation files
- Created comprehensive guides for API, deployment, and performance

### 6. **Configuration Files**
- `.editorconfig` - Consistent editor settings
- `.prettierrc` - Code formatting rules
- `.env.example` - Environment variables template
- `config/constants.js` - Business configuration constants

## Path Updates

### HTML References
All HTML files now use updated paths:
- Images: `/src/assets/images/`
- CSS: `/src/css/`
- JavaScript modules: `/src/js/components/` or `/src/js/utils/`

### JavaScript Imports
```javascript
// Components
import { initMobileMenu } from '/src/js/components/mobile-menu.js';
import { initBackToTop } from '/src/js/components/back-to-top.js';
import { initDatePicker } from '/src/js/components/date-picker.js';
import { initDeliveryOption } from '/src/js/components/delivery-option.js';

// Utilities
import { handleInquiryForm } from '/src/js/utils/api/form-handler.js';
import { trailerInquirySchema } from '/src/js/utils/validation/trailer-schema.js';
```

### API Endpoints
- `/api/submit-trailer-inquiry` → `api/handlers/submit-trailer-inquiry.js`
- `/api/confirm-booking` → `api/handlers/confirm-booking.js`

## Benefits

1. **Better Organization** - Clear separation of concerns
2. **Scalability** - Easy to add new features and pages
3. **Maintainability** - Logical structure makes updates easier
4. **Professional** - Industry-standard project layout
5. **Developer Experience** - Better tooling support and IDE integration

## Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Generate sitemap
npm run generate:sitemap

# Convert images to WebP
npm run convert:webp
```

## Next Steps

- [ ] Add ESLint for JavaScript linting
- [ ] Set up automated testing
- [ ] Implement component library
- [ ] Add TypeScript support (optional)
- [ ] Create design system documentation
