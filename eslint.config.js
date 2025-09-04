import eslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

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
  ...compat.extends("prettier"),
  {
  languageOptions: {
     parser: eslintParser,
     parserOptions: {
       project: 'tsconfig.json',
       sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin, 
  },

  rules: {},
}];