// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

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
                        label: 'Material UI',
                        link: '/mui/guides/architecture',
                        icon: 'open-book',
                        items: [
                            {
                                label: 'Getting Started',
                                slug: 'mui/guides/createreactadmin',
                            },
                            {
                                label: 'Guides & Concepts',
                                items: [
                                    // Each item here is one entry in the navigation menu.
                                    {
                                        label: 'General Concepts With Material UI',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'mui/guides/architecture',
                                    },
                                    {
                                        label: 'Data Fetching',
                                        slug: 'mui/guides/datafetchingguide',
                                    },
                                    {
                                        label: 'CRUD pages',
                                        slug: 'mui/guides/crud',
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
                                    directory: 'mui/reference',
                                },
                            },
                        ],
                    },
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
                                        label: 'General Concepts With Shadcn UI',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'shadcn/guides/architecture',
                                    },
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
                                        label: 'General Concepts In Headless Mode',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
                                    {
                                        label: 'General Concepts',
                                        slug: 'headless/guides/architecture',
                                    },
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
        mdx(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
