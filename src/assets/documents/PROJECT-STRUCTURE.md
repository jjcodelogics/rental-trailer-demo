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
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── README.md                     # Main docs
├── tailwind.config.js            # Tailwind config
├── vercel.json                   # Vercel deployment
├── vite.config.js                # Vite build config
│
├── api/                          # Serverless API
│   ├── handlers/                 # Endpoint handlers
│   │   ├── confirm-booking.js
│   │   └── submit-trailer-inquiry.js
│   └── utils/                    # API utilities
│
├── config/                       # Configuration
│   ├── constants.js              # Business constants
│   └── env/                      # Environment configs
│
├── docs/                         # Documentation
│   ├── API.md                    # API reference
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── PERFORMANCE.md            # Performance guide
│   ├── PROJECT-STRUCTURE.md      # This file
│   ├── QUICK-START.md            # Quick start guide
│   ├── SECURITY-AUDIT.md         # Security status
│   └── README.md                 # Documentation index
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
    │   ├── documents/            # PDFs
    │   └── images/               # Organized images
    │       ├── branding/         # Logos
    │       ├── favicons/         # Icons
    │       └── trailers/         # Trailer photos
    │
    ├── css/                      # Stylesheets
    │   └── style.css
    │
    ├── js/                       # JavaScript
    │   ├── components/           # UI components
    │   │   ├── back-to-top.js
    │   │   ├── date-picker.js
    │   │   ├── delivery-option.js
    │   │   └── mobile-menu.js
    │   ├── config/               # JS config
    │   │   └── config.js
    │   ├── main.js               # Entry point
    │   ├── structured-data.js    # SEO data
    │   └── utils/                # Utilities
    │       ├── api/              # API utils
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

---

## Key Directories

### `src/`
Source code and assets.

- **pages/** - HTML pages
- **js/** - JavaScript modules (components, utils)
- **css/** - Stylesheets
- **assets/** - Images and documents

### `api/`
Serverless API functions.

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
