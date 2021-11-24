const path = require('path');

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
    moduleNameMapper: {
        '^ra-core(.*)$': path.join(__dirname, './packages/ra-core/src$1'),
        '^ra-test(.*)$': path.join(__dirname, './packages/ra-test/src$1'),
        '^ra-ui-materialui(.*)$': path.join(
            __dirname,
            './packages/ra-ui-materialui/src$1'
        ),
    },
};
