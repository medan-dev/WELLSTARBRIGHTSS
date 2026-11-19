const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  console.log('Generating EDUREXA brand assets for favicon and link preview...');

  const logoSourcePath = path.join(__dirname, '..', 'public', 'edurexa-logo.png');
  const markSourcePath = path.join(__dirname, '..', 'public', 'edurexa-mark.png');

  if (!fs.existsSync(logoSourcePath) || !fs.existsSync(markSourcePath)) {
    throw new Error('Source images not found in public/');
  }

  // 1. Generate Favicon & App Icons
  // A clean, high-visibility 512x512 icon for app/icon.png and public/icon.png
  // The mark (emblem: student rising with graduation cap and open book in orange & navy)
  // centered on a transparent canvas with crisp proportions
  const markResized = await sharp(markSourcePath)
    .resize(440, null, { fit: 'inside' })
    .toBuffer();
  const markMeta = await sharp(markResized).metadata();

  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    {
      input: markResized,
      top: Math.round((512 - markMeta.height) / 2),
      left: Math.round((512 - markMeta.width) / 2)
    }
  ]).png().toBuffer();

  // Write app/icon.png and public/icon.png
  fs.writeFileSync(path.join(__dirname, '..', 'app', 'icon.png'), icon512);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon.png'), icon512);
  console.log('✓ Created app/icon.png & public/icon.png (512x512)');

  // 2. Generate Apple Touch Icon (180x180)
  // Apple guidelines specify opaque background (no alpha) for crisp homescreen appearance
  const markForApple = await sharp(markSourcePath)
    .resize(140, null, { fit: 'inside' })
    .toBuffer();
  const appleMarkMeta = await sharp(markForApple).metadata();

  const appleIcon = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  }).composite([
    {
      input: markForApple,
      top: Math.round((180 - appleMarkMeta.height) / 2),
      left: Math.round((180 - appleMarkMeta.width) / 2)
    }
  ]).png().toBuffer();

  fs.writeFileSync(path.join(__dirname, '..', 'app', 'apple-icon.png'), appleIcon);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-icon.png'), appleIcon);
  console.log('✓ Created app/apple-icon.png & public/apple-icon.png (180x180)');

  // 3. Generate standard favicon.ico (multi-resolution / 48x48)
  const favicon48 = await sharp(icon512)
    .resize(48, 48)
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), favicon48);
  console.log('✓ Created public/favicon.ico (48x48)');

  // 4. Generate OpenGraph and Twitter Link Preview (1200 x 630 px)
  const width = 1200;
  const height = 630;

  // The full EDUREXA logo resized to 750px width for dominant brand visibility
  const fullLogo = await sharp(logoSourcePath)
    .resize(750, null, { fit: 'inside' })
    .toBuffer();
  const fullLogoMeta = await sharp(fullLogo).metadata();

  // Create an ultra-clean, elegant enterprise light background with subtle accents
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#eff6ff" />
        </linearGradient>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="30" flood-color="#0b2256" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- Main Canvas Gradient -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Soft Ambient Brand Halos -->
      <circle cx="120" cy="100" r="300" fill="#f26522" opacity="0.04" />
      <circle cx="1080" cy="530" r="360" fill="#0b2256" opacity="0.05" />

      <!-- Central Enterprise Card Container -->
      <rect x="40" y="36" width="1120" height="558" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#cardShadow)" />

      <!-- Inner Subtle Border Accent -->
      <rect x="41" y="37" width="1118" height="556" rx="27" fill="none" stroke="#f1f5f9" stroke-width="1" />

      <!-- Top Enterprise Badge -->
      <g transform="translate(600, 96)">
        <rect x="-240" y="-18" width="480" height="36" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <circle cx="-212" cy="0" r="5" fill="#f26522" />
        <text x="-194" y="5" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0b2256" letter-spacing="1.5">SMART SCHOOL MANAGEMENT ECOSYSTEM</text>
      </g>

      <!-- Bottom Verified Capabilities Bar -->
      <g transform="translate(600, 524)">
        <!-- Badge 1 -->
        <g transform="translate(-405, 0)">
          <rect x="-115" y="-18" width="230" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
          <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#334155">&#127979; Flagship: Wellstar Bright SS</text>
        </g>
        <!-- Badge 2 -->
        <g transform="translate(-135, 0)">
          <rect x="-115" y="-18" width="230" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
          <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#334155">&#9889; Multi-Tenant Cloud SaaS</text>
        </g>
        <!-- Badge 3 -->
        <g transform="translate(135, 0)">
          <rect x="-115" y="-18" width="230" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
          <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#334155">&#128202; Academics, Fees &amp; UNEB</text>
        </g>
        <!-- Badge 4 -->
        <g transform="translate(405, 0)">
          <rect x="-115" y="-18" width="230" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
          <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#334155">&#128101; Admins, Teachers &amp; Parents</text>
        </g>
      </g>
    </svg>
  `);

  const bgBuffer = await sharp(svgOverlay).png().toBuffer();

  const logoTop = Math.round((height - fullLogoMeta.height) / 2) - 8;
  const logoLeft = Math.round((width - fullLogoMeta.width) / 2);

  const ogCard = await sharp(bgBuffer).composite([
    {
      input: fullLogo,
      top: logoTop,
      left: logoLeft
    }
  ]).png().toBuffer();

  // Write to public/edurexa-og.png, app/opengraph-image.png, and app/twitter-image.png
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'edurexa-og.png'), ogCard);
  fs.writeFileSync(path.join(__dirname, '..', 'app', 'opengraph-image.png'), ogCard);
  fs.writeFileSync(path.join(__dirname, '..', 'app', 'twitter-image.png'), ogCard);
  console.log('✓ Created public/edurexa-og.png, app/opengraph-image.png & app/twitter-image.png (1200x630)');

  console.log('All brand assets generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
