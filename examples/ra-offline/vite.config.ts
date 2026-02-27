import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import path from "path";

const aliases: Record<string, string> = {};
try {
  const packages = fs.readdirSync(path.resolve(__dirname, "../../packages"));
  for (const dirName of packages) {
    if (dirName === "create-react-admin") continue;
    const packageJson = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../../packages", dirName, "package.json"),
        "utf8",
      ),
    );
    aliases[packageJson.name] = path.resolve(
      __dirname,
      `../../packages/${packageJson.name}/src`,
    );
  }
} catch {
  /* empty */
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectManifest: {
        minify: false,
        // enableWorkboxModulesLogs: true,
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "maskable-icon-512x512.png",
      ],
      manifest: {
        name: "React-Admin Offline",
        short_name: "RA Offline",
        description: "React-Admin Offline Demo",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    react(),
  ],
  server: {
    host: true,
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
  resolve: {
    alias: [
      {
        find: /^@mui\/icons-material\/(.*)/,
        replacement: "@mui/icons-material/esm/$1",
      },
      ...Object.keys(aliases).map((packageName) => ({
        find: packageName,
        replacement: aliases[packageName],
      })),
    ],
  },
}));
