module.exports = function (api) {
  api.cache(true);

  const plugins = [];
  if (process.env.MOCK_FACE_DETECTOR === '1') {
    plugins.push([
      'module-resolver',
      {
        alias: {
          'react-native-vision-camera-face-detector': './app/mocks/react-native-vision-camera-face-detector.js',
        },
      },
    ]);
  }

  // Vision Camera v5 frame processors and Reanimated 4 use the
  // `react-native-worklets` runtime, so we compile worklets with its plugin.
  // It must be last in the list.
  plugins.push('react-native-worklets-core/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
