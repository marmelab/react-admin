// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import rehypeCodeGroup from 'rehype-code-group';
import expressiveCode from 'astro-expressive-code';
import { pluginFullscreen } from 'expressive-code-fullscreen';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'ra-core',
            customCss: ['./src/styles/global.css'],
            favicon: '/favicon.ico',
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/marmelab/react-admin',
                },
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    slug: 'getting-started',
                },
                {
                    label: 'Guides & Concepts',
                    autogenerate: {
                        directory: 'guides',
                    },
                },
                {
                    label: 'App Configuration',
                    autogenerate: {
                        directory: 'app-configuration',
                    },
                },
                {
                    label: 'Data Fetching',
                    autogenerate: {
                        directory: 'data-fetching',
                    },
                },
                {
                    label: 'Security',
                    autogenerate: {
                        directory: 'security',
                    },
                },
                {
                    label: 'List Page',
                    autogenerate: {
                        directory: 'list',
                    },
                },
                {
                    label: 'Creation & Edition Pages',
                    autogenerate: {
                        directory: 'create-edit',
                    },
                },
                {
                    label: 'Show Page',
                    autogenerate: {
                        directory: 'show',
                    },
                },
                {
                    label: 'Common',
                    autogenerate: {
                        directory: 'common',
                    },
                },
                {
                    label: 'Fields',
                    autogenerate: {
                        directory: 'fields',
                    },
                },
                {
                    label: 'Inputs',
                    autogenerate: {
                        directory: 'inputs',
                    },
                },
                {
                    label: 'Preferences',
                    autogenerate: {
                        directory: 'preferences',
                    },
                },
                {
                    label: 'I18N Provider & Translations',
                    autogenerate: {
                        directory: 'i18n',
                    },
                },
                {
                    label: 'Other Components & Hooks',
                    autogenerate: {
                        directory: 'other',
                    },
                },
                {
                    label: 'Recipes',
                    autogenerate: {
                        directory: 'recipes',
                    },
                },
            ],
            components: {
                Sidebar: './src/components/CustomSidebar.astro',
            },
        }),
        expressiveCode({
            plugins: [pluginFullscreen(), pluginCollapsibleSections()],
        }),
        react(),
        mdx(),
    ],
    markdown: {
        rehypePlugins: [
            rehypeCodeGroup,
            [
                rehypeAstroRelativeMarkdownLinks,
                {
                    base: '/ra-core/',
                    collectionBase: false,
                    trailingSlash: 'always',
                },
            ],
        ],
    },
    vite: {
        plugins: [tailwindcss()],
    },
    base: '/ra-core/',
    site: 'https://marmelab.com',
    build: {
        assets: 'assets',
    },
});
