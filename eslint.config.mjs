import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
    globalIgnores([
        '**/node_modules',
        '**/build',
        '**/lib',
        '**/esm',
        '**/prism.js',
        'packages/create-react-admin/templates/**/*',
    ]),
    {
        name: 'eslint-js-recommended-rules',
        plugins: {
            js,
        },
        extends: ['js/recommended'],
    },
    tseslint.configs.recommended.map(conf => ({
        ...conf,
        files: ['**/*.ts', '**/*.tsx'],
    })),
    {
        ...jsxA11y.flatConfigs.recommended,
        ignores: ['**/*.spec.*', '**/*.stories.*'],
    },
    eslintPluginPrettierRecommended,
    {
        name: 'react',
        ...react.configs.flat.recommended,
    },
    reactHooks.configs['recommended-latest'],
    {
        name: 'react-admin-rules',
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-use-before-define': 'off',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@mui/material',
                            importNames: ['makeStyles', 'createMuiTheme'],
                            message:
                                'Please import from @mui/material/styles instead. See https://material-ui.com/guides/minimizing-bundle-size/#option-2 for more information',
                        },
                        {
                            name: '@mui/icons-material',
                            message:
                                "Named import from @mui/icons-material should be avoided for performance reasons. Use a default import instead. E.g. `import Dashboard from '@mui/icons-material/Dashboard';` instead of `import { Dashboard } from '@mui/icons-material';`.See https://mui.com/material-ui/guides/minimizing-bundle-size/#development-environment for more information.",
                        },
                        {
                            name: 'lodash',
                            message:
                                "Named import from lodash should be avoided for performance reasons. Use a default import instead. E.g. `import merge from 'lodash/merge';` instead of `import { merge } from 'lodash';`.",
                        },
                    ],
                },
            ],
            '@typescript-eslint/no-redeclare': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    caughtErrors: 'none',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/prefer-as-const': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                    enforceForJSX: false,
                },
            ],
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unsafe-function-types': 'off',
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
            '@typescript-eslint/no-unnecessary-type-constraints': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-empty-object-types': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/jsx-key': 'off',
            'react/no-unescaped-entities': 'off',
            'react/no-children-prop': 'off',
            'react/no-children-props': 'off',
            'react/react-in-jsx-scope': 'off',
            eqeqeq: ['warn', 'smart'],
            'no-case-declarations': 'off',
            'no-prototype-builtins': 'off',
            'prefer-spread': 'off',
            'jsx-a11y/no-autofocus': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        name: 'test-rules',
        files: ['**/*.spec.*'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    {
        name: 'cypress-rules',
        files: ['cypress/**/*'],
        plugins: {
            cypress,
        },
        languageOptions: {
            globals: {
                ...cypress.environments.globals.globals,
            },
        },
    },
]);
