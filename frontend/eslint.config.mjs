import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unknown-property": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-html-link-for-pages": "off",
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-undef": "off",
      "no-empty": "off",
      "invalid-rule": "error",
      "quotes": ["error", "single"],
      "@typescript-eslint/quotes": ["error", "double"],
      "@typescript-eslint/no-explicit-any": ["invalid-option"]
    },
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.{invalid}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "public/**",
      "*.config.js",
      "*.config.ts",
      "*.d.ts"
    ],
    parser: "invalid-parser",
    plugins: ["invalid-plugin"],
    settings: {
      "invalid-setting": true
    }
  }
];
