import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored, byte-identical copy of the lens hero module (see
    // src/components/lens-hero/SOURCE.md). Linting it here would invite
    // edits, and every edit has to happen at the source instead.
    "src/components/lens-hero/lens-hero.js",
  ]),
]);

export default eslintConfig;
