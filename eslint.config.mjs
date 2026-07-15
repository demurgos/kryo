import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
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

export default defineConfig([globalIgnores(["**/node_modules"]), {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/eslint-recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        globals: {},
        parser: tsParser,
    },

    rules: {
        "block-scoped-var": "error",
        curly: ["error", "all"],
        "dot-location": ["error", "property"],
        eqeqeq: "error",

        indent: ["error", 2, {
            SwitchCase: 1,
        }],

        "linebreak-style": ["error", "unix"],
        "no-duplicate-imports": "off",
        "no-eval": "error",
        "no-label-var": "error",
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "no-var": "error",
        "one-var-declaration-per-line": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],

        "semi-spacing": ["error", {
            before: false,
            after: true,
        }],

        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "space-before-blocks": ["error", "always"],
        "space-infix-ops": "error",
        "unicode-bom": ["error", "never"],
    },
}]);