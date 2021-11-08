---
layout: default
title: "useShowController"
---

# `useShowController`

`useShowController` is the hook that handles all the controller logic for Show views. It's used by `<Show>` and `<ShowBase>`.

This hook takes care of three things:

- it reads the resource name and id from the resource context and browser location
- it fetches the record from the data provider via `dataProvider.getOne()`,
- it computes the default page title

## Usage

You can use `useShowController` to create your own custom Show view, like this one:

```jsx
import { useShowController, RecordContextProvider, SimpleShowLayout } from 'react-admin';

const PostShow = () => {
    const {
        defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
        error,  // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onFailure` side effect.
        loaded, // boolean that is false until the record is available
        loading, // boolean that is true on mount, and false once the record was fetched
        record, // record fetched via dataProvider.getOne() based on the id from the location
        refetch, // callback to refetch the record via dataProvider.getOne()
        resource, // the resource name, deduced from the location. e.g. 'posts'
        version, // integer used by the refresh feature
    } = useShowController();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!</div>;
    }
    return (
        <RecordContextProvider value={record}>
            <h1>{defaultTitle}</h1>
            <SimpleShowLayout>
                <TextField source="title" />
                ...
            </SimpleShowLayout>
        </RecordContextProvider>
    );
};
```

This custom Show view has no action buttons - it's up to you to add them in pure React.

Here are all the props accepted by the `useShowcontroller` hook:

* [`onFailure`](#failure-side-effects)

## Failure Side Effects

By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a function as the `onFailure` prop:

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

    const {
        defaultTitle,
        error,
        loading,
        record,
    } = useShowController({ onFailure });

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!</div>;
    }
    return (
        <RecordContextProvider value={record}>
            <h1>{defaultTitle}</h1>
            <SimpleShowLayout>
                <TextField source="title" />
                ...
            </SimpleShowLayout>
        </RecordContextProvider>
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

## Controlled Mode

By default, `useShowController` reads the resource name from the resource context, and the record id from the browser location.

But by passing `resource` and `id` props, you can run the controller logic outside of these contexts:

```jsx
import { useShowController } from 'react-admin';
import ShowView from './ShowView';

const MyShow = () => {
    const controllerProps = useShowController({ resource: 'posts', id: 1234 });
    return <ShowView {...controllerProps} />;
};
```

## See Also

* [`<ShowBase>`](./ShowBase.md) calls `useShowController`, puts the result in a `RecordContextProvider` and renders the component child. In many cases, you'll pefer this component to the hook version.

## API

* [`useShowController`]
* [`<ShowBase>`]
* [`<Show>`]

[`useShowController`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowController.ts
[`<ShowBase>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/ShowBase.tsx
[`<Show>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Show.tsx
