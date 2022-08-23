---
layout: default
title: "The ListGuesser Component"
---

# `<ListGuesser>`

Use `<ListGuesser>` to quickly bootstrap a List view on top of an existing API, without adding the fields one by one.

Just like [`<List>`](./List.md), `<ListGuesser>` fetches the data. It then analyzes the response, and guesses the fields it should use to display a basic `<Datagrid>` with the data. It also dumps the components it has guessed in the console, so you can copy it into your own code.

![Guessed List](./img/guessed-list.png)

## Usage

You can use the `<ListGuesser>` component to determine which fields to use based on the data returned by the API.

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" list={ListGuesser} />
    </Admin>
);
```

React-admin provides guessers for the List view (`<ListGuesser>`), the Edit view ([`<EditGuesser>`](./EditGuesser.md)), and the Show view ([`<ShowGuesser>`](./ShowGuesser.md)).

**Tip**: Do not use the guessers in production. They are slower than manually-defined components, because they have to infer types based on the content. Besides, the guessers are not always perfect.