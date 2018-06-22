import { babel } from 'docz-plugin-babel6';

export default {
    plugins: [babel()],
    wrapper: 'docs/components/DocWrapper',
    themeConfig: {
        styles: {
            playground: {
                padding: '1em',
            },
            pre: {
                padding: '1em!important',
            },
        },
    },
};
