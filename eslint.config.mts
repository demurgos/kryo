import path from "node:path";
import {fileURLToPath} from "node:url";

import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends("eslint:recommended"),
  ...typescriptEslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    // languageOptions: {
    //   globals: {},
    // },

    rules: {
      "@typescript-eslint/no-namespace": ["error", {allowDeclarations: true}],

      "@typescript-eslint/no-unused-vars": ["error", {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],

      "no-restricted-syntax": [
        "error",
        // Ban `private` members
        {
          "selector": ":matches(PropertyDefinition, MethodDefinition)[accessibility=\"private\"]",
          "message": "Use `#private` members instead.",
        },
      ],

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
  },
];
