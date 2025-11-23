# Texas Tough Rentals

A static small business website for trailer rentals built with Vite, pure JavaScript, and CSS (no frameworks).

## Features

- **Pure JS/CSS**: No frameworks, just vanilla JavaScript and CSS
- **Vite Build System**: Fast development and optimized production builds
- **Zod Validation**: Form validation and sanitization using Zod via Import Maps
- **Responsive Design**: Mobile-friendly layout
- **Multiple Pages**: Home page and inquiry form

## Project Structure

```
rental-trailer-demo/
├── index.html              # Main landing page
├── inquiry.html            # Rental inquiry form page
├── package.json            # NPM dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── schemas.js     # Zod validation schemas
└── public/                # Static assets (optional)
```

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/jjcodelogics/rental-trailer-demo.git
cd rental-trailer-demo

# Install dependencies
npm install
```

## CLI Commands

### Development Server
Start the development server with hot module replacement:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Production Build
Build the project for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build
Preview the production build locally:

```bash
npm run preview
```

## Import Maps

This project uses [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) to load Zod directly from a CDN without bundling it. The import map is defined in both HTML files:

```html
<script type="importmap">
  {
    "imports": {
      "zod": "https://cdn.jsdelivr.net/npm/zod@3.22.4/+esm"
    }
  }
</script>
```

This allows ES modules to import Zod like this:

```javascript
import { z } from 'zod';
```

## Form Validation

The inquiry form uses Zod for client-side validation and sanitization. The validation schema is defined in `src/js/schemas.js` and includes:

- Name validation (2-100 characters)
- Email validation and normalization
- Phone number format validation
- Trailer type selection
- Rental date validation (must be today or future)
- Duration validation (1-30 days)
- Optional message field (max 500 characters)

## Technologies Used

- **Vite 5.x**: Build tool and development server
- **Zod 3.22.x**: Schema validation library
- **Pure JavaScript**: No frameworks or libraries (except Zod for validation)
- **CSS3**: Modern CSS with CSS Grid and Flexbox
- **Import Maps**: Native ES module imports

## Browser Support

- Modern browsers with ES2020+ support
- Import Maps support (Chrome 89+, Firefox 108+, Safari 16.4+)

## License

This project is licensed under the ISC License - see the LICENSE file for details.
