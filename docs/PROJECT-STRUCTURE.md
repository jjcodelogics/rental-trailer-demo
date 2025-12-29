# Project Structure

Complete directory structure and organization guide.

---

## Directory Tree

```
rental-trailer-demo/
├── .editorconfig                 # Editor settings
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Code formatting
├── CONTRIBUTING.md               # Contribution guide
├── LICENSE                       # License file
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── README.md                     # Main docs
├── QUALITY-CHECKLIST.md          # Quality checklist
├── tailwind.config.js            # Tailwind config
├── vercel.json                   # Vercel deployment
├── vite.config.js                # Vite build config
│
├── *.html                        # HTML pages (root level)
│   ├── index.html                # Homepage
│   ├── trailer.html              # Trailer details
│   ├── about-me.html             # About page
│   ├── contact.html              # Contact page
│   └── confirm-booking.html      # Booking confirmation
│
├── api/                          # Serverless API
│   ├── handlers/                 # Endpoint handlers
│   │   ├── confirm-booking.js
│   │   └── submit-trailer-inquiry.js
│   └── utils/                    # API utilities
│
├── docs/                         # Documentation
│   ├── API.md                    # API reference
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── IMAGE-OPTIMIZATION.md     # Image optimization guide
│   ├── PERFORMANCE.md            # Performance guide
│   ├── PERFORMANCE-IMPROVEMENTS.md
│   ├── PORTFOLIO-SUMMARY.md      # Portfolio summary
│   ├── PROJECT-STRUCTURE.md      # This file
│   ├── QUICK-START.md            # Quick start guide
│   └── SECURITY-AUDIT.md         # Security status
│
├── public/                       # Static assets
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/                      # Build scripts
│   ├── convert-to-webp.js       # Image optimization
│   └── generate-sitemap.js      # Sitemap generation
│
└── src/                          # Source code
    ├── assets/                   # Static assets
    │   └── images/               # Organized images
    │       ├── branding/         # Logos
    │       ├── favicons/         # Icons
    │       └── trailers/         # Trailer photos
    │
    ├── css/                      # Stylesheets
    │   ├── flatpickr.min.css    # Date picker styles
    │   └── style.css            # Main styles
    │
    └── js/                       # JavaScript
        ├── components/           # UI components
        │   ├── back-to-top.js
        │   ├── date-picker.js
        │   ├── delivery-option.js
        │   ├── faq-accordion.js
        │   ├── mobile-menu.js
        │   └── trailer-calculator.js
        ├── config/               # JS config
        │   ├── config.js
        │   └── constants.js      # Business constants
        ├── utils/                # Utilities
        │   ├── api/              # API utils
        │   │   └── form-handler.js
        │   └── validation/       # Form validation
        │       ├── schemas.js
        │       └── trailer-schema.js
        ├── confirm-booking.js    # Booking confirmation handler
        ├── main.js               # Main entry point
        ├── speed-insights.js     # Vercel Speed Insights
        ├── structured-data.js    # SEO structured data
        └── trailer-init.js       # Trailer page init
```

---

## Key Directories

### `src/`
Source code and assets.

- **js/** - JavaScript modules (components, utils, config)
- **css/** - Stylesheets
- **assets/** - Images and static files

### `api/`
Serverless API functions.

### `docs/`
All project documentation files.

- **handlers/** - API endpoint implementations
- **utils/** - Shared API utilities

### `docs/`
Project documentation.

- **API.md** - API reference
- **DEPLOYMENT.md** - Deployment instructions
- **PERFORMANCE.md** - Performance optimizations
- **SECURITY-AUDIT.md** - Security status
- **QUICK-START.md** - Quick start guide

### `config/`
Configuration files.

- **constants.js** - Business configuration
- **env/** - Environment-specific settings

### `scripts/`
Build and utility scripts.

- **convert-to-webp.js** - Image optimization
- **generate-sitemap.js** - SEO sitemap

---

## Path References

### HTML
```html
<!-- Images -->
<img src="/src/assets/images/branding/logo.jpg">

<!-- CSS -->
<link rel="stylesheet" href="/src/css/style.css">

<!-- JavaScript -->
<script type="module" src="/src/js/main.js"></script>
```

### JavaScript
```javascript
// Components
import { initMobileMenu } from '/src/js/components/mobile-menu.js';

// Utilities
import { handleInquiryForm } from '/src/js/utils/api/form-handler.js';
import { trailerInquirySchema } from '/src/js/utils/validation/trailer-schema.js';
```

### API
- `/api/submit-trailer-inquiry` → `api/handlers/submit-trailer-inquiry.js`
- `/api/confirm-booking` → `api/handlers/confirm-booking.js`

---

## Benefits

1. **Organized** - Clear separation of concerns
2. **Scalable** - Easy to add features
3. **Maintainable** - Logical structure
4. **Professional** - Industry standard
5. **DX** - Better IDE support

---

## Development Workflow

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build production
npm run preview          # Preview build
npm run generate:sitemap # Generate sitemap
npm run convert:webp     # Optimize images
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [QUICK-START.md](QUICK-START.md) | Get started in 5 minutes |
| [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) | This file |
| [API.md](API.md) | API documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment guide |
| [PERFORMANCE.md](PERFORMANCE.md) | Performance optimizations |
| [SECURITY-AUDIT.md](SECURITY-AUDIT.md) | Security status |

---

## Next Steps

- [ ] Set up ESLint for linting
- [ ] Add automated testing
- [ ] Create component library
- [ ] Consider TypeScript
- [ ] Document design system
