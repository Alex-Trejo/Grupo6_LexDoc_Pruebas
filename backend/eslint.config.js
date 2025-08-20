import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{js,mjs,cjs}'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {
    js,
  },
  rules: {
   
    'max-len': ['warn', { code: 300 }],
  },
  extends: [js.configs.recommended],
  ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
});
