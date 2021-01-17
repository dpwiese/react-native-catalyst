module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    "semi": "error",
    "no-console": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true}],
    "react-hooks/exhaustive-deps": "off",
    "object-curly-spacing": ["error", "always"],
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "linebreak-style": "off",
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
      { "usePrettierrc": true }
    ],
    "react/display-name": "off",
    "sort-imports": [
      "warn",
      {
        "ignoreCase": false,
        "ignoreDeclarationSort": false,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
      }
    ]
  },
};
