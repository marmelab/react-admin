/* eslint-disable no-undef, no-param-reassign, global-require, no-unused-vars, no-console, no-restricted-syntax, no-await-in-loop */
/**
 * This script will extract the internationalization messages from all components
 and package them in the translation json files in the translations file.
 */
const fs = require('fs');
const nodeGlob = require('glob');
const { transform } = require('babel-core');

const { animateProgress, addCheckMark } = require('kopaxgroup-cli-helpers');


const pkg = require(path.join(process.cwd(), 'package.json'));
const babelrc = JSON.parse(fs.readFileSync(path.join(process.cwd(), '../../.babelrc'), 'utf-8'));
const { presets } = babelrc;
const plugins = babelrc.plugins || [];


const DEFAULT_LOCALE = pkg.translation ? pkg.translation.locale : 'en';
const locales = pkg.translation ? pkg.translation.locales : [];

require('shelljs/global');

// Glob to match all js files except test files
const FILES_TO_PARSE = 'src/**/!(*.test).js';

const newLine = () => process.stdout.write('\n');

// Progress Logger
let progress;
const task = (message) => {
  progress = animateProgress(message);
  process.stdout.write(message);

  return (error) => {
    if (error) {
      process.stderr.write(error);
    }
    clearTimeout(progress);
    return addCheckMark(() => newLine());
  };
};

// Wrap async functions below into a promise
const glob = (pattern) => new Promise((resolve, reject) => {
  nodeGlob(pattern, (error, value) => (error ? reject(error) : resolve(value)));
});

const readFile = (fileName) => new Promise((resolve, reject) => {
  fs.readFile(fileName, (error, value) => (error ? reject(error) : resolve(value)));
});

const writeFile = (fileName, data) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, data, (error, value) => (error ? reject(error) : resolve(value)));
});

// Store existing translations into memory
const oldLocaleMappings = [];
const localeMappings = [];


/* push `react-intl` plugin to the existing plugins that are already configured in `package.json`
   Example:
   ```
  "babel": {
    "plugins": [
      ["transform-object-rest-spread", { "useBuiltIns": true }]
    ],
    "presets": [
      "env",
      "react"
    ]
  }
  ```
*/
plugins.push(['react-intl']);

const setOldLocalMappings = (argv) => {
  // Loop to run once per locale
  locales.forEach((locale) => {
    oldLocaleMappings[locale] = {};
    localeMappings[locale] = {};
    // File to store translation messages into
    const translationFileName = `${argv.path}/translation/${locale}.json`;
    try {
      // Parse the old translation message JSON files
      const messages = JSON.parse(fs.readFileSync(translationFileName));
      const messageKeys = Object.keys(messages);
      messageKeys.forEach((messageKey) => {
        oldLocaleMappings[locale][messageKey] = messages[messageKey];
      });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        process.stderr.write(`There was an error loading this translation file: ${translationFileName}\n${error}`);
      }
    }
  });
};

const extractFromFile = async (fileName) => {
  try {
    const code = await readFile(fileName);
    // Use babel plugin to extract instances where react-intl is used
    const { metadata: result } = await transform(code, { presets, plugins }); // object-shorthand
    for (const message of result['react-intl'].messages) {
      for (const locale of locales) {
        const oldLocaleMapping = oldLocaleMappings[locale][message.id];
        // Merge old translations into the babel extracted instances where react-intl is used
        const newMsg = locale === DEFAULT_LOCALE ? message.defaultMessage : '';
        localeMappings[locale][message.id] = oldLocaleMapping || newMsg;
      }
    }
  } catch (error) {
    process.stderr.write(`Error transforming file: ${fileName}\n${error}`);
  }
};

exports.command = 'extract';
exports.desc = 'Extract intl messages to json files.';
exports.builder = (yargs) => yargs
  .option('path', {
    alias: 'p',
    describe: 'path',
    default: process.cwd(),
  });
exports.handler = (argv) => {
  if (!pkg.dependencies['react-intl']) {
    console.log('[Error] - You must use a intl declination to use this command!');
    return;
  }
  switch (argv.path[0]) {
    case '/':
      break;
    default:
      argv.path = argv.path[1] === '/' ? path.join(process.cwd(), argv.path.slice(2)) : path.join(process.cwd(), argv.path);
      break;
  }
  setOldLocalMappings(argv);
  (async function main() {
    const memoryTaskDone = task('Storing language files in memory');
    const files = await glob(FILES_TO_PARSE);
    memoryTaskDone();

    const extractTaskDone = task('Run extraction on all files');
    // Run extraction on all files that match the glob on line 16
    await Promise.all(files.map((fileName) => extractFromFile(fileName)));

    extractTaskDone();

    if (!fs.existsSync(`${argv.path}/translation`)) {
      await fs.mkdir(`${argv.path}/translation`);
    }

    for (const locale of locales) {
      const translationFileName = `${argv.path}/translation/${locale}.json`;

      try {
        const localeTaskDone = task(`Writing translation messages for ${locale} to: ${translationFileName}`);

        // Sort the translation JSON file so that git diffing is easier
        // Otherwise the translation messages will jump around every time we extract
        const messages = {};
        Object.keys(localeMappings[locale]).sort().forEach((key) => {
          messages[key] = localeMappings[locale][key];
        });

        // Write to file the JSON representation of the translation messages
        const prettified = `${JSON.stringify(messages, null, 2)}\n`;
        await writeFile(translationFileName, prettified);

        localeTaskDone();
      } catch (error) {
        localeTaskDone(`There was an error saving this translation file: ${translationFileName}
        \n${error}`);
      }
    }

    process.exit();
  }());
};
