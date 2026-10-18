#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const configXml = path.join(rootDir, 'public', 'config.xml');
const destConfig = path.join(distDir, 'config.xml');
const destIcon = path.join(distDir, 'logo.png');
const srcIcon = path.join(rootDir, 'public', 'logo.png');
const outputWgt = path.join(distDir, 'AetherFlix.wgt');

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[35m%s\x1b[0m', '           AETHERFLIX - SAMSUNG TIZEN TV PACKAGER          ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');

if (!fs.existsSync(distDir)) {
  console.log('Building web bundle first (npm run build)...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
}

// Copy config.xml and logo.png to dist
if (fs.existsSync(configXml)) {
  fs.copyFileSync(configXml, destConfig);
  console.log('✓ Copied config.xml to dist/');
}
if (fs.existsSync(srcIcon)) {
  fs.copyFileSync(srcIcon, destIcon);
  console.log('✓ Copied logo.png to dist/');
}

// Package into .wgt using python3 zipfile
console.log('Packaging into AetherFlix.wgt...');
try {
  if (fs.existsSync(outputWgt)) {
    fs.unlinkSync(outputWgt);
  }
  const pythonCmd = `python3 -c "import zipfile, os; wgt = zipfile.ZipFile('${outputWgt}', 'w', zipfile.ZIP_DEFLATED); [wgt.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), '${distDir}')) for r, d, files in os.walk('${distDir}') for f in files if not f.endswith(('.wgt', '.apk', '.dmg', '.exe', '.deb', '.rpm', '.AppImage', '.zip', '.blockmap', '.yaml'))]; wgt.close()"`;
  execSync(pythonCmd, { stdio: 'inherit' });

  const stats = fs.statSync(outputWgt);
  console.log(`\x1b[32m✓ Successfully created AetherFlix.wgt (${(stats.size / 1024 / 1024).toFixed(2)} MB)\x1b[0m`);
  console.log(`\nLocation: ${outputWgt}`);
  console.log('\n\x1b[33mInstallation on Samsung Smart TV:\x1b[0m');
  console.log('1. On TV: Apps -> Press 1 2 3 4 5 on remote to open Developer Mode');
  console.log('2. Set Host PC IP to this machine, reboot your Samsung TV');
  console.log('3. Connect via SDB: sdb connect <YOUR_TV_IP>');
  console.log('4. Install package: sdb install ' + outputWgt);
  console.log('5. Enjoy AetherFlix on your Samsung Smart TV!\n');
} catch (err) {
  console.error('Packaging failed:', err.message);
  process.exit(1);
}
