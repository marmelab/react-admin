const path = require('path');
const fs = require('fs');

const packages = fs.readdirSync(path.resolve(__dirname, './packages'));
const moduleNameMapper = packages.reduce((mapper, dirName) => {
    const pkg = require(path.resolve(
        __dirname,
        './packages',
        dirName,
        'package.json'
    ));
    mapper[`^${pkg.name}(.*)$`] = path.join(
        __dirname,
        `./packages/${dirName}/src$1`
    );
    return mapper;
}, {});

module.exports = {
    globalSetup: './test-global-setup.js',
    setupFilesAfterEnv: ['./test-setup.js'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/lib/',
        '/esm/',
        '/examples/simple/',
    ],
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!(@hookform)/).+\\.(js|jsx|mjs|ts|tsx)$',
    ],
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                isolatedModules: true,
                useESM: true,
            },
        ],
    },
    moduleNameMapper,
};
