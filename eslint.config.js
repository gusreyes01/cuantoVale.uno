module.exports = [
  {
    files: ["app/js/**/*.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        angular: "readonly",
        Promise: "readonly",
        window: "readonly",
        document: "readonly",
        Option: "readonly",
        module: "readonly",
        URL: "readonly",
        fetch: "readonly",
        setTimeout: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "args": "after-used" }]
    }
  }
];
