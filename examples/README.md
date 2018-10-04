# Examples

## Contributing

If you'd like to contribute example applications, you'll likely use [`create-react-app`](https://github.com/facebookincubator/create-react-app). Unfortunately, you won't be able to initialize your example by running `create-react-app myexample` directly in this directory. This is because `create-react-app` does not work yet with yarn workspaces and lerna. There is a workaround though:

Initialize your new example application outside of react-admin folder then simply move the newly created folder inside the `examples` folder. Finally, run `yarn` at the react-admin root folder.

**Tip:** Ensure you don't commit a `yarn.lock` inside your new example application folder.
