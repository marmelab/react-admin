---
layout: default
title: "The ShowBase Component"
---

# `<ShowBase>`

The `<ShowBase>` component handles the headless logic of the Show page:

- it calls `useShowcontroller` to fetch the record from the data provider via `dataProvider.getOne()`,
- it creates a `ShowContext` and a `RecordContext`,
- it renders its child component

Contrary to `<Show>`, it does not render the page layout, so no title and actions.

## Usage

Use `<ShowBase>` instead of `<Show>` when you want a completely custom page layout, without the default actions and title.

{% raw %}
```jsx
// in src/posts.js
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

// in src/App.js
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

Here are all the props accepted by the `<ShowBase>` component:

* [`children`](#layout) is the component that actually renders something
* [`onFailure`](#failure-side-effects)

## Failure Side Effects

By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and  refreshes the page.

You can override this behavior and pass custom side effects by providing a function as `onFailure` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, ShowBase, SimpleShowLayout } from 'react-admin';

const PostShow = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onFailure = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'warning' });
        redirect('/posts');
        refresh();
    };

    return (
        <ShowBase onFailure={onFailure} {...props}>
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
        </ShowBase>
    );
}
```

The `onFailure` function receives the error from the dataProvider call (`dataProvider.getOne()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviders.md#error-format)).

The default `onFailure` function is:

```jsx
(error) => {
    notify('ra.notification.item_doesnt_exist', { type: 'warning' });
    redirect('list', basePath);
    refresh();
}
```

## API

* [`<ShowBase>`]
* [`<Show>`]

[`<ShowBase>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/details/ShowBase.tsx
[`<Show>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Show.tsx
