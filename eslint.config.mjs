import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "backend/app/build/**",
      "backend/app/dist/**",
      "backend/app/.cache/**",
      "backend/app/.tmp/**",
      "backend/app/.strapi/**",
      "backend/app/types/generated/**",
      "backend/app/src/admin/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["packages/vanilla-engine/src/**/*.js", "sites/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["packages/vanilla-engine/tests/**/*.js", "backend/app/tests/**/*.{js,mjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
