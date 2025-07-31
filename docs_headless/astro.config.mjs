// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import rehypeCodeGroup from 'rehype-code-group';
import expressiveCode from 'astro-expressive-code';
import { pluginFullscreen } from 'expressive-code-fullscreen';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'React Admin Headless',
            customCss: ['./src/styles/global.css'],
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/withastro/starlight',
                },
            ],
            plugins: [
                starlightSidebarTopics([
                    {
                        label: 'Shadcn UI',
                        link: '/shadcn/guides/architecture',
                        icon: 'open-book',
                        items: [
                            {
                                label: 'Guides & Concepts',
                                items: [
                                    // Each item here is one entry in the navigation menu.
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'Data Fetching',
                                        slug: 'shadcn/guides/datafetchingguide',
                                    },
                                    {
                                        label: 'CRUD pages',
                                        slug: 'shadcn/guides/crud',
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
                                    directory: 'shadcn/reference',
                                },
                            },
                        ],
                    },
                    {
                        label: 'Headless',
                        link: '/headless/guides/architecture',
                        icon: 'open-book',
                        items: [
                            {
                                label: 'Guides & Concepts',
                                items: [
                                    // Each item here is one entry in the navigation menu.
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'Data Fetching',
                                        slug: 'headless/guides/datafetchingguide',
                                    },
                                    {
                                        label: 'CRUD pages',
                                        slug: 'headless/guides/crud',
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
                                    directory: 'headless/reference',
                                },
                            },
                        ],
                    },
                ]),
            ],
            components: {
                // Override the default `SocialIcons` component.
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
        rehypePlugins: [rehypeCodeGroup],
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
