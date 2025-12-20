/**
 * PostCSS Configuration
 * Processes CSS with Tailwind CSS and Autoprefixer
 * 
 * @module postcss.config
 */

export default {
  plugins: {
    tailwindcss: {},    // Processes Tailwind directives
    autoprefixer: {},   // Adds vendor prefixes for browser compatibility
  },
}
