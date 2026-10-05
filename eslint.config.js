const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  js.configs.recommended,
  ...expo,
  prettier,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native-safe-area-context',
              importNames: ['SafeAreaView'],
              message: "Uniwind cannot style third-party components. Use <View className='pt-safe'>.",
            },
          ],
        },
      ],
    },
  },

  // The edge functions are Deno and excluded from tsconfig.json, so type-aware rules are off for them.
  {
    files: ['supabase/functions/**/*.ts'],
    languageOptions: {
      parserOptions: { project: null, projectService: false },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      'import/no-unresolved': 'off',
    },
  },

  {
    ignores: ['**/node_modules/', '**/dist/', '**/*.config.js', '**/config.js', '**/src/lib/db/database.types.ts'],
  },
]);
