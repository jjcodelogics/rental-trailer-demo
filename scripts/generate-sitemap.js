import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFileSync } from 'fs';
import { Readable } from 'stream';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your website hostname
const hostname = 'https://texastoughtrentals.com'; // Update with your actual domain

// Define your pages with clean URLs
const currentDate = new Date().toISOString();

const urls = [
  { 
    url: '/', 
    lastmod: currentDate,
    changefreq: 'weekly', 
    priority: 1.0 
  },
  { 
    url: '/trailer', 
    lastmod: currentDate,
    changefreq: 'weekly', 
    priority: 0.9 
  },
  { 
    url: '/about-me', 
    lastmod: currentDate,
    changefreq: 'monthly', 
    priority: 0.7 
  },
  { 
    url: '/contact', 
    lastmod: currentDate,
    changefreq: 'monthly', 
    priority: 0.8 
  },
];

// Generate sitemap WITHOUT XSLT (pure XML for Google)
async function generateSitemap() {
  const stream = new SitemapStream({ 
    hostname,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false
    }
  });

  const data = await streamToPromise(Readable.from(urls).pipe(stream));
  
  // Format XML with proper indentation for readability
  const xmlString = data.toString();
  
  // Write sitemap.xml
  writeFileSync(resolve(__dirname, '../public/sitemap.xml'), xmlString);
  
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  console.log(`   Total URLs: ${urls.length}`);
}

// Run the function
generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
