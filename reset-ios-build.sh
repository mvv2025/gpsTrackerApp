#!/bin/bash

echo "🔧 Reiniciant compilació d’iOS per React Native..."

# Atura Metro bundler si està en marxa
echo "⛔️ Tancant Metro bundler..."
pkill -f "node .*react-native"

# Esborra DerivedData (compilacions anteriors de Xcode)
echo "🧹 Eliminant DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData

# Elimina compilacions iOS
echo "🧹 Eliminant build d’iOS..."
rm -rf ios/build

# Elimina node_modules
echo "🧹 Eliminant node_modules..."
rm -rf node_modules

# Neteja watchman (si el tens instal·lat)
echo "🧹 Netejant watchman..."
watchman watch-del-all 2>/dev/null

# Reinstal·la dependències npm
echo "📦 Instal·lant dependències amb npm..."
npm install

# Pod install (i neteja prèvia)
cd ios || exit 1
echo "🧹 Deintegrant Pods..."
pod deintegrate
echo "📦 Instal·lant Pods..."
pod install --repo-update
cd ..

echo "✅ Entorn iOS netejat i reconstruït!"
echo "🚀 Ara pots executar: npx react-native run-ios"
