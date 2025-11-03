// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // note plugin import
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
                project: "./tsconfig.json",
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            import: importPlugin,
        },
        extends: [
            // note: flat config uses module imports rather than string extends; but you can merge
            js.configs.recommended,
        ],
        rules: {
            "no-multiple-empty-lines": [2, { max: 2 }],
            semi: [2, "always"],
            curly: ["warn"],
            "prefer-template": ["warn"],
            "space-before-function-paren": [0, { anonymous: "always", named: "always" }],
            camelcase: 0,
            "no-return-assign": 0,
            quotes: ["error", "single"],

            "no-unused-vars": "off",
            "no-undef": "off",

            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],

            "import/no-unresolved": 0,
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "type",
                        "object",
                    ],
                    "newlines-between": "always",
                },
            ],
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },
    },
    prettier,
]);
