module.exports = function(api) {
  api.cache(true);
  
  // Only use react-native-web plugin for web platform
  const isWeb = process.env.BABEL_ENV === 'web' || 
                process.env.EXPO_TARGET === 'web' ||
                process.env.NODE_ENV === 'test';
  
  const plugins = [];
  
  if (isWeb) {
    plugins.push('react-native-web');
  }

  return {
    presets: ['babel-preset-expo'],
    plugins,
    env: {
      production: {
        plugins: isWeb ? ['react-native-web'] : [],
      },
    },
  };
};
