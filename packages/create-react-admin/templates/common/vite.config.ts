import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const alias = [
  { find: "react-admin", replacement: "./node_modules/react-admin/src" },
  { find: "ra-core", replacement: "./node_modules/ra-core/src" },
  {
    find: "ra-ui-materialui",
    replacement: "./node_modules/ra-ui-materialui/src",
  },
  {
    find: "ra-i18n-polyglot",
    replacement: "./node_modules/ra-i18n-polyglot/src",
  },
  {
    find: "ra-language-english",
    replacement: "./node_modules/ra-language-english/src",
  },
  {
    find: "ra-data-json-server",
    replacement: "./node_modules/ra-data-json-server/src",
  },
  {
    find: "ra-data-simple-rest",
    replacement: "./node_modules/ra-data-simple-rest/src",
  },
  {
    find: "ra-data-fakerest",
    replacement: "./node_modules/ra-data-fakerest/src",
  },
  // add any other react-admin packages you have
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    sourcemap: mode === "developement",
  },
  resolve: { alias },
  base: "./",
}));
