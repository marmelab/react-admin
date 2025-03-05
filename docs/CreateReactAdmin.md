---
layout: default
title: "The create-react-admin CLI"
---

# `create-react-admin`

`create-react-admin` is a package that generates a react-admin app scaffolding using [Vite](https://vitejs.dev/). It is designed to work on most setups and produces predictable and consistent results. It's the preferred way to create a new react-admin application.

<iframe src="https://www.youtube-nocookie.com/embed/i_TbS7quzww" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

Use it by running the following command:

<div><i>With NPM</i></div>

```sh
npm create react-admin@latest your-admin-name
```

<div><i>With NPX</i></div>

```sh
npx create-react-admin@latest your-admin-name
```

<div><i>With Yarn</i></div>

```sh
yarn create react-admin your-admin-name
```

<div><i>With Bun</i></div>

```sh
bun create react-admin your-admin-name
```

It will choose every option for you and create your new React-Admin application.
To select them, you can use the `--interactive` flag and the terminal will then ask you to choose:

- a [data provider](#data-provider)
- an [auth provider](#auth-provider)
- the names of the [resources](#resources) to add
- the [package manager](#package-manager) to use to install the dependencies

<video controls autoplay playsinline muted loop>
  <source src="./img/create-react-admin.webm" type="video/webm"/>
  <source src="./img/create-react-admin.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The generated app will be similar to the one installed manually with [Vite.js](./Vite.md).

Once the installation is complete, you can run the app with:

```sh
npm run dev
# or
yarn dev
# or
bun run dev
```

## Data Provider

`create-react-admin` currently supports five templates presets to set the application's data provider which are:

- **Fakerest:** A client-side, in-memory data provider that use a JSON object as its initial data.
- **JSON Server:** A data provider based on the JSON Server API (<https://github.com/typicode/json-server>)
- **Simple REST:** A Simple REST data provider (<https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest>)
- **Supabase:** Generate an application using ra-supabase. The auth-provider and resources steps will be skipped.
- **None:** You'll configure the data provider myself.

You can set your data provider directly in the command, without using interactivity:

```sh
npm create react-admin@latest your-admin-name --data-provider json-server
# or
npx create-react-admin@latest your-admin-name --data-provider simple-rest
# or
yarn create react-admin your-admin-name --data-provider supabase
# or
bun create react-admin your-admin-name --data-provider none
```

## Auth Provider

`create-react-admin` currently supports two templates presets to set the application's auth provider which are:

- **Hard coded local username/password.**
- **None:** No authProvider.

You can set your auth provider directly in the command, without using interactivity:

```sh
npm create react-admin@latest your-admin-name --auth-provider local-auth-provider
# or
npx create-react-admin@latest your-admin-name --auth-provider none
# or
yarn create react-admin your-admin-name --auth-provider local-auth-provider
# or
bun create react-admin your-admin-name --auth-provider none
```

## Resources

`create-react-admin` doesn't provide any resource by default. You can add some on `--interactive` mode or you can set your resources directly in the command, without using interactivity:

```sh
npm create react-admin@latest your-admin-name --resource posts
# or
npx create-react-admin@latest your-admin-name --resource posts --resource comments
# or
yarn create react-admin your-admin-name --resource posts
# or
bun create react-admin your-admin-name --resource posts --resource comments
```

**Warning:** the `--resource` flag is incompatible with a `--data-provider supabase` due to a specific [`<AdminGuesser>` component](https://github.com/marmelab/ra-supabase/tree/main/packages/ra-supabase#usage) from `ra-supabase`.

## Package Manager

`create-react-admin` currently supports two templates presets to set the application's auth provider which are:

- **npm**
- **yarn**
- **bun**
- **Don't install dependencies**, you'll do it myself.

You can set your auth provider directly in the command, without using interactivity:

```sh
npm create react-admin@latest your-admin-name --install npm
# or
yarn create react-admin your-admin-name --install yarn
# or
bun create react-admin your-admin-name --install bun
# or
npx create-react-admin@latest your-admin-name --install skip
```
