const CracoEsbuildPlugin = require('craco-esbuild');
const CracoAlias = require('craco-alias');
const fs = require('fs');
const path = require('path');

const packages = fs.readdirSync(path.resolve(__dirname, '../../packages'));
const aliases = packages.reduce((acc, dirName) => {
    const packageJson = require(path.resolve(
        __dirname,
        '../../packages',
        dirName,
        'package.json'
    ));
    acc[packageJson.name] = path.resolve(
        __dirname,
        `../../packages/${packageJson.name}/src`
    );
    return acc;
}, {});

const findWebpackPlugin = (webpackConfig, pluginName) =>
    webpackConfig.resolve.plugins.find(
        ({ constructor }) => constructor && constructor.name === pluginName
    );

const enableTypescriptImportsFromExternalPaths = (
    webpackConfig,
    newIncludePaths
) => {
    const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
    if (oneOfRule) {
        const tsxRule = oneOfRule.oneOf.find(
            rule => rule.test && rule.test.toString().includes('ts')
        );

        if (tsxRule) {
            tsxRule.include = Array.isArray(tsxRule.include)
                ? [...tsxRule.include, ...newIncludePaths]
                : [tsxRule.include, ...newIncludePaths];
        }
    }
};

const addPathsToModuleScopePlugin = (webpackConfig, paths) => {
    const moduleScopePlugin = findWebpackPlugin(
        webpackConfig,
        'ModuleScopePlugin'
    );
    if (!moduleScopePlugin) {
        throw new Error(
            `Expected to find plugin "ModuleScopePlugin", but didn't.`
        );
    }
    moduleScopePlugin.appSrcs = [...moduleScopePlugin.appSrcs, ...paths];
};

const enableImportsFromExternalPaths = (webpackConfig, paths) => {
    enableTypescriptImportsFromExternalPaths(webpackConfig, paths);
    addPathsToModuleScopePlugin(webpackConfig, paths);
};

module.exports = {
    plugins: [
        { plugin: CracoEsbuildPlugin },
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    enableImportsFromExternalPaths(
                        webpackConfig,
                        Object.values(aliases)
                    );
                    return webpackConfig;
                },
            },
        },
        {
            plugin: CracoAlias,
            options: {
                source: 'options',
                baseUrl: './',
                aliases,
            },
        },
    ],
};
