import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules", "**/dist"]), {
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
    )),

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
    },

    settings: {
        react: {
            version: "detect",
        },
    },
}]);