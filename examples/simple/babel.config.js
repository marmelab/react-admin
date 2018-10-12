const presets = [
    [
        '@babel/env',
        {
            targets: {
                edge: '17',
                firefox: '60',
                chrome: '67',
                safari: '11.1',
            },
            useBuiltIns: 'usage',
        },
    ],
    '@babel/preset-react',
];

const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
];

module.exports = { presets, plugins };
