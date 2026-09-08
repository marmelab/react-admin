const path = require('path');
const fs = require('fs');

const packages = fs.readdirSync(path.resolve(__dirname, './packages'));
const moduleNameMapper = packages.reduce((mapper, dirName) => {
    const pkg = require(
        path.resolve(__dirname, './packages', dirName, 'package.json')
    );
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
        '/packages/create-react-admin/templates',
        // ra-router-react-router-next is ESM-only and React 19; it runs as a
        // separate jest invocation (its own jest.config.cjs) from the test
        // scripts, under `NODE_OPTIONS=--experimental-vm-modules`. Enabling that
        // flag process-wide here would force the rest of the suite into ESM mode
        // and break the CommonJS deps it transforms (e.g. react-hotkeys-hook).
        '/packages/ra-router-react-router-next/',
    ],
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!(@hookform|react-hotkeys-hook|@faker-js/faker)/).+\\.(js|jsx|mjs|ts|tsx)$',
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
    testTimeout: 60000,
};
