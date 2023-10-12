---
layout: default
title: "ShowGuesser"
---

# `<ShowGuesser>`

Instead of a custom `Show`, you can use the `ShowGuesser` to determine which fields to use based on the data returned by the API.

## Usage

```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource, ShowGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" show={ShowGuesser} />
    </Admin>
);
```

Just like `<Show>`, `<ShowGuesser>` fetches the data. It then analyzes the response, and guesses the fields it should use to display a basic page with the data.

It also dumps the components it has guessed in the console, where you can copy it into your own code. Use this feature to quickly bootstrap a Show page on top of an existing API, without adding the fields one by one.

![Guessed Show](./img/guessed-show.png)

`<ShowGuesser>` doesn't expose any prop, as it's not designed to be customized. You should replace it with a custom `<Show>` component as soon as you need to customize it.

React-admin provides guessers for the `List` view ([`<ListGuesser>`](./ListGuesser.md)), the `Edit` view ([`<EditGuesser>`](./EditGuesser.md)), and the `Show` view (`ShowGuesser`).

**Tip**: Do not use the guessers in production. They are slower than manually-defined components, because they have to infer types based on the content. Besides, the guesses are not always perfect.

## See Also

* [API Platform Admin](https://api-platform.com/docs/admin/) has a much more powerful `<ShowGuesser>` component that takes advantage of the API Schema.

## API

* [`<ShowGuesser>`]

[`<ShowGuesser>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/ShowGuesser.tsx