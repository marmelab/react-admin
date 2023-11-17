---
layout: default
title: "The create-react-admin CLI"
---

# `create-react-admin`

`create-react-admin` is a package that generates a react-admin app scaffolding using [Vite](https://vitejs.dev/). It is designed to work on most setups and produces predictable and consistent results. It's the preferred way to create a new react-admin application.

## Usage

Use it by running the following command:

```sh
npx create-react-admin@latest your-admin-name
# or
yarn create react-admin your-admin-name
```

The terminal will then ask you to choose:
- a data provider
- an auth provider
- the names of the resources to add
- the package manager to use to install the dependencies

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
```
