import { StorybookConfig } from '@storybook/react-webpack5';
import fs from 'fs';
import path, { dirname, join } from 'path';

const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const config: StorybookConfig = {
    stories: [
        path.resolve(
            __dirname,
            `../packages/${process.env.ONLY || '**'}/**/*.stories.@(tsx)`
        ),
    ],
    addons: [
        '@storybook/addon-webpack5-compiler-babel',
        {
            name: '@storybook/addon-storysource',
            options: {
                rule: {
                    include: [
                        path.resolve(
                            __dirname,
                            `../packages/${process.env.ONLY || '**'}/**/*.stories.@(tsx)`
                        ),
                    ],
                },
                loaderOptions: {
                    parser: 'typescript',
                    injectStoryParameters: false,
                },
            },
        },
        '@storybook/addon-actions',
        '@storybook/addon-controls',
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
    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {},
    },
    docs: {},
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
