/**
 * Tailwind CSS Configuration
 * Defines custom theme colors, fonts, and content paths
 * 
 * @module tailwind.config
 * @see https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#333333',              // Primary text color
        'rustic-red': '#9B2226',            // Brand accent color
        'faded-cream': '#F4F1DE',           // Background color
        'construction-yellow': '#FFC300',   // Call-to-action color
      },
      fontFamily: {
        'heading': ['Oswald', 'sans-serif'],  // Bold, uppercase headings
        'body': ['Inter', 'sans-serif'],      // Clean, readable body text
      },
    },
  },
  plugins: [],
}
