const config = require('./config.js');
const branding = require('./src/assets/images/branding.json');

module.exports = {
  expo: {
    owner: config.owner,
    name: config.appName,
    slug: config.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: config.icon,
    scheme: config.scheme,
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      deploymentTarget: '16.4',
      bundleIdentifier: config.iosBundleIdentifier,
      config: {
        // Skips the "Missing Compliance" TestFlight stall. Set to true if the app adds crypto beyond HTTPS.
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: branding.adaptiveIcon,
        backgroundColor: branding.background.light,
      },
      package: config.androidPackageName,
      permissions: [],
    },
    plugins: [
      'expo-font',
      'expo-secure-store',
      'expo-router',
      'expo-localization',
      [
        'expo-splash-screen',
        {
          image: branding.splashIcon,
          imageWidth: 200,
          backgroundColor: branding.background.light,
          dark: {
            image: branding.splashIconDark,
            backgroundColor: branding.background.dark,
          },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos so you can set a profile picture.',
          cameraPermission: 'The app uses the camera so you can take a profile picture.',
          microphonePermission: false,
        },
      ],
      [
        'expo-build-properties',
        {
          android: { minSdkVersion: 24 },
          ios: {
            // An app built with the iOS 27 SDK crashes at launch without the UIKit scene lifecycle.
            // Expo SDK 58 adopts it by default, so this goes with that upgrade.
            enableSceneSupport: true,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: { origin: false },
      // Omitted while empty so `eas build` asks for `eas init` rather than resolving another account's project.
      ...(config.easProjectId ? { eas: { projectId: config.easProjectId } } : {}),
    },
  },
};
