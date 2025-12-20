# Texas Tough Rentals - Trailer Rental Website

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A modern, responsive web application for a trailer rental business featuring serverless API integration, advanced form validation, and optimized performance.

![Project Banner](src/assets/images/branding/logo.webp)

## 🎯 Project Overview

This is a **production-ready portfolio project** demonstrating full-stack web development skills for a fictional trailer rental business. The application showcases modern web development practices, including responsive design, serverless architecture, form validation, and performance optimization.

**Key Technologies:**
- **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6+)
- **Build Tool:** Vite
- **Validation:** Zod
- **Backend:** Serverless Functions (Vercel)
- **Email Service:** Brevo API
- **Analytics:** Vercel Analytics & Speed Insights

## ✨ Features

### User-Facing Features
- 📱 **Fully Responsive Design** - Optimized for mobile, tablet, and desktop
- 🎨 **Custom Tailwind Theme** - Professional branding with custom color palette
- 📅 **Date Range Picker** - Flatpickr integration for rental date selection
- ✉️ **Email Notifications** - Automated emails to customers and business owner
- 🔍 **SEO Optimized** - Structured data, meta tags, and sitemap
- ⚡ **Fast Load Times** - Optimized images (WebP), code splitting, lazy loading
- ♿ **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

### Developer Features
- 🔐 **Input Sanitization** - XSS protection with Zod schemas
- 🛡️ **Rate Limiting** - IP-based protection against spam
- 📊 **Distance Calculation** - Geocoding API integration for delivery quotes
- 🧪 **Client & Server Validation** - Dual-layer validation for data integrity
- 📝 **Comprehensive Documentation** - JSDoc comments throughout codebase
- 🏗️ **Clean Architecture** - Modular component structure
- 🚀 **Production Build** - Minification, tree-shaking, source map removal

## 📁 Project Structure

```
rental-trailer-demo/
├── api/                          # Serverless API functions
│   ├── handlers/
│   │   ├── confirm-booking.js    # Booking confirmation handler
│   │   └── submit-trailer-inquiry.js  # Inquiry submission handler
│   └── utils/                    # API utilities
├── config/                       # Configuration files
│   ├── constants.js             # Application constants
│   └── env/                     # Environment configs
├── docs/                        # Comprehensive documentation
│   ├── API.md                   # API endpoint documentation
│   ├── DEPLOYMENT.md            # Deployment instructions
│   ├── PROJECT-STRUCTURE.md     # Architecture overview
│   ├── QUICK-START.md           # Getting started guide
│   ├── SECURITY-AUDIT.md        # Security considerations
│   └── PERFORMANCE.md           # Performance optimizations
├── public/                      # Static assets
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/                     # Build and utility scripts
│   ├── convert-to-webp.js      # Image optimization
│   └── generate-sitemap.js     # Sitemap generation
├── src/
│   ├── assets/
│   │   ├── documents/          # PDF documents
│   │   └── images/             # Image assets
│   ├── css/
│   │   └── style.css           # Main stylesheet (Tailwind)
│   ├── js/
│   │   ├── main.js             # Application entry point
│   │   ├── structured-data.js  # Schema.org JSON-LD
│   │   ├── components/         # Reusable UI components
│   │   │   ├── back-to-top.js
│   │   │   ├── date-picker.js
│   │   │   ├── delivery-option.js
│   │   │   └── mobile-menu.js
│   │   ├── config/
│   │   │   └── config.js       # Client-side configuration
│   │   └── utils/
│   │       ├── api/
│   │       │   └── form-handler.js  # Form submission logic
│   │       └── validation/
│   │           ├── schemas.js       # Zod validation schemas
│   │           └── trailer-schema.js
│   └── pages/                  # HTML page sources
├── *.html                      # Production HTML files
├── package.json                # Project dependencies
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite build configuration
└── vercel.json                # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rental-trailer-demo.git
   cd rental-trailer-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   BREVO_API_KEY=your_brevo_api_key
   EMAIL_SENDER=your_sender_email@example.com
   EMAIL_OWNER=business_owner@example.com
   GEOCODING_API_KEY=your_google_geocoding_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Generate sitemap and build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run generate:sitemap` | Generate XML sitemap |
| `npm run convert:webp` | Convert images to WebP format |
| `npm run clean` | Remove dist directory |

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Quick Start Guide](docs/QUICK-START.md)** - Get up and running quickly
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Project Structure](docs/PROJECT-STRUCTURE.md)** - Architecture overview
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Vercel or other platforms
- **[Performance Optimizations](docs/PERFORMANCE.md)** - Performance techniques used
- **[Security Audit](docs/SECURITY-AUDIT.md)** - Security best practices

## 🔒 Security Features

- **Input Sanitization** - All user inputs are sanitized to prevent XSS attacks
- **Rate Limiting** - IP-based request throttling (5 requests per hour)
- **HTTPS Only** - Production deployment requires secure connections
- **Content Security Policy** - Configured via Vercel headers
- **Environment Variables** - Sensitive data stored securely

## 🎨 Design Highlights

### Custom Color Palette
- **Charcoal** (#333333) - Primary text
- **Rustic Red** (#9B2226) - Brand accent
- **Construction Yellow** (#FFC300) - Call-to-action
- **Faded Cream** (#F4F1DE) - Background

### Typography
- **Headings:** Oswald (Bold, uppercase)
- **Body:** Inter (Clean, readable)

### Key UI Components
- Responsive navigation with mobile hamburger menu
- Smooth scroll back-to-top button
- Interactive date range picker
- Form validation with inline error messages
- Loading states and success notifications

## 📈 Performance Metrics

- ⚡ **First Contentful Paint:** < 1.5s
- 🎯 **Largest Contentful Paint:** < 2.5s
- 📦 **Total Bundle Size:** < 150KB (gzipped)
- 🖼️ **Image Optimization:** WebP format, lazy loading
- 🔧 **Code Splitting:** Vendor chunks separated

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- Portfolio: [yourportfolio.com](https://yourportfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- **Tailwind CSS** - For the utility-first CSS framework
- **Vite** - For blazing-fast build tooling
- **Flatpickr** - For the date picker component
- **Zod** - For schema validation
- **Vercel** - For hosting and serverless functions
- **Brevo** - For transactional email service

---

**Built with ❤️ as a portfolio project to demonstrate modern web development skills**
