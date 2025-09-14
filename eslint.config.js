import eslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginYml from 'eslint-plugin-yml'

import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
  ...eslintPluginYml.configs['flat/recommended'],
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': typescriptEslintPlugin },
    rules: {
      // your TS rules…
    },
  },
    {
    files: ['**/*.{yml,yaml}'],
    rules: {
      'yml/no-empty-mapping-value': 'off',
    },
  },

  ...compat.extends("prettier")
];