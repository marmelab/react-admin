import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
    parameters: {
        docs: {
            codePanel: true,
            // show the story source as written, like the former addon-storysource
            source: { type: 'code' },
        },
    },
};

export default preview;
