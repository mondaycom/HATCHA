import { defineConfig } from "tsup";
import { copyFileSync } from "fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
  onSuccess: async () => {
    copyFileSync("src/styles.css", "dist/styles.css");
  },
});
