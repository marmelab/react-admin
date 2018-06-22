import { babel } from 'docz-plugin-babel6';

export default {
    title: 'react-admin',
    plugins: [babel()],
    wrapper: 'docs/components/DocWrapper',
    themeConfig: {
        styles: {
            sidebar: {
                width: 250,
            },
            playground: {
                padding: '1em',
            },
            pre: {
                padding: '1em!important',
            },
        },
    },
};
