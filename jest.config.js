const path = require('path');
const fs = require('fs');

const packages = fs.readdirSync(path.resolve(__dirname, './packages'));
const moduleNameMapper = packages.reduce((mapper, dirName) => {
    const package = require(path.resolve(
        __dirname,
        './packages',
        dirName,
        'package.json'
    ));
    mapper[`^${package.name}(.*)$`] = path.join(
        __dirname,
        `./packages/${dirName}/src$1`
    );
    return mapper;
}, {});

module.exports = {
    globalSetup: './test-global-setup.js',
    setupFilesAfterEnv: ['./test-setup.js'],
    preset: 'ts-jest/presets/js-with-ts',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/lib/',
        '/esm/',
        '/examples/simple/',
    ],
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$',
    ],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    moduleNameMapper,
};
