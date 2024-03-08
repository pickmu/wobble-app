export default {
  expo: {
    name: "Wobble",
    slug: "Wobble-Taxi",
    version: "1.0.3",
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
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_MAP_API_KEY,
      },
      buildNumber: "4",
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
      versionCode: 4,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-localization"],
    extra: {
      supportsRTL: true,
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
