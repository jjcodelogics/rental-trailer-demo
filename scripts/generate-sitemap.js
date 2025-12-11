import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFileSync } from 'fs';
import { Readable } from 'stream';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your website hostname
const hostname = 'https://texastoughtrentals.com'; // Update with your actual domain

// Define your pages
const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/trailer.html', changefreq: 'weekly', priority: 0.9 },
  { url: '/about-me.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact.html', changefreq: 'monthly', priority: 0.8 },
];

// Generate sitemap WITHOUT XSLT (pure XML for Google)
async function generateSitemap() {
  const stream = new SitemapStream({ 
    hostname
    // Removed xslUrl - Google doesn't like styled sitemaps
  });

  const data = await streamToPromise(Readable.from(urls).pipe(stream));
  
  // Write sitemap.xml
  writeFileSync(resolve(__dirname, '../public/sitemap.xml'), data.toString());
  
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
}

// Run the function
generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
