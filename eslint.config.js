// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
    // Global ignores
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "build/**",
            "coverage/**",
            "*.config.js",
            "*.config.ts",
            ".eslintcache",
            "temp/**",
            "tmp/**",
        ],
    },
    // Base JavaScript recommended rules
    js.configs.recommended,
    // TypeScript files configuration
    {
        files: ["**/*.ts", "**/*.tsx"],
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
        rules: {
            // Code style rules
            "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
            semi: ["error", "always"],
            quotes: ["error", "single", { avoidEscape: true }],
            "comma-dangle": ["error", "always-multiline"],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],

            // Best practices
            curly: ["warn", "all"],
            "prefer-template": ["warn"],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",
            "no-alert": "error",
            "no-var": "error",
            "prefer-const": "warn",
            "prefer-arrow-callback": "warn",
            "no-throw-literal": "error",
            "prefer-promise-reject-errors": "error",

            // Disable base rules that conflict with TypeScript
            "no-unused-vars": "off",
            "no-undef": "off",
            "no-redeclare": "off",
            "no-shadow": "off",

            // TypeScript-specific rules
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/no-shadow": ["error"],

            // Import/export rules
            "import/no-unresolved": "off", // Handled by TypeScript
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
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
            "import/no-duplicates": "error",
            "import/no-unused-modules": "off", // Can be slow on large projects

            // Disabled rules (project-specific preferences)
            "space-before-function-paren": "off",
            camelcase: "off",
            "no-return-assign": "off",
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
    // Compiled JavaScript files (dist folder)
    {
        files: ["dist/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "no-console": "off", // Allow console in compiled code
        },
    },
    // Configuration files
    {
        files: ["*.config.js", "*.config.ts"],
        rules: {
            "no-console": "off",
            "@typescript-eslint/no-var-requires": "off",
        },
    },
    // Prettier integration (must be last)
    prettier,
]);
