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
            title: 'React Admin Headless',
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
                    label: 'Guides & Concepts',
                    items: [
                        // Each item here is one entry in the navigation menu.
                        {
                            label: 'General Concepts',
                            slug: 'guides/architecture',
                        },
                        {
                            label: 'Data Fetching',
                            slug: 'guides/datafetchingguide',
                        },
                        {
                            label: 'CRUD pages',
                            slug: 'guides/crud',
                            attrs: {
                                class: 'flex items-center',
                            },
                            badge: {
                                text: '',
                                variant: 'default',
                                class: 'ee-badge',
                            },
                        },
                    ],
                },
                {
                    label: 'Reference',
                    autogenerate: {
                        directory: 'reference',
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
