/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["@awesome-qrcode/eslint-config"], // uses the config in `packages/config/eslint`
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    // @ts-expect-error `__dirname` might appear undefined
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["apps/docs"],
    },
  },
};

module.exports = config;
