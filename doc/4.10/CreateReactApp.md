---
layout: default
title: "Create_React-App Integration"
---

# Create-React-App Integration

[Create-React-App](https://create-react-app.dev/) is the standard way to bootstrap single-page React applications. That's also the recommended way to install and run react-admin. 

## Setting Up Create React App

Create a new Create React App (CRA) project with the command line:

```sh
yarn create react-app my-admin
```

We recommend using the TypeScript template:

```sh
yarn create react-app my-admin --template typescript
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

Now, start the server with `yarn start`, browse to `http://localhost:3000/`, and you should see the working admin:

![Working Page](./img/nextjs-react-admin.webp)

Your app is now up and running, you can start tweaking it. 
