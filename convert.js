const sharp = require('sharp');
const fs = require('fs');

async function convert() {
  try {
    // 1. Convert education minister
    await sharp('./public/education_minister.png')
      .webp({ quality: 80 })
      .toFile('./public/education_minister.webp');
    console.log('Converted education minister to WebP');

    // 2. Convert cockroach
    await sharp('C:\\Users\\HP\\.gemini\\antigravity\\brain\\b5db4b20-0afe-41b9-9a15-f8b3b70f4ccd\\realistic_cockroach_1779304046610.png')
      .resize(100) // resize to be small and optimized
      .webp({ quality: 80 })
      .toFile('./public/cockroach.webp');
    console.log('Converted cockroach to WebP');
  } catch (err) {
    console.error(err);
  }
}

convert();
