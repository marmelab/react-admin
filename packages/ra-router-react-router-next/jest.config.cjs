const path = require('path');
const fs = require('fs');

// Package-local jest config for ra-router-react-router-next, wired into the root
// config via `projects`.
//
// React Router v8 is ESM-only and uses `import.meta`, and it requires React 19.
// Neither fits the default CJS jest project, so this config:
//   - runs in ESM mode (the root test scripts pass `NODE_OPTIONS=--experimental-vm-modules`),
//   - transforms `react-router` (it ships untranspiled ESM) and emits ES modules,
//   - forces React 19 (a devDependency of this package) as a single instance across
//     the whole tree (ra-core included) to avoid duplicate-React hook errors.

const repoRoot = path.resolve(__dirname, '../..');

const packages = fs.readdirSync(path.join(repoRoot, 'packages'));
const moduleNameMapper = packages.reduce((mapper, dirName) => {
    const pkg = require(
        path.join(repoRoot, 'packages', dirName, 'package.json')
    );
    mapper[`^${pkg.name}(.*)$`] = path.join(
        repoRoot,
        `./packages/${dirName}/src$1`
    );
    return mapper;
}, {});

const react19Dir = path.dirname(
    require.resolve('react/package.json', { paths: [__dirname] })
);
const reactDom19Dir = path.dirname(
    require.resolve('react-dom/package.json', { paths: [__dirname] })
);

module.exports = {
    rootDir: repoRoot,
    roots: [__dirname],
    globalSetup: '<rootDir>/test-global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!(@hookform|react-hotkeys-hook|@faker-js/faker|react-router)/).+\\.(js|jsx|mjs|ts|tsx)$',
    ],
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                isolatedModules: true,
                useESM: true,
                // Emit ES modules so jest's ESM runtime can load them (the root
                // tsconfig targets CommonJS, which would emit `exports.*`).
                tsconfig: {
                    module: 'ESNext',
                    target: 'ESNext',
                },
            },
        ],
    },
    moduleNameMapper: {
        '^react$': require.resolve('react', { paths: [__dirname] }),
        '^react/(.*)$': path.join(react19Dir, '$1'),
        '^react-dom$': require.resolve('react-dom', { paths: [__dirname] }),
        '^react-dom/(.*)$': path.join(reactDom19Dir, '$1'),
        ...moduleNameMapper,
    },
};
