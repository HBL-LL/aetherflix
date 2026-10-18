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
    const internetPerm = manifest.includes('android.permission.INTERNET') ? '' : '\n    <uses-permission android:name="android.permission.INTERNET" />';
    const features = `
    <!-- Android TV Leanback support -->
    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />${internetPerm}
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

// 5. Configure release signing & generate keystore if needed
const appGradlePath = path.join(androidDir, 'app', 'build.gradle');
const keystorePath = path.join(androidDir, 'app', 'aetherflix-release.keystore');

if (fs.existsSync(appGradlePath)) {
  let gradleContent = fs.readFileSync(appGradlePath, 'utf8');
  if (!gradleContent.includes('signingConfigs')) {
    const signingSnippet = `    signingConfigs {
        release {
            storeFile file('aetherflix-release.keystore')
            storePassword 'aetherflix'
            keyAlias 'aetherflix'
            keyPassword 'aetherflix'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release`;
    gradleContent = gradleContent.replace('buildTypes {\n        release {', signingSnippet);
    fs.writeFileSync(appGradlePath, gradleContent, 'utf8');
    console.log('✓ Configured release signing in android/app/build.gradle');
  }
}

if (!fs.existsSync(keystorePath)) {
  try {
    const keytoolCmd = `keytool -genkeypair -v -keystore "${keystorePath}" -alias aetherflix -keyalg RSA -keysize 2048 -validity 10000 -storepass aetherflix -keypass aetherflix -dname "CN=AetherFlix, OU=AetherFlix, O=AetherFlix, L=SmartTV, ST=Release, C=US"`;
    execSync(keytoolCmd, { stdio: 'ignore' });
    console.log('✓ Generated release keystore at android/app/aetherflix-release.keystore');
  } catch (e) {
    console.warn('Could not auto-generate keystore with keytool:', e.message);
  }
}

console.log('\n\x1b[32m✓ Android TV setup completed successfully!\x1b[0m');
console.log('\n\x1b[33mTo build the Android TV APK in Release:\x1b[0m');
console.log('1. Run: npm run build:android:release');
console.log('2. Output APK will be at: dist/AetherFlix.apk');
console.log('3. Sideload onto Android TV / Fire TV: adb connect <TV_IP>:5555 && adb install -r dist/AetherFlix.apk\n');
