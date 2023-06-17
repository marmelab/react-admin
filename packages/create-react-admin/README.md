# create-react-admin

A CLI to bootstrap a new react-admin application.

## Usage

```sh
npm create react-admin@latest my-app
# or
yarn create react-admin my-app
```

You'll be asked to choose a data provider (optional), an auth provider (optional). You may also setup the resources you want initially.

## Development

Build the project with the following command at the monorepo root:

```sh
make build-create-react-admin
```

In another directory, run:

```sh
./react-admin/node_modules/.bin/create-react-admin my-admin
```

The above command assume you cloned react-admin in the `react-admin` directory and you are running the command in this directory parent.

To test the package as if it was published:

```sh
cd packages/create-react-admin
npm pack
tar -xvzf create-react-admin-<version>.tgz -C ~/
cd ~/package
npm install
./lib/cli.js test-cra
```

## Miscellaneous

This package is MIT licensed. Sponsored by [Marmelab](https://marmelab.com) and [Anthony Chan](https://github.com/ckanthony).