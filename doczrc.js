import { babel } from 'docz-plugin-babel6';

export default {
    plugins: [babel()],
    wrapper: 'packages/ra-ui-materialui/src/DocWrapper',
};
