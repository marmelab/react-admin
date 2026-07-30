import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const packagesDir = path.resolve(import.meta.dirname, '../packages');

// Map each package to its sources so that stories get deep HMR
const packageAliases = fs.readdirSync(packagesDir).map(dirName => {
    const packageJson = JSON.parse(
        fs.readFileSync(path.join(packagesDir, dirName, 'package.json'), 'utf8')
    );
    return {
        find: packageJson.name as string,
        replacement: path.join(packagesDir, dirName, 'src'),
    };
});

const config: StorybookConfig = {
    stories: [
        path.join(
            packagesDir,
            `${process.env.ONLY || '**'}/**/*.stories.@(tsx)`
        ),
    ],
    addons: ['@storybook/addon-docs'],
    framework: '@storybook/react-vite',
    typescript: {
        check: false,
        reactDocgen: false,
    },
    core: {
        disableTelemetry: true,
    },
    features: {
        // no story uses play() nor action(), so both panels are dead weight.
        // The onboarding widgets go with them: leaving them on while the test
        // addon is off makes the manager log UniversalStore timeouts.
        interactions: false,
        actions: false,
        sidebarOnboardingChecklist: false,
        menuOnboardingChecklist: false,
    },
    viteFinal: async viteConfig => {
        const alias = viteConfig.resolve?.alias;
        const builderAliases = Array.isArray(alias)
            ? alias
            : Object.entries(alias ?? {}).map(([find, replacement]) => ({
                  find,
                  replacement: replacement as string,
              }));
        return {
            ...viteConfig,
            plugins: [...(viteConfig.plugins ?? []), react()],
            define: {
                ...viteConfig.define,
                'process.env.NODE_ENV': JSON.stringify(
                    viteConfig.mode ?? 'development'
                ),
            },
            resolve: {
                ...viteConfig.resolve,
                alias: [
                    {
                        find: /^@mui\/icons-material\/(.*)/,
                        replacement: '@mui/icons-material/esm/$1',
                    },
                    ...packageAliases,
                    ...builderAliases,
                ],
            },
        };
    },
};

export default config;
