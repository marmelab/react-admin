import type { StorybookConfig } from '@storybook/react-vite';
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
        // '@storybook/addon-storysource',
        {
            name: '@storybook/addon-storysource',
            options: {
                loaderOptions: {
                    injectStoryParameters: false,
                },
            },
        },
        // '@storybook/addon-webpack5-compiler-babel',
        // '@storybook/addon-storysource',
        // {
        //     name: '@storybook/addon-storysource',
        //     options: {
        //         loaderOptions: {
        //             parser: 'typescript',
        //         },
        //     },
        // },
        // {
        //     name: '@storybook/addon-storysource',
        //     options: {
        //         rule: {
        //             include: [
        //                 path.resolve(
        //                     __dirname,
        //                     `../packages/${process.env.ONLY || '**'}/**/*.stories.@(tsx)`
        //                 ),
        //             ],
        //         },
        //         loaderOptions: {
        //             parser: 'typescript',
        //             injectStoryParameters: false,
        //         },
        //     },
        // },
        '@storybook/addon-actions',
        '@storybook/addon-controls',
    ],
    // typescript: {
    //     check: false,
    //     reactDocgen: 'react-docgen-typescript', // TEST
    // },
    // babel: async options => {
    //     const { plugins = [] } = options;
    //     return {
    //         ...options,
    //         presets: [
    //             '@babel/preset-env',
    //             '@babel/preset-react',
    //             '@babel/preset-typescript',
    //         ],
    //         plugins: [
    //             ...plugins,
    //             [
    //                 '@babel/plugin-proposal-private-property-in-object',
    //                 {
    //                     loose: true,
    //                 },
    //             ],
    //             [
    //                 '@babel/plugin-proposal-private-methods',
    //                 {
    //                     loose: true,
    //                 },
    //             ],
    //             [
    //                 '@babel/plugin-proposal-class-properties',
    //                 {
    //                     loose: true,
    //                 },
    //             ],
    //         ],
    //     };
    // },
    // webpackFinal: async (config, { configType }) => {
    //     // config.module?.rules?.push({
    //     //     test: /\.stories\.tsx?$/,
    //     //     use: [
    //     //         {
    //     //             loader: require.resolve('@storybook/source-loader'),
    //     //             options: { parser: 'typescript' },
    //     //         },
    //     //     ],
    //     //     enforce: 'pre',
    //     // });
    //     return {
    //         ...config,
    //         resolve: {
    //             ...config.resolve,
    //             alias: packages.reduce(
    //                 (acc, pkg) => ({
    //                     ...acc,
    //                     [pkg]: path.resolve(
    //                         __dirname,
    //                         `../packages/${pkg}/src`
    //                     ),
    //                 }),
    //                 { ...config.resolve?.alias }
    //             ),
    //             plugins: [
    //                 ...(config.resolve?.plugins || []),
    //                 new TsconfigPathsPlugin({
    //                     extensions: config.resolve?.extensions,
    //                 }),
    //             ],
    //         },
    //     };
    // },
    // framework: {
    //     name: getAbsolutePath('@storybook/react-webpack5'),
    //     options: {},
    // },
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    // docs: {},
    async viteFinal(config) {
        // Merge custom configuration into the default config
        const { mergeConfig } = await import('vite');

        return mergeConfig(config, {
            resolve: {
                alias: packages.map(pkg => ({
                    find: new RegExp(`^${pkg}$`),
                    replacement: path.resolve(
                        __dirname,
                        `../packages/${pkg}/src`
                    ),
                })),
            },
        });
    },
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')));
}
