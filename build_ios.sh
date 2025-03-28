#!/bin/bash

set -e

APP_NAME="gpsTrackerApp"
SCHEME="$APP_NAME"
WORKSPACE="ios/$APP_NAME.xcworkspace"
EXPORT_OPTIONS="ios/ExportOptions.plist"
ARCHIVE_PATH="ios/build/$APP_NAME.xcarchive"
EXPORT_PATH="ios/build"

echo "🚀 Iniciant el procés de build per a iOS..."

# 1. Elimina el build anterior si existeix
rm -rf "$ARCHIVE_PATH"
rm -rf "$EXPORT_PATH/$APP_NAME.ipa"

# 2. Compila i crea l’arxiu .xcarchive
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  -quiet

echo "📦 Arxiu creat: $ARCHIVE_PATH"

# 3. Exporta el .ipa des de l’arxiu
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -allowProvisioningUpdates \
  -quiet

# 4. Mostra el resultat
IPA_PATH="$EXPORT_PATH/$APP_NAME.ipa"

if [ -f "$IPA_PATH" ]; then
  echo "✅ IPA exportada correctament a:"
  echo "$IPA_PATH"
else
  echo "❌ Error: No s'ha pogut generar l'arxiu .ipa"
  exit 1
fi
