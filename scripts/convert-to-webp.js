import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const convertImages = async () => {
  try {
    console.log('🖼️  Converting images to WebP format...\n');

    const files = await imagemin(['images/*.jpg'], {
      destination: 'images',
      plugins: [
        imageminWebp({
          quality: 85, // High quality for hero/main images
          method: 6    // Compression method (0-6, higher = better compression)
        })
      ]
    });

    console.log('✅ Conversion complete!\n');
    files.forEach(file => {
      const filename = file.sourcePath.split('/').pop();
      const webpFilename = filename.replace('.jpg', '.webp');
      console.log(`   ${filename} → ${webpFilename}`);
    });

    console.log(`\n📊 Total images converted: ${files.length}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Update HTML files to use <picture> elements with WebP + JPG fallback');
    console.log('   2. Test images display correctly in all browsers');
    console.log('   3. Keep original JPG files as fallbacks\n');

  } catch (error) {
    console.error('❌ Error converting images:', error);
    process.exit(1);
  }
};

convertImages();
