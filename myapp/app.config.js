export default {
  expo: {
    name: "SecureIt",
    slug: "myapp",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/iicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/secureit.png",
      resizeMode: "cover",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
      ],
      adaptiveIcon: {
        foregroundImage: "./screens/mylogo.png",
        backgroundColor: "#FFFFFF",
      },
      package: "my.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
