import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.d.{ts,tsx}',
    ],
    outDir: 'dist',
    bundle: false,
    minify: false,
    sourcemap: true,
    clean: true,
    dts: false,
    format: ['esm', 'cjs'],
    target: 'es2015',
    silent: true,
});
