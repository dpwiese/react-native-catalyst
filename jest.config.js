module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation/.*)",
  ],
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
  moduleNameMapper: {
    "\\.(html)$": "<rootDir>/__mocks__/fileMock.js",
  }
};
