---
layout: default
title: "React Router Framework Integration"
---

# React Router Framework Integration

[React Router Framework](https://reactrouter.com/start/framework/installation) (a.k.a. Remix v3) is a Node.js framework for server-side-rendered React apps. React-admin uses React Router under the hood and integrates seamlessly with React Router Framework applications.

These instructions are targeting React Router v7 in Framework mode.

## Setting Up React Router

Let's start by creating a new React Router project. Run the following command:

```sh
npx create-react-router@latest 
```

This script will ask you for more details about your project. You can use the following options:

- The name you want to give to your project, e.g. `react-router-admin`
- Initialize a new git repository? Choose Yes
- Install dependencies with npm? Choose Yes

## Setting Up React-Admin In React Router

Next, add the required dependencies. In addition to the `react-admin` npm package, you will need a data provider package. In this example, we'll use `ra-data-json-server` to connect to a test API provided by [JSONPlaceholder](https://jsonplaceholder.typicode.com).

`react-admin` also depends on the `react-router-dom` package. It used to be a direct dependency of `react-router`, but it's not anymore in v7 so you'll have to add it manually. Check the version of React Router that has been installed by `create-react-router` and **use the exact same version**. At the time of writing this tutorial, it is `7.11.0`.

```sh
cd react-router-admin
npm add react-admin ra-data-json-server react-router-dom@7.11.0
```

## Adding React-Admin In A Sub Route

In many cases, the admin is only a part of the application. For instance, you may want to render the admin in a subpath like `/admin`.

To do so, add a route for all `/admin` subpath in the `app/routes.ts` file:

```jsx
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/admin/*", "routes/admin.tsx"),
] satisfies RouteConfig;
```

Now create the `app/routes/admin.tsx` file:

```tsx
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

export default function App() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="posts" list={ListGuesser} />
      <Resource name="comments" list={ListGuesser} />
    </Admin>
  );
}
```

**Tip**: Don't forget to set the `<Admin basename>` prop, so that react-admin generates links relative to the "/admin/" subpath:

You can now start the app in development mode with `npm run dev`. The admin should render at <http://localhost:5173/admin/>.

## Adding an API

[React Router allows to serve an API](https://reactrouter.com/how-to/resource-routes) from the same server. You *could* use this to build a CRUD API by hand. However, we consider that building a CRUD API on top of a relational database is a solved problem and that developers shouldn't spend time reimplementing it.

For instance, if you store your data in a [PostgreSQL](https://www.postgresql.org/) database, you can use [PostgREST](https://postgrest.org/en/stable/) to expose the data as a REST API with zero configuration. Even better, you can use a Software-as-a-Service like [Supabase](https://supabase.com/) to do that for you.

In such cases, the React Router API can only serve as a Proxy to authenticate client queries and pass them down to Supabase.

Let's see an example in practice.

First, create a Supabase REST API and its associated PostgreSQL database directly on the [Supabase website](https://app.supabase.com/) (it's free for tests and low usage). Once the setup is finished, use the Supabase manager to add the following tables:

- `posts` with fields: `id`, `title`, and `body`
- `comments` with fields: `id`, `name`, `body`, and `postId` (a foreign key to the `posts.id` field)

You can populate these tables via the Supabse UI if you want.

Supabase exposes a REST API at `https://YOUR_INSTANCE.supabase.co/rest/v1`.

Next, create a configuration to let the React-Router app connect to Supabase. As React Router supports [`dotenv`](https://dotenv.org/) by default in `development` mode, you just need to create a `.env` file:

```sh
# In `.env`
SUPABASE_URL="https://MY_INSTANCE.supabase.co"
SUPABASE_SERVICE_ROLE="MY_SERVICE_ROLE_KEY"
```

**Tip**: This example uses the **service role key** here and not the anonymous role. This allows mutations without dealing with authorization. **You shouldn't do this in production**, but use the [Supabase authorization](https://supabase.com/docs/guides/auth) feature instead.

Time to bootstrap the API Proxy. Create a new route in `app/routes.ts`:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/admin/*", "routes/admin.tsx"),
  route("/admin/api/*", "routes/admin.api.tsx"),
] satisfies RouteConfig;
```

Then create the `app/routes/admin.api.tsx` file. Inside this file, a `loader` function should convert the GET requests into Supabase API calls, and an `action` function should do the same for POST, PUT, and DELETE requests.

```tsx
// in app/routes/admin.api.tsx
import type { Route } from "./+types/admin.api";

// handle read requests (getOne, getList, getMany, getManyReference)
export const loader = ({ request }: Route.LoaderArgs) => {
  const apiUrl = getSupabaseUrlFromRequestUrl(request.url);

  return fetch(apiUrl, {
    headers: {
      prefer: request.headers.get("prefer") ?? "",
      accept: request.headers.get("accept") ?? "application/json",
      "Accept-Encoding": "",
      apiKey: `${process.env.SUPABASE_SERVICE_ROLE}`,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE}`,
    },
  });
};

// handle write requests (create, update, delete, updateMany, deleteMany)
export const action = ({ request }: Route.ActionArgs) => {
  const apiUrl = getSupabaseUrlFromRequestUrl(request.url);

  return fetch(apiUrl, {
    method: request.method,
    body: request.body,
    // @ts-expect-error The types for fetch don't support duplex but it is required and works
    duplex: "half",
    headers: {
      prefer: request.headers.get("prefer") ?? "",
      accept: request.headers.get("accept") ?? "application/json",
      "Accept-Encoding": "",
      apiKey: `${process.env.SUPABASE_SERVICE_ROLE}`,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE}`,
    },
  });
};

const ADMIN_PREFIX = "/admin/api";

const getSupabaseUrlFromRequestUrl = (url: string) => {
  const startOfRequest = url.indexOf(ADMIN_PREFIX);
  const query = url.substring(startOfRequest + ADMIN_PREFIX.length);
  return `${process.env.SUPABASE_URL}/rest/v1${query}`;
};
```

**Tip**: Some of this code is really PostgREST-specific. The `prefer` header is required to let PostgREST return one record instead of an array containing one record in response to `getOne` requests. A proxy for another CRUD API will require different parameters.

Update the react-admin data provider to use the Supabase adapter instead of the JSON Server one. As Supabase provides a PostgREST endpoint, we'll use [`ra-data-postgrest`](https://github.com/raphiniert-com/ra-data-postgrest):

```sh
npm add @raphiniert/ra-data-postgrest
```

Update your `vite.config.ts` to add `@raphiniert/ra-data-postgrest` to the `noExternal` array:

```diff
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
+ ssr: {
+  noExternal: ['@raphiniert/ra-data-postgrest']
+ },
});
```

Finally, update your Admin dataProvider:

```jsx
// in app/routes/admin.tsx
import { Admin, Resource, ListGuesser, fetchUtils } from "react-admin";
import postgrestRestProvider, { defaultPrimaryKeys, defaultSchema } from '@raphiniert/ra-data-postgrest';

const dataProvider = postgrestRestProvider({
    apiUrl: '/admin/api',
    httpClient: fetchUtils.fetchJson,
    defaultListOp: 'eq',
    primaryKeys: defaultPrimaryKeys,
    schema: defaultSchema
});

export default function App() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="posts" list={ListGuesser} />
      <Resource name="comments" list={ListGuesser} />
    </Admin>
  );
}
```

That's it! Now React Router both renders the admin app and serves as a proxy to the Supabase API. You can test the app by visiting `http://localhost:5173/admin/`, and the API Proxy by visiting `http://localhost:5173/admin/api/posts`.

**Note**: You may have a blank page if your database does not have any record yet. Make sure to create some using Supabase Studio.

Note that the Supabase credentials never leave the server. It's up to you to add your own authentication to the API proxy.

## Sourcemaps in production

By default, Vite won't include the TypeScript sourcemaps in production builds. This means you'll only have the react-admin ESM builds for debugging.

Should you prefer to have the TypeScript sources, you'll have to configure some Vite aliases:

```tsx
// in vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const alias = [
  { find: 'react-admin', replacement: path.resolve(__dirname, './node_modules/react-admin/src') },
  { find: 'ra-core', replacement: path.resolve(__dirname, './node_modules/ra-core/src') },
  { find: 'ra-ui-materialui', replacement: path.resolve(__dirname, './node_modules/ra-ui-materialui/src') },
  // add any other react-admin packages you have
]

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ['@raphiniert/ra-data-postgrest']
  },
  build: { sourcemap: true },
  resolve: { alias },
});
```
