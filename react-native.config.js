module.exports = {
  dependencies: {
    'react-native-vision-camera-face-detector': {
      platforms: {
        ios: null, // disable iOS autolinking because of missing ARM64 simulator slice for MLKit
      },
    },
  },
};
