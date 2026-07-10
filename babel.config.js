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

  // Vision Camera v5 frame processors i Reanimated 4 używają runtime
  // `react-native-worklets`, więc kompilujemy worklety jego pluginem.
  // Musi być ostatni na liście.
  plugins.push('react-native-worklets-core/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
