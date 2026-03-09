# Contributing to HATCHA

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/mondaycom/HATCHA.git
   cd HATCHA
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build all packages**

   ```bash
   pnpm build
   ```

4. **Run the example app**

   ```bash
   cp examples/nextjs-app/.env.example examples/nextjs-app/.env.local
   pnpm --filter hatcha-nextjs-example dev
   ```

## Project Structure

```
packages/
  core/     Challenge generation & cryptographic verification
  react/    React component & provider
  server/   Next.js and Express middleware adapters
examples/
  nextjs-app/   Working demo app
```

## Running Tests

```bash
pnpm test
```

## Making Changes

1. Create a feature branch from `master`.
2. Make your changes in the relevant package(s).
3. Add or update tests as needed.
4. Run `pnpm test` and `pnpm build` to verify everything works.
5. Open a pull request against `master`.

## Adding a New Challenge Type

1. Create a new file in `packages/core/src/challenges/`.
2. Export a `ChallengeGenerator` that returns `{ display, answer }`.
3. Register it in `packages/core/src/challenges/index.ts`.
4. Add tests in `packages/core/src/__tests__/challenges.test.ts`.

## Code Style

- TypeScript throughout, strict mode.
- No external runtime dependencies in `@hatcha/core`.
- Keep bundle sizes minimal — the library should stay lightweight.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
