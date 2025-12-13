---
title: "<AutoSaveBase>"
---

A component that enables autosaving of the form. It's ideal for long data entry tasks, and reduces the risk of data loss.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/AutoSave.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Put `<AutoSaveBase>` inside a form built with ra-core [`<Form>`](https://marmelab.com/ra-core/form/):

```tsx
import { AutoSaveBase } from '@react-admin/ra-core-ee';
import { EditBase, Form } from 'ra-core';
import { TextInput } from 'my-react-admin-ui-library';

const PostEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form resetOptions={{ keepDirtyValues: true }}>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <button type="submit">Save</button>
            <AutoSaveBase
                render={({ error, isSaving, lastSaveAt }) => {
                    if (error) {
                        return <span>Error: {error}</span>;
                    }
                    if (isSaving) {
                        return <span>Saving...</span>;
                    }
                    if (lastSaveAt) {
                        return (
                            <span>
                                Last saved at{' '}
                                {new Intl.DateTimeFormat(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).format(new Date(lastSaveAt))}
                            </span>
                        );
                    }
                }}
            />
        </Form>
    </EditBase>
);
```

The app will save the current form values after 3 seconds of inactivity.

`<AutoSaveBase>` imposes a few limitations:

- You must set the `<Form resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.
- In an `<EditBase>` page, you must set [`mutationMode`](https://marmelab.com/ra-core/editbase/#mutationmode) to `pessimistic` or `optimistic` (`<AutoSaveBase>` doesn't work with the default `mutationMode="undoable"`).
- You can't use `<Form warnWhenUnsavedChanges>` with this component. `<AutoSaveBase>` implements its own similar mechanism, and it's enabled by default. You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges).
- It requires that you use a Data Router. This is the default for react-admin apps, but if you're using a custom router, you may need to adjust your configuration. Check the react-router documentation about [Using a Data Router with react-router v6](https://reactrouter.com/6.22.3/routers/picking-a-router) or [Using a Data Router with react-router v7](https://reactrouter.com/7.2.0/start/framework/custom).

## Props

| Prop                            | Required | Type            | Default  | Description                                                                 |
| ------------------------------- | -------- | --------------- | --------- | -------------------------------------------------------------------------- |
| `children`                      | -        | Element         |           | The content to display by leveraging `AutoSaveContext`                     |
| `render`                        | -        | Function        |           | A function to render the content.                                          |
| `debounce`                      | -        | number          | 3000 (3s) | The interval in milliseconds between two autosaves.                        |
| `onSuccess`                     | -        | function        |           | A callback to call when the save request succeeds.                         |
| `onError`                       | -        | function        |           | A callback to call when the save request fails.                            |
| `transform`                     | -        | function        |           | A function to transform the data before saving.                            |
| `disableWarnWhenUnsavedChanges` | -        | boolean         | false     | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |

## `children`

You can pass a children to `<AutoSaveBase>` and leverage its `AutoSaveContext` with the `useAutoSaveContext` hook:

```tsx
import { AutoSaveBase, useAutoSaveContext } from '@react-admin/ra-core-ee';
import { EditBase, Form } from 'ra-core';
import { TextInput } from 'my-react-admin-ui-library';

const AutoSaveContent = () => {
    const { error, isSaving, lastSaveAt } = useAutoSaveContext();

    if (error) {
        return <span>Error: {error}</span>;
    }
    if (isSaving) {
        return <span>Saving...</span>;
    }
    if (lastSaveAt) {
        return (
            <span>
                Last saved at{' '}
                {new Intl.DateTimeFormat(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(new Date(lastSaveAt))}
            </span>
        );
    }

    return null;
}

const PostEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form resetOptions={{ keepDirtyValues: true }}>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <button type="submit">Save</button>
            <AutoSaveBase>
                <AutoSaveContent />
            </AutoSaveBase>
        </Form>
    </EditBase>
);
```

## `debounce`

The interval in milliseconds between two autosaves. Defaults to 3000 (3s).

```tsx
<AutoSaveBase debounce={5000} />
```

## `onSuccess`

A callback to call when the save request succeeds.

```tsx
const [lastSave, setLastSave] = useState();

<AutoSaveBase
    onSuccess={() => setLastSave(new Date())}
/>
```

## `onError`

A callback to call when the save request fails.

```tsx
const [error, setError] = useState();

<AutoSaveBase
    onError={error => setError(error)}
/>
```

## `transform`

A function to transform the data before saving.

```tsx
<AutoSaveBase
    transform={data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    })}
/>
```

## `disableWarnWhenUnsavedChanges`

A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes.

```tsx
<AutoSaveBase disableWarnWhenUnsavedChanges />
```

## `render`

You can pass a `render` prop instead of [`children`](#children) to render a UI for the auto save feature:

```tsx
import { AutoSaveBase } from '@react-admin/ra-core-ee';

const AutoSave = () => (
    <AutoSaveBase
        render={({ error, isSaving, lastSaveAt }) => {
            if (error) {
                return <span>Error: {error}</span>;
            }
            if (isSaving) {
                return <span>Saving...</span>;
            }
            if (lastSaveAt) {
                return (
                    <span>
                        Last saved at{' '}
                        {new Intl.DateTimeFormat(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }).format(new Date(lastSaveAt))}
                    </span>
                );
            }
        }}
    />
);
```
