import type { Config } from "tailwindcss";
import stackPreset from "./tailwind.preset.ts";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [stackPreset],
};

export default config;
