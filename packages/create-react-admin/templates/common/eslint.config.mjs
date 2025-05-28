import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default defineConfig([
  globalIgnores(["**/node_modules", "**/dist"]),
  {
    name: "eslint-js-recommended-rules",
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended.map((conf) => ({
    ...conf,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  eslintPluginPrettierRecommended,
  {
    name: "react",
    ...react.configs.flat.recommended,
  },
  reactHooks.configs["recommended-latest"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
