import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['wwwroot/ts/**/*.test.ts'],
    setupFiles: ['wwwroot/ts/__tests__/setup.ts'],
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.json'],
    alias: [
      {
        // Rewrite .js imports to .ts so Vitest resolves the source files
        find: /^(\.{1,2}\/.*?)\.js$/,
        replacement: '$1.ts',
      },
    ],
  },
});
