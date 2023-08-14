---
layout: default
title: "The ShowBase Component"
---

# `<ShowBase>`

The `<ShowBase>` component handles the headless logic of the Show page:

- it calls `useShowController` to fetch the record from the data provider via `dataProvider.getOne()`,
- it computes the default page title
- it creates a `ShowContext` and a `RecordContext`,
- it renders its child component

Contrary to `<Show>`, it does not render the page layout, so no title, no actions, and no `<Card>`.

## Usage

Use `<ShowBase>` instead of `<Show>` when you want a completely custom page layout, without the default actions and title.

{% raw %}
```jsx
// in src/posts.jsx
import * as React from "react";
import { ShowBase } from 'react-admin';

const PostShow = () => (
    <ShowBase resource="posts">
        <Grid container>
            <Grid item xs={8}>
                <SimpleShowLayout>
                    ...
                </SimpleShowLayout>
            </Grid>
            <Grid item xs={4}>
                Show instructions...
            </Grid>
        </Grid>
        <div>
            Post related links...
        </div>
    </ShowBase>
);

// in src/App.jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostShow } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" show={PostShow} />
    </Admin>
);
```
{% endraw %}

## Props

* `children` the components that actually render something
* [`queryOptions`](#client-query-options): options to pass to the react-query client

## Client Query Options

`<ShowBase>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, ShowBase, SimpleShowLayout } from 'react-admin';

const PostShow = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'error' });
        redirect('/posts');
        refresh();
    };

    return (
        <ShowBase queryOptions={{ onError }} {...props}>
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
        </ShowBase>
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getOne()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify('ra.notification.item_doesnt_exist', { type: 'error' });
    redirect('list', resource);
    refresh();
}
```

## See Also

* [`useShowController`](./useShowController.md) for a completely headless version of this component

## API

* [`<ShowBase>`]
* [`<Show>`]

[`<ShowBase>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/ShowBase.tsx
[`<Show>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Show.tsx
