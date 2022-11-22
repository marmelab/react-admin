---
layout: default
title: "Vite Integration"
---

# Vite Integration

[Vite](https://vitejs.dev/) is a JavaScript bundler which improves speed of dev server and production build compared to Webpack.

## Setting Up React App with Vite

Create a new Vite project with React template using the command line:

```sh
yarn create vite my-admin --template react
```

We recommend using the TypeScript template:

```sh
yarn create vite my-admin --template react-ts
```

## Setting Up React-Admin

Add the `react-admin` package, as well as a data provider package. In this example, we'll use `ra-data-json-server` to connect to a test API provided by [JSONPlaceholder](https://jsonplaceholder.typicode.com).

```sh
cd my-admin
yarn add react-admin ra-data-json-server
```

Next, create the admin app component in `src/admin/index.tsx`:

```jsx
// in src/admin/index.tsx
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={ListGuesser} />
    <Resource name="comments" list={ListGuesser} />
  </Admin>
);

export default App;
```

This is a minimal admin for 2 resources. React-admin should be able to render a list of posts and a list of comments, guessing the data structure from the API response. 

Next, replace the `App.tsx` component with the following:

```jsx
import MyAdmin from "./admin";

const App = () => <MyAdmin />;

export default App;
```

Then, change the `index.css` file to look like this:

```css
# in src/index.css
body {
    margin: 0;
}
```

Finally, add the `Roboto` font to your `index.html` file:

```diff
// in ./index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Admin</title>
+   <link
+     rel="stylesheet"
+     href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
+   />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

Now, start the server with `yarn dev`, browse to `http://localhost:5173/`, and you should see the working admin:

![Working Page](./img/nextjs-react-admin.webp)

Your app is now up and running, you can start tweaking it. 
