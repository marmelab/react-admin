const path = require('path');

module.exports = {
    setupFiles: ['<rootDir>/src/test/configureEnzyme.js'],
    moduleNameMapper: {
        'ra-core': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-core',
            'src'
        ),
        'ra-ui-materialui': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-ui-materialui',
            'src'
        ),
        'react-admin': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'react-admin',
            'src'
        ),
        'ra-data-fakerest': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-data-fakerest',
            'src'
        ),
        'ra-input-rich-text': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-input-rich-text',
            'src'
        ),
        'ra-tree-core': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-tree-core',
            'src'
        ),
        'ra-tree-ui-materialui': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-tree-ui-materialui',
            'src'
        ),
        'ra-tree-language-english': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-tree-language-english'
        ),
        'ra-tree-language-french': path.join(
            __dirname,
            '..',
            '..',
            'packages',
            'ra-tree-language-french'
        ),
    }
};
