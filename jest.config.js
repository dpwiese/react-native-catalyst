module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation/.*)',
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
};
