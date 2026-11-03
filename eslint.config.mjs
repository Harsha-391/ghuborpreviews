import { FlatCompat } from "@eslint/eslintrc";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  // npm nests eslint-plugin-react-hooks under eslint-config-next, so resolve
  // plugins from there (lookups still walk up to the root node_modules).
  resolvePluginsRelativeTo: path.dirname(require.resolve("eslint-config-next/package.json")),
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
