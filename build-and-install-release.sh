#!/bin/bash

echo "📦 Generant bundle JavaScript per a Android (release)..."
mkdir -p android/app/src/main/assets

npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

echo "🧼 Netejant compilació anterior..."
cd android
./gradlew clean

echo "🏗️ Compilant APK en mode release..."
./gradlew assembleRelease

echo "🗑️ Desinstal·lant versió anterior si existeix..."
adb uninstall com.gpstrackerapp

echo "📲 Instal·lant nova versió release..."
adb install app/build/outputs/apk/release/app-release.apk

echo "✅ Fet! Obre l'app manualment o executa:"
echo "    adb shell monkey -p com.gpstrackerapp -c android.intent.category.LAUNCHER 1"
