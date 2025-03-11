import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    // Base ESLint recommended configuration
    eslint.configs.recommended,

    // TypeScript-specific recommended configuration
    ...tseslint.configs.recommendedTypeChecked,

    {
        ignores: [
            'dist',
            'node_modules',
            'eslint.config.mjs',
            'jest.config.js',
            'scripts/**/*.mjs', // Ensure you are not ignoring your .mjs files
        ],
    },

    // Language options for TypeScript and JavaScript parsing
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Uncomment if you want to enable/disable specific rules like no-console
            // 'no-console': 'error',
        },
    },

    // ESLint configuration for handling .mjs files
    {
        files: ['scripts/**/*.mjs'], // Apply settings to .mjs files
        parser: '@babel/eslint-parser', // Use Babel parser for .mjs files
        parserOptions: {
            sourceType: 'module', // Specify that the files are ES modules
            ecmaVersion: 'latest', // Use the latest ECMAScript features
            babelOptions: {
                presets: ['@babel/preset-env'], // Use Babel preset for modern JavaScript
            },
        },
    },
]
