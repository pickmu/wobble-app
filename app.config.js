export default {
  expo: {
    name: "Wobble",
    slug: "Wobble-Taxi",
    version: "1.0.92",
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
      buildNumber: "10",
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
      versionCode: 10,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "onesignal-expo-plugin",
        {
          mode: "development",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      ["expo-location"],
      "expo-font",
    ],
    extra: {
      eas: {
        projectId: "b6f27941-5ae8-479e-9589-015c3b1f13fe",
      },
    },
    runtimeVersion: "exposdk:51.0.8",
    updates: {
      url: "https://u.expo.dev/b6f27941-5ae8-479e-9589-015c3b1f13fe",
    },
    owner: "pickmeup01",
  },
};
