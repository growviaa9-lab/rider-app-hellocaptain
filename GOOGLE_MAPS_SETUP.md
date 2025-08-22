# Google Maps Setup Instructions

This document provides step-by-step instructions to configure Google Maps for the ride-hailing driver app.

## Prerequisites

1. Google Cloud Platform account
2. Enabled Google Maps SDK for iOS and Android
3. React Native development environment set up

## Step 1: Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for iOS
   - Maps SDK for Android
   - Geolocation API
   - Places API (if using place search)
4. Create credentials → API Key
5. Restrict the API key for security:
   - For iOS: Add your app's bundle identifier
   - For Android: Add your app's package name and SHA-1 certificate fingerprint

## Step 2: iOS Configuration

### Update Info.plist

Add the Google Maps API key to `ios/helloCaptainRider/Info.plist`:

```xml
<key>GMSApiKey</key>
<string>YOUR_GOOGLE_MAPS_API_KEY_HERE</string>
```

### Update AppDelegate.swift

Add Google Maps initialization to `ios/helloCaptainRider/AppDelegate.swift`:

```swift
import GoogleMaps

// Add this inside the application(_:didFinishLaunchingWithOptions:) method
GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY_HERE")
```

### Update location permission description

Update the location permission in `ios/helloCaptainRider/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show your position on the map and find nearby rides.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs location access to show your position on the map and find nearby rides.</string>
```

## Step 3: Android Configuration

### Update AndroidManifest.xml

Add the following to `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- Add this inside the application tag -->
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE" />
</application>

<!-- Add these permissions before the application tag -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Step 4: Install Required Packages

The following packages are already installed:
- `react-native-maps`
- `@react-native-community/geolocation`
- `react-native-permissions`

## Step 5: Link Native Dependencies

### For iOS:
```bash
cd ios && pod install
```

### For Android:
The packages should auto-link with React Native 0.60+

## Step 6: Update Map Component

In `src/components/Map/index.tsx`, uncomment and update the Google Maps API key:

```typescript
<MapView
  // ... other props
  googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY_HERE"
/>
```

## Step 7: Test the Implementation

1. Build and run the app on iOS/Android
2. Grant location permissions when prompted
3. Verify the map loads correctly
4. Test the online/offline toggle
5. Test the ride request simulation

## Security Notes

1. Never commit API keys to version control
2. Use environment variables for API keys in production
3. Restrict API keys to specific platforms and APIs
4. Monitor API usage in Google Cloud Console

## Troubleshooting

### Common Issues:

1. **Map not loading**: Check API key and enabled APIs
2. **Location not working**: Verify permissions in device settings
3. **Build errors**: Ensure all native dependencies are properly linked

### iOS Specific:
- Clean build folder: Product → Clean Build Folder in Xcode
- Delete derived data
- Reinstall pods: `cd ios && rm -rf Pods && pod install`

### Android Specific:
- Clean project: `cd android && ./gradlew clean`
- Reset Metro cache: `npx react-native start --reset-cache`

## Production Considerations

1. Implement proper error handling for location services
2. Add offline map support if needed
3. Optimize map performance for low-end devices
4. Implement map clustering for multiple markers
5. Add proper loading states and error boundaries
