#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const distDir = path.join(rootDir, 'dist');
const apkSrc = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const apkDest = path.join(distDir, 'AetherFlix.apk');

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[35m%s\x1b[0m', '  AETHERFLIX - ANDROID TV / GOOGLE TV / FIRE TV RELEASE    ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');

// Ensure dist folder exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Ensure Android project is setup
if (!fs.existsSync(androidDir)) {
  console.log('Running Android TV setup first...');
  execSync('node scripts/setup-android.js', { cwd: rootDir, stdio: 'inherit' });
}

// Sync latest web build to Android assets
console.log('Building web bundle and syncing to Android...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
execSync('npx cap sync android', { cwd: rootDir, stdio: 'inherit' });

// Ensure local.properties has Android SDK path
const localProps = path.join(androidDir, 'local.properties');
if (!fs.existsSync(localProps)) {
  const possiblePaths = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    '/opt/homebrew/share/android-commandlinetools',
    path.join(process.env.HOME || '', 'Library', 'Android', 'sdk'),
    path.join(process.env.HOME || '', 'Android', 'Sdk')
  ].filter(Boolean);

  const foundSdk = possiblePaths.find(p => fs.existsSync(p));
  if (foundSdk) {
    fs.writeFileSync(localProps, `sdk.dir=${foundSdk}\n`, 'utf8');
    console.log(`✓ Configured Android SDK location in local.properties: ${foundSdk}`);
  }
}

// Find Java 17+ if JAVA_HOME is not set
let env = { ...process.env };
if (!env.JAVA_HOME) {
  const candidates = [
    '/Users/hbl/Library/Java/JavaVirtualMachines/ms-17.0.20.1/Contents/Home',
    '/Users/hbl/Library/Java/JavaVirtualMachines/ms-17.0.19/Contents/Home'
  ];
  const foundJava = candidates.find(p => fs.existsSync(p));
  if (foundJava) {
    env.JAVA_HOME = foundJava;
  }
}

// Build release APK using Gradle
console.log('Building signed release APK via Gradle...');
try {
  execSync('./gradlew assembleRelease', { cwd: androidDir, stdio: 'inherit', env });

  if (fs.existsSync(apkSrc)) {
    fs.copyFileSync(apkSrc, apkDest);
    const stats = fs.statSync(apkDest);
    console.log(`\n\x1b[32m✓ Successfully generated AetherFlix Release APK (${(stats.size / 1024 / 1024).toFixed(2)} MB)\x1b[0m`);
    console.log(`Location: ${apkDest}`);
    console.log('\n\x1b[33mInstallation on Android TV / Google TV / Fire TV:\x1b[0m');
    console.log('1. Enable Developer Options & ADB Debugging on your TV');
    console.log('2. Connect over network: adb connect <YOUR_TV_IP>:5555');
    console.log('3. Sideload APK: adb install -r ' + apkDest);
    console.log('4. Launch AetherFlix from the Android TV Leanback launcher row!\n');
  } else {
    console.error('Release APK was not found at expected location:', apkSrc);
    process.exit(1);
  }
} catch (err) {
  console.error('Android build failed:', err.message);
  process.exit(1);
}
