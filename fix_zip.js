// fix_zip.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Installing archiver...");
try {
  execSync('npm install archiver --no-save', { stdio: 'inherit' });
} catch(e) {}

import archiver from 'archiver';

const output = fs.createWriteStream(path.join(__dirname, '../ReadyCBAHI-Replit.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log('✅ Zip file created successfully! Total bytes: ' + archive.pointer());
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add directories entirely but we will use glob to exclude node_modules
archive.glob('**/*', {
  cwd: __dirname,
  ignore: ['node_modules/**', '.git/**', '.env', '*.zip', 'dist/**'] // ignoring dist if root has one, but we need frontend/dist natively!
});

// A safer way is to append files individually or use glob properly
// Actually, let's just use directory function. 
// Wait, archive.glob works perfectly.
archive.finalize();
