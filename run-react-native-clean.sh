#!/bin/bash

echo "🔍 Comprovant si el port 8081 està ocupat..."
PID=$(lsof -ti :8081)

if [ -n "$PID" ]; then
  echo "🛑 Trobats processos usant el port 8081. Matant PID: $PID"
  kill -9 $PID
else
  echo "✅ El port 8081 està lliure."
fi

echo "🧼 Netegem Metro cache i iniciem servidor Metro..."
npx react-native start --reset-cache &
sleep 5

echo "🚀 Iniciem aplicació a Android..."
npx react-native run-android
