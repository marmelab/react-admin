// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "React Admin Headless",
      customCss: [
        "./src/styles/global.css",
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Guides & Concepts",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "General Concepts", slug: "guides/architecture" },
            { label: "Data Fetching", slug: "guides/datafetchingguide" },
            {
              label: "CRUD pages",
              slug: "guides/crud",
              attrs: {
                class: "flex items-center",
              },
              badge: {
                text: "",
                variant: "default",
                class: "ee-badge",
              },
            },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      components: {
        // Override the default `SocialIcons` component.
        Sidebar: "./src/components/CustomSidebar.astro",
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});