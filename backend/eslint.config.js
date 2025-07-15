<<<<<<< HEAD
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  {
    ignores: ["node_modules", "dist", "coverage"],
  },
]);
=======
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
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'max-len': ['warn', { code: 300 }],
  },
  extends: [js.configs.recommended],
  ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
});
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
