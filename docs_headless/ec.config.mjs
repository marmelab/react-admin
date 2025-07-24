import { defineEcConfig } from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

export default defineEcConfig({
    plugins: [pluginCollapsibleSections()],
    defaultProps: {
        collapseStyle: 'collapsible-auto',
    },
});
