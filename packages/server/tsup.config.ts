import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/nextjs.ts", "src/express.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
});
