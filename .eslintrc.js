module.exports = {
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "airbnb-base",
    "airbnb-typescript/base",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2021,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "ignorePatterns": [
    ".eslintrc.js",
    "*.config.js"
  ],
  rules: {
    'import/prefer-default-export': 'off',
  },
}
