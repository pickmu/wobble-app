export default {
  expo: {
    name: "Wobble",
    slug: "Wobble-Taxi",
    version: "1.0.9",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#1C75BC",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pickmeup01.Wobble",
      infoPlist: {
        ExpoLocalization_supportsRTL: true,
        CFBundleAllowMixedLocalizations: true,
        NSLocationWhenInUseUsageDescription:
          "Your location is used to find closest drivers to you.",
        NSLocationAlwaysUsageDescription:
          "Your location is used to find closest drivers to you.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Your location is used to find closest drivers to you.",
        NSPhotoLibraryUsageDescription:
          "Allow app to use the photo library to update your profile image.",
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_MAP_API_KEY,
      },
      buildNumber: "8",
    },
    android: {
      package: "com.pickmeup01.Wobble",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1C75BC",
      },
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_MAP_API_KEY,
        },
      },
      versionCode: 8,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "b6f27941-5ae8-479e-9589-015c3b1f13fe",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/b6f27941-5ae8-479e-9589-015c3b1f13fe",
    },
    owner: "pickmeup01",
  },
};
