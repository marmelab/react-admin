import { StorybookConfig } from '@storybook/react-webpack5';
import fs from 'fs';
import path from 'path';

const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const config: StorybookConfig = {
    stories: [`../packages/${process.env.ONLY || '**'}/**/*.stories.@(tsx)`],
    addons: [
        {
            name: '@storybook/addon-storysource',
            options: {
                loaderOptions: {
                    parser: 'typescript',
                },
            },
        },
        '@storybook/addon-actions',
        '@storybook/addon-controls',
        '@storybook/addon-webpack5-compiler-swc',
    ],
    typescript: {
        check: false,
        reactDocgen: false,
    },
    babel: async options => {
        const { plugins = [] } = options;
        return {
            ...options,
            presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
            ],
            plugins: [
                ...plugins,
                [
                    '@babel/plugin-proposal-private-property-in-object',
                    {
                        loose: true,
                    },
                ],
                [
                    '@babel/plugin-proposal-private-methods',
                    {
                        loose: true,
                    },
                ],
                [
                    '@babel/plugin-proposal-class-properties',
                    {
                        loose: true,
                    },
                ],
            ],
        };
    },
    webpackFinal: async (config, { configType }) => {
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: packages.reduce(
                    (acc, pkg) => ({
                        ...acc,
                        [pkg]: path.resolve(
                            __dirname,
                            `../packages/${pkg}/src`
                        ),
                    }),
                    {}
                ),
            },
        };
    },
    framework: { name: '@storybook/react-webpack5', options: {} },
    docs: {
        autodocs: false,
    },
};

export default config;
