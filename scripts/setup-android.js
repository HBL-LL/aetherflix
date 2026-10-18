#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const manifestPath = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');
const resDrawableDir = path.join(androidDir, 'app', 'src', 'main', 'res', 'drawable');
const bannerSrc = path.join(rootDir, 'public', 'tv_banner.png');

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[35m%s\x1b[0m', '         AETHERFLIX - ANDROID TV LEANBACK SETUP           ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');

// Ensure dist bundle exists before capacitor adds platform
if (!fs.existsSync(path.join(rootDir, 'dist'))) {
  console.log('Building web assets first...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
}

// 1. Add Android platform if not present
if (!fs.existsSync(androidDir)) {
  console.log('Adding Android platform via Capacitor...');
  execSync('npx cap add android', { cwd: rootDir, stdio: 'inherit' });
} else {
  console.log('Syncing Android platform via Capacitor...');
  execSync('npx cap sync android', { cwd: rootDir, stdio: 'inherit' });
}

// 2. Configure Android TV Leanback in AndroidManifest.xml
if (fs.existsSync(manifestPath)) {
  console.log('Configuring Android TV Leanback in AndroidManifest.xml...');
  let manifest = fs.readFileSync(manifestPath, 'utf8');

  // Add TV feature flags if missing
  if (!manifest.includes('android.software.leanback')) {
    const features = `
    <!-- Android TV Leanback support -->
    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`;
    manifest = manifest.replace('<application', features + '\n\n    <application');
  }

  // Add banner and cleartext traffic to <application
  if (!manifest.includes('android:banner="@drawable/tv_banner"')) {
    manifest = manifest.replace(
      '<application',
      '<application\n        android:banner="@drawable/tv_banner"\n        android:usesCleartextTraffic="true"'
    );
  }

  // Add LEANBACK_LAUNCHER intent category to main activity
  if (!manifest.includes('android.intent.category.LEANBACK_LAUNCHER')) {
    const leanbackCategory = '                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />';
    manifest = manifest.replace(
      '<category android:name="android.intent.category.LAUNCHER" />',
      '<category android:name="android.intent.category.LAUNCHER" />\n' + leanbackCategory
    );
  }

  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('✓ AndroidManifest.xml configured with Leanback TV Launcher!');
}

// 3. Copy TV Banner image to drawables
if (fs.existsSync(bannerSrc)) {
  if (!fs.existsSync(resDrawableDir)) {
    fs.mkdirSync(resDrawableDir, { recursive: true });
  }
  fs.copyFileSync(bannerSrc, path.join(resDrawableDir, 'tv_banner.png'));
  console.log('✓ Copied 16:9 TV Banner to android res/drawable/tv_banner.png');
}

// 4. Update MainActivity.java for TV WebSettings
const javaDir = path.join(androidDir, 'app', 'src', 'main', 'java', 'com', 'aetherflix', 'tv');
const mainActivityJava = path.join(javaDir, 'MainActivity.java');
if (fs.existsSync(mainActivityJava)) {
  let javaContent = fs.readFileSync(mainActivityJava, 'utf8');
  if (!javaContent.includes('setMixedContentMode')) {
    const customJava = `package com.aetherflix.tv;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Optimize WebView for Smart TV streaming & playback
        try {
            WebSettings webSettings = this.bridge.getWebView().getSettings();
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            webSettings.setMediaPlaybackRequiresUserGesture(false);
            webSettings.setDomStorageEnabled(true);
            webSettings.setDatabaseEnabled(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
`;
    fs.writeFileSync(mainActivityJava, customJava, 'utf8');
    console.log('✓ MainActivity.java optimized for Smart TV streaming!');
  }
}

console.log('\n\x1b[32m✓ Android TV setup completed successfully!\x1b[0m');
console.log('\n\x1b[33mTo build the Android TV APK:\x1b[0m');
console.log('1. Run: cd android && ./gradlew assembleDebug');
console.log('2. Output APK will be at: android/app/build/outputs/apk/debug/app-debug.apk');
console.log('3. Sideload onto Android TV / Fire TV: adb connect <TV_IP>:5555 && adb install app-debug.apk\n');
