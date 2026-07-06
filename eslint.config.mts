import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig({
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.eslintRecommended,
  ],
  ignores: [
    'lib',
    'node_modules',
    'coverage',
  ],
});
