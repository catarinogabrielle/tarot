// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Platform support
config.resolver.platforms = ['ios', 'android', 'native'];

// Add module aliases for unavailable modules
config.resolver.alias = {
  'react-native/Libraries/Core/Devtools/getDevServer': path.resolve(__dirname, './src/mocks/getDevServer.js'),
  'react-native/Libraries/vendor/emitter/EventEmitter': path.resolve(__dirname, './src/mocks/EventEmitter.js'),
};

// Custom resolver to handle missing modules gracefully
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle specific problematic modules
  if (moduleName && moduleName.includes('react-native/Libraries/Core/Devtools/getDevServer')) {
    return {
      filePath: path.resolve(__dirname, './src/mocks/getDevServer.js'),
      type: 'sourceFile',
    };
  }
  
  if (moduleName && moduleName.includes('react-native/Libraries/vendor/emitter/EventEmitter')) {
    return {
      filePath: path.resolve(__dirname, './src/mocks/EventEmitter.js'),
      type: 'sourceFile',
    };
  }

  // Fall back to original resolver
  if (originalResolveRequest) {
    try {
      return originalResolveRequest(context, moduleName, platform);
    } catch (e) {
      // Silently fail for web-only modules when building for native
      if (moduleName && moduleName.includes('react-native-web')) {
        return null;
      }
      throw e;
    }
  }

  return null;
};

module.exports = config;
