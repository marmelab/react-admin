/**
 * Rewrite Webpack config without ejecting CRA thanks to rewire
 * @link https://stackoverflow.com/questions/55165466/how-to-build-a-production-version-of-react-without-minification
 */
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

/**
 * Do not mangle component names in production, for better learning experience
 * @link https://kentcdodds.com/blog/profile-a-react-app-for-performance#disable-function-name-mangling
 */
config.optimization.minimizer[0].options.keep_classnames = true;
config.optimization.minimizer[0].options.keep_fnames = true;

/**
 * Do not disable component profiling in production, for better learning experience
 * @link https://kentcdodds.com/blog/profile-a-react-app-for-performance#update-the-webpack-config-for-production-profiling
 */
config.resolve.alias['react-dom$'] = 'react-dom/profiling';
config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
