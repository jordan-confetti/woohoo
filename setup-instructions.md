# Woohoo App - Setup and Installation Guide

## Overview

Woohoo is a social app that allows friends to record moments when they meet in person. The app uses a unique "phone tap" mechanism to create posts showing where and when friends met. This guide will help you set up the development environment and run the app on iOS.

## Prerequisites

- macOS (required for iOS development)
- Node.js (v14 or later)
- Watchman (`brew install watchman`)
- Xcode (latest version recommended)
- CocoaPods (`sudo gem install cocoapods`)
- iOS Simulator or physical iOS device

## Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd woohoo-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Install CocoaPods dependencies**

```bash
cd ios
pod install
cd ..
```

4. **Start the Metro bundler**

```bash
npm start
```

5. **Run the app on iOS**

In a new terminal window:

```bash
npm run ios
```

## App Structure

The app is structured using React Native with the following organization:

- `/src/api` - API service functions
- `/src/assets` - Images, fonts, and other static assets
- `/src/components` - Reusable UI components
- `/src/navigation` - Navigation configuration
- `/src/screens` - App screens
- `/src/store` - Redux store and slices
- `/src/utils` - Utility functions and constants

## Key Features

1. **Phone Tapping Interaction**
   - Uses NFC to detect when phones tap
   - Creates a "woohoo" moment between two users

2. **Authentication**
   - Phone number verification
   - User profile creation

3. **Friend Management**
   - Add friends
   - View friend profiles

4. **Feed**
   - View woohoo interactions between users
   - See locations where friends met

5. **Profile Statistics**
   - Track friendships
   - View woohoo count and locations

## Development Notes

### Simulating the NFC Feature

Since the NFC feature requires physical devices, we've implemented a simulation mode for development:

1. In development mode, tapping the "tap phones" button will simulate the NFC interaction
2. This triggers the loading screen and creates a mock woohoo post

### Testing Push Notifications

For testing push notifications:

1. Use the Expo push notification testing tool
2. Or manually trigger notifications using the development menu

## Building for Production

### iOS

```bash
expo build:ios
```

Follow the prompts to build either an Ad Hoc or App Store IPA file.

### Publishing to App Store

1. Use Xcode to archive the app
2. Use the App Store Connect portal to manage your app submission
3. Follow Apple's guidelines for app review

## Troubleshooting

- **Metro bundler issues**: Clear the cache with `npm start -- --reset-cache`
- **iOS build errors**: Check CocoaPods installation and run `pod install` again
- **NFC permissions**: Ensure proper usage descriptions in Info.plist

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Apple Developer Portal](https://developer.apple.com/)
