import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const packages = fs.readdirSync(path.resolve(__dirname, './packages'));
const aliases: Record<string, string> = {
    'data-generator-retail': path.resolve(
        __dirname,
        './examples/data-generator/src'
    ),
};
for (const dirName of packages) {
    if (dirName === 'create-react-admin') continue;
    const packageJson = JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, './packages', dirName, 'package.json'),
            'utf8'
        )
    );
    aliases[packageJson.name] = path.resolve(
        __dirname,
        `./packages/${packageJson.name}/src`
    );
}

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    test: {
        globals: true,
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
            viewport: { width: 1280, height: 1024 },
        },
        include: [
            'packages/**/src/**/*.spec.tsx',
            'packages/**/src/**/*.spec.ts',
        ],
    },
});
