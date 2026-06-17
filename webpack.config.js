const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add module aliases to handle react-native imports
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': 'react-native-web',
    'react-native-google-mobile-ads$': path.resolve(__dirname, './src/mocks/google-mobile-ads.js'),
    'react-native/Libraries/vendor/emitter/EventEmitter$': path.resolve(__dirname, './src/mocks/EventEmitter.js'),
  };

  // Add fallback for packages that don't work on web
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
  };

  return config;
};

