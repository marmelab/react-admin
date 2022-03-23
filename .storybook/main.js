const fs = require('fs');
const path = require('path');

const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));
module.exports = {
    core: {
        builder: 'webpack5',
    },
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
                    { loose: true },
                ],
            ],
        };
    },
    reactOptions: {
        fastRefresh: true,
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
};
