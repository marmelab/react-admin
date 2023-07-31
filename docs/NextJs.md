---
layout: default
title: "Next.Js Integration"
---

# Next.js Integration

React-admin runs seamlessly on [Next.js](https://nextjs.org/), with minimal configuration.

Next.js 13 proposes 2 ways to build a React project: 

- the classic [Pages router](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts),
- the new [App router](https://vercel.com/blog/nextjs-app-router-data-fetching) with React Server components. 

React-admin supports both ways. 

## Create a Next.js application
Let's start by creating a new Next.js project called next-admin.

```bash
npx create-next-app@latest
```
A prompt will asks you some questions, feel free to choose answers according to your needs. 
To easily bootstap the `<Admin>` application, regardless of Next.js router system (eg: Pages Router or App router), we will choose to create a `src` folder :

![Install Next.js with command line](./img/install-next-js-command-line.png)

This creates a project with the following folder structure:

| Pages Router                                                                                                 | App Router                                                                                                |
|-------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| ![ Next Admin folder structure with Pages Router ]( ./img/next-admin-with-page-router-folder-structure.png ) | ![ Next Admin folder structure with App Router ]( ./img/next-admin-with-app-router-folder-structure.png ) |

## Adding React-Admin Dependencies

Add the `react-admin` npm package, as well as a data provider package. In this example, we'll use `ra-data-json-server` to connect to a test API provided by [JSONPlaceholder](https://jsonplaceholder.typicode.com).

```bash
cd next-admin
yarn add react-admin ra-data-json-server
```

## Creating The Admin App Component

Next, create a `components` directory inside `src`, and an admin App component in `src/components/AdminApp.jsx`:

**Tips**: If you choose App Router, do not forget to add [the `"use client"` directive](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive). Why the `"use client"` directive? React-admin is designed as a Single-Page Application, rendered on the client-side. It comes with various client-side only libraries (emotion, material-ui, react-query) leveraging the React Context API, and cannot be rendered using React Server components.

```jsx
// in src/components/AdminApp.jsx
"use client"; // only needed if you choose App Router
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="users"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="name"
    />
    <Resource
      name="posts"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="title"
    />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default AdminApp;
```

This is a minimal configuration to render CRUD pages for users, posts and comments. React-admin guesses the data structure from the API response. 

## Exposing The Admin App Component
React-admin is designed as a Single-Page Application, rendered on the client-side. It comes with its own routing sytem, which conflicts with the Next.js routing system. So we must prevent Next.js from rendering the react-admin component on the server-side. 

To do that, we will have to import our `<AdminApp>` component in Next.js by using the [__lazy loading__ system provided by Next.js](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading) and specify the [`ssr` option to false](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr). 

Using dynamic import allows disabling Server-Side Rendering for the `<AdminApp>` component.

The file you import the Admin app into Next.js depends on the router system you choose :

- if you choose App Router, import `<AdminApp>` in `src/app/page.tsx`, 
- otherwise, if you choose Pages Router, import `<AdminApp>` in `src/pages/index.tsx`.

```tsx
// depending of the Router you choose: 
// - in src/app/page.tsx for App Router system
// - or in src/pages/index.tsx for Pages Router system
import { NextPage } from "next";
import dynamic from "next/dynamic";
const AdminApp = dynamic(() => import("@/components/AdminApp"), { ssr: false });

const Home: NextPage = () => {
  return <AdminApp />;
};

export default Home;
```

Now, start the server with `yarn dev`, browse to `http://localhost:3000/`, and you should see the working admin:

![Working Page](./img/nextjs-react-admin.webp)

Starting from there, you can [Add an API](#adding-an-api) as described in the next section, and/or add features to the Next.js app, as explained in the [Getting started tutorial](./Tutorial.md)

## Rendering React-Admin In A Sub Route

In many cases, the admin is only a part of the application. For instance, you may want to render the admin in a subpath, e.g. `/admin`.

Depending of the router system you choose, create the subpage in this following file:
- you choose **App Router**: create the subpage in `src/app/admin/page.tsx`
- you choose **Pages Router**: create the subpage in `src/pages/admin/index.tsx`

No matter which system you choose, the file should contains the following code:

```tsx
// depending of the Router you choose: 
// - in src/app/admin/page.tsx for App Router system
// - or in src/pages/admin/index.tsx for Pages Router system
import { NextPage } from "next";
import dynamic from "next/dynamic";
const AdminApp = dynamic(() => import("@/components/AdminApp"), { ssr: false });

const Admin: NextPage = () => {
  return <AdminApp />;
};

export default Admin;
```

Now the admin renders at `http://localhost:3000/admin`, and you can use the Next.js routing system to add more pages.

**Tip**: If you migrated from the Pages Router, you might have to delete the `.next` directory in your project to ensure NextJS bundles the client dependencies correctly.

## Adding an API

[Next.js allows to serve an API](https://nextjs.org/docs/api-routes/introduction) from the same server. You *could* use this to build a CRUD API by hand. However, we consider that building a CRUD API on top of a relational database is a solved problem and that developers shouldn't spend time reimplementing it. 

For instance, if you store your data in a [PostgreSQL](https://www.postgresql.org/) database, you can use [PostgREST](https://postgrest.org/en/stable/) to expose the data as a REST API with zero configuration. Even better, you can use a Software-as-a-Service like [Supabase](https://supabase.com/) to do that for you. 

In such cases, the Next.js API can only serve as a Proxy to authenticate client queries and pass them down to Supabase. 

Let's see an example in practice. 

First, create a Supabase REST API and its associated PostgreSQL database directly on the [Supabase website](https://app.supabase.com/) (it's free for tests and low usage). Once the setup is finished, use the Supabase manager to add the following tables:

- `users` with fields: `id`, `name`, and `email`
- `posts` with fields: `id`, `title`, and `body` 
- `comments` with fields: `id`, `name`, `body`, and `postId` (a foreign key to the `posts.id` field)

You can populate these tables via the Supabse UI if you want. Supabase exposes a REST API at `https://YOUR_INSTANCE.supabase.co/rest/v1`.

Copy the Supabase API URL and service role key into Next.js's `.env.local` file:

```sh
# In `.env.local`
SUPABASE_URL="https://MY_INSTANCE.supabase.co"
SUPABASE_SERVICE_ROLE="MY_SERVICE_ROLE_KEY"
```

**Tip**: This example uses the **service role key** here and not the anonymous role. This allows mutations without dealing with authorization. **You shouldn't do this in production**, but use the [Supabase authorization](https://supabase.com/docs/guides/auth) feature instead.

Create [a "catch-all" API route](https://nextjs.org/docs/api-routes/dynamic-api-routes#optional-catch-all-api-routes) in the Next.js app by adding a `pages/api/admin/[[...slug]].ts` file. This API route redirects all calls from the react-admin app to the Supabase CRUD API:

```tsx
// in pages/api/admin/[[...slug]].ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get the incoming request URL, e.g. 'posts?limit=10&offset=0&order=id.asc'
  const requestUrl = req.url?.substring("/api/admin/".length);
  // build the CRUD request based on the incoming request
  const url = `${process.env.SUPABASE_URL}/rest/v1/${requestUrl}`;
  const options: RequestInit = {
    method: req.method,
    headers: {
      prefer: req.headers["prefer"] as string ?? "",
      accept: req.headers["accept"] ?? "application/json",
      ["content-type"]: req.headers["content-type"] ?? "application/json",
      // supabase authentication
      apiKey: process.env.SUPABASE_SERVICE_ROLE ?? '',
    },
  };
  if (req.body) {
    options.body = JSON.stringify(req.body);
  }
  // call the CRUD API
  const response = await fetch(url, options);
  // send the response back to the client
  const contentRange = response.headers.get("content-range");
  if (contentRange) {
    res.setHeader("Content-Range", contentRange);
  }
  res.end(await response.text());
}
```

**Tip**: Some of this code is really PostgREST-specific. The `prefer` header is required to let PostgREST return one record instead of an array containing one record in response to `getOne` requests. The `Content-Range` header is returned by PostgREST and must be passed down to the client. A proxy for another CRUD API will require different parameters.

Finally, update the react-admin data provider to use the Supabase adapter instead of the JSON Server one. As Supabase provides a PostgREST endpoint, we'll use [`ra-data-postgrest`](https://github.com/raphiniert-com/ra-data-postgrest):

```sh
yarn add @raphiniert/ra-data-postgrest
```

```jsx
// in src/components/AdminApp.jsx
import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import postgrestRestProvider from "@raphiniert/ra-data-postgrest";

const dataProvider = postgrestRestProvider("/api/admin");

const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" />
    <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default AdminApp;
```