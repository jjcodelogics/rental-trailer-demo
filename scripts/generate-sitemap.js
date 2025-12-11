import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your website hostname
const hostname = 'https://texastoughrentals.com'; // Update with your actual domain

// Define your pages
const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/trailer.html', changefreq: 'weekly', priority: 0.9 },
  { url: '/about-me.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact.html', changefreq: 'monthly', priority: 0.8 },
];

async function generateSitemap() {
  const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
  
  // Create a stream to write to
  const writeStream = createWriteStream(sitemapPath);
  const sitemap = new SitemapStream({ hostname });

  console.log('Generating sitemap...');

  // Write each URL to the sitemap
  urls.forEach(url => sitemap.write(url));

  // End the stream
  sitemap.end();

  // Generate sitemap
  const sitemapOutput = await streamToPromise(sitemap);
  
  writeStream.write(sitemapOutput.toString());
  writeStream.end();

  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
}

// Run the function
generateSitemap().catch(err => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});
