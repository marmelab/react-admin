---
layout: default
title: "The create-react-admin CLI"
---

# `create-react-admin`

Use `create-react-admin` to quickly bootstrap a react-admin project using [Vite](https://vitejs.dev/). It's the preferred way to create a new react-admin application.

<iframe src="https://www.youtube-nocookie.com/embed/i_TbS7quzww" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

```sh
npx create-react-admin@latest your-admin-name
```

This will create an empty react-admin application in a directory called `your-admin-name`, powered by [Vite.js](./Vite.md), and install the dependencies.

You can run the app with:

```sh
cd your-admin-name
npm run dev
```

**Tip**: You can replace `npx` with `npm`, `yarn`, or `bun`.

## Options

The command accepts the following options:

* `--interactive`: Enable the CLI interactive mode
* `--data-provider`: Set the data provider to use ("data-fakerest", "data-simple-rest", "data-json-server", "supabase" or "none")
* `--auth-provider`: Set the auth provider to use ("local-auth-provider" or "none")
* `--resource`: Add a resource that will be initialized with guessers (can be used multiple times). Set to "skip" to bypass the interactive resource step.
* `--install`: Set the package manager to use for installing dependencies ("yarn", "npm", "bun" or "skip" to bypass the interactive install step)

## `--interactive`

When using this option, the terminal will ask you to choose:

* a [data provider](#data-provider)
* an [auth provider](#auth-provider)
* the names of the [resources](#resources) to add
* the [package manager](#package-manager) to use to install the dependencies

<video controls autoplay playsinline muted loop>
  <source src="./img/create-react-admin.webm" type="video/webm"/>
  <source src="./img/create-react-admin.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## `--data-provider`

`create-react-admin` currently supports five presets for the application's data provider:

* `fakerest`: A client-side data provider that use a JSON object for data, powered by [FakeRest](https://github.com/marmelab/FakeRest).
* `json-server`: A data provider based on the [JSON Server](https://github.com/typicode/json-server) API
* `simple-rest`: A data provider for [simple REST APIs](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest)
* `supabase`: A data provider for [Supabase](https://github.com/marmelab/ra-supabase/tree/main/packages/ra-supabase). The auth-provider and resources steps will be skipped.
* `none` (default): You'll configure the data provider myself.

You can set your data provider directly with the `--data-provider` option:

```sh
npx create-react-admin@latest your-admin-name --data-provider json-server
```

## `--auth-provider`

`create-react-admin` currently supports two presets to set the application's auth provider which are:

* `local-auth-provider`: Hard coded username/password.
* `none` (default): No authProvider.

You can set your auth provider directly with the `--auth-provider` option:

```sh
npx create-react-admin@latest your-admin-name --auth-provider local-auth-provider
```

## `--resource`

`create-react-admin` creates an empty app by default. You can initialize CRUD pages for some resources with the `--resource` option:

```sh
npx create-react-admin@latest your-admin-name --resource posts --resource comments
```

**Warning:** the `--resource` flag is incompatible with a `--data-provider supabase` due to a specific [`<AdminGuesser>` component](https://github.com/marmelab/ra-supabase/tree/main/packages/ra-supabase#usage) from `ra-supabase`.

## `--install`

`create-react-admin` can install dependencies using any of the following package managers:

* `npm` (default)
* `yarn`
* `bun`
* `none` (if you want to install dependencies yourself)

You choose an alternative package manager with the `--install` option:

```sh
npx create-react-admin@latest your-admin-name --install bun
```
