import { type Config } from "tailwindcss";

import baseConfig from "@awesome-qrcode/tailwind-config";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theme.config.tsx",
  ],
  presets: [baseConfig],
} satisfies Config;
