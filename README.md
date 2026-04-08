# MarketMind — Financial Markets Learning App

A Duolingo-style mobile app for learning financial markets, derivatives, and quantitative finance basics.

## Features
- 📚 5 progressive lessons (Markets, Stocks, Bonds, Options, Black-Scholes)
- 🧠 3 question types: Multiple choice, True/False, Fill in the blank
- ⚡ XP & Level system (+10 XP per correct answer, Level up every 100 XP)
- 🔥 Daily streak tracker
- 🔒 Progressive lesson unlocking (score ≥ 70% to unlock next)
- 🎨 Premium dark UI with Cosmic Precision design

## Tech Stack
- **React Native** with **Expo**
- **Expo Router** (file-based routing)
- **Zustand** + **AsyncStorage** (persistent state)
- **TypeScript**

## Build APK (Cloud)

The GitHub Actions workflow automatically builds an APK on every push to `main`.

1. Go to the **Actions** tab in this repository
2. Click the latest **"Build Android APK"** workflow run
3. Download the `marketmind-debug.apk` from **Artifacts**

## Install on Android

1. Transfer the `.apk` file to your Android phone (via USB, email, or cloud)
2. On your phone, go to **Settings → Security → Install Unknown Apps** (or "Unknown Sources")
3. Enable unknown sources for your file manager or browser
4. Open the `.apk` file and tap **Install**
5. Launch **MarketMind** from your home screen!

## Run Locally (Development)

```bash
npm install --legacy-peer-deps
npx expo start
```
