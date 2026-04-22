import { copyFileSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootOutputDir = join(process.cwd(), 'dist', 'our-special-day');
const browserOutputDir = join(rootOutputDir, 'browser');

if (!existsSync(browserOutputDir)) {
  console.error(`Browser output not found: ${browserOutputDir}`);
  process.exit(1);
}

for (const entry of readdirSync(browserOutputDir, { withFileTypes: true })) {
  const sourcePath = join(browserOutputDir, entry.name);
  const targetPath = join(rootOutputDir, entry.name);

  if (entry.isDirectory()) {
    cpSync(sourcePath, targetPath, { recursive: true, force: true });
    continue;
  }

  copyFileSync(sourcePath, targetPath);
}

console.log('Prepared Vercel output in dist/our-special-day');