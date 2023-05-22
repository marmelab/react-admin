const fs = require('fs');
const path = require('path');
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));
module.exports = {
    stories: [`../packages/${process.env.ONLY || '**'}/**/*.stories.@(tsx)`],
    addons: [
        '@storybook/addon-storysource',
        '@storybook/addon-actions',
        '@storybook/addon-controls',
    ],
    typescript: {
        check: false,
        checkOptions: {},
        reactDocgen: 'none',
    },
    babel: async options => {
        const { plugins = [] } = options;
        return {
            ...options,
            plugins: [
                ...plugins,
                [
                    '@babel/plugin-proposal-private-property-in-object',
                    {
                        loose: true,
                    },
                ],
            ],
        };
    },
    viteFinal: async (config, { configType }) => {
        return {
            ...config,
            define: {
                'process.env': process.env,
            },
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
        name: '@storybook/react-vite',
        options: {
            fastRefresh: true,
        },
    },
    docs: {
        autodocs: false,
    },
};
