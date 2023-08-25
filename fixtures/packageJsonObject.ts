const packageJsonObject = {
  name: "package-json-processor",
  version: "1.0.0",
  main: "index.js",
  license: "MIT",
  scripts: {
    prettier: "prettier --write --ignore-unknown",
    "eslint:fix": "eslint --fix",
  },
  dependencies: {
    jest: "^29.6.4",
    "ts-jest": "^29.1.1",
    typescript: "^5.2.2",
  },
  devDependencies: {
    "@types/eslint": "8.44.2",
    "@types/jest": "^29.5.4",
    "@typescript-eslint/eslint-plugin": "6.4.1",
    "@typescript-eslint/parser": "6.4.1",
    eslint: "8.47.0",
    "eslint-config-prettier": "9.0.0",
    "eslint-plugin-import": "2.28.1",
    "eslint-plugin-prettier": "5.0.0",
    prettier: "3.0.2",
  },
};
export default packageJsonObject;
