const config = require("./config.js");
// Adaptive icon, splash image and their canvas colours — written by
// `yarn theme:icon` from the logo and the active theme seed.
const branding = require("./src/assets/images/branding.json");

// The minimum iOS version, set once for the app target and its extensions.
// 16.4 is the lowest Expo SDK 57 supports.
const iosDeploymentTarget = "16.4";

module.exports = {
    expo: {
        owner: config.general.owner,
        name: config.general.appName,
        slug: config.general.slug,
        // Your store version, deliberately not tied to the boilerplate's own
        // version in package.json — bump it on your release schedule, not ours.
        version: "1.0.0",
        orientation: "portrait",
        icon: config.general.icon,
        scheme: config.general.scheme,
        userInterfaceStyle: "automatic",
        ios: {
            supportsTablet: true,
            usesAppleSignIn: true,
            deploymentTarget: iosDeploymentTarget,
            bundleIdentifier: config.general.iosBundleIdentifier,
            config: {
                // Skips the App Store Connect "Missing Compliance" TestFlight
                // stall. Flip to true if the app adds crypto beyond HTTPS/TLS.
                usesNonExemptEncryption: false
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: branding.adaptiveIcon,
                backgroundColor: branding.background.light
            },
            package: config.general.androidPackageName,
            permissions: [],
        },
        plugins: [
            "expo-font",
            "expo-secure-store",
            "expo-router",
            "expo-localization",
            "expo-web-browser",
            "expo-image",
            "expo-sharing",
            [
                "expo-splash-screen",
                {
                    image: branding.splashIcon,
                    backgroundColor: branding.background.light,
                    dark: {
                        image: branding.splashIconDark,
                        backgroundColor: branding.background.dark
                    },
                    "imageWidth": 200
                }
            ],
            [
                "expo-image-picker",
                {
                    photosPermission: "The app accesses your photos so you can set a profile picture.",
                    cameraPermission: "The app uses the camera so you can take a profile picture.",
                    microphonePermission: false
                }
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        minSdkVersion: 24
                    },
                    ios: {
                        // An app built with the iOS 27 SDK (Xcode 27) crashes at launch
                        // unless it adopts the UIKit scene lifecycle. Expo SDK 58 adopts
                        // it by default, so this goes when the app moves to SDK 58.
                        enableSceneSupport: true
                    }
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {
                origin: false
            },
            // Omitted while empty so `eas build` asks for `eas init` rather than
            // resolving another account's project.
            ...(config.general.easProjectId
                ? { eas: { projectId: config.general.easProjectId } }
                : {}),
        }
    }
};