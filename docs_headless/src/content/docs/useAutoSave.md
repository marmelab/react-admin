---
title: "useAutoSave"
---

A hook that automatically saves the form at a regular interval. It works for the `pessimistic` and `optimistic` [`mutationMode`](https://marmelab.com/ra-core/editbase/#mutationmode) but not for the `undoable`.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Note that you **must** add the `resetOptions` prop with `{ keepDirtyValues: true }` to avoid having the user changes overridden by the latest update operation result.

**Note**: `useAutoSave` is not compatible with the default `warnWhenUnsavedChanges` prop of the react-admin form components. However, it implements its own similar mechanism which is enabled by default.
You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges).

**Note**: Due to limitations in react-router, this equivalent of `warnWhenUnsavedChanges` only works if you use the default router provided by react-admin, or if you use a [Data Router with react-router v6](https://reactrouter.com/6.22.3/routers/picking-a-router) or [with react-router v7](https://reactrouter.com/7.2.0/start/framework/custom).
If not, you'll need to use the `disableWarnWhenUnsavedChanges` prop.

```tsx
import { useAutoSave } from '@react-admin/ra-core-ee';
import { EditBase, Form } from 'ra-core';
import { TextInput } from 'my-react-admin-ui-library';

const AutoSave = () => {
    const [lastSave, setLastSave] = useState();
    const [error, setError] = useState();
    useAutoSave({
        debounce: 5000,
        onSuccess: () => setLastSave(new Date()),
        onError: error => setError(error),
    });
    return (
        <div>
            {lastSave && <p>Saved at {lastSave.toLocaleString()}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

const PostEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form resetOptions={{ keepDirtyValues: true }}>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <button type="submit">Save</button>
            <AutoSave />
        </Form>
    </EditBase>
);
```

`useAutoSave` returns a boolean indicating whether the form is currently being saved.

```jsx
const isSaving = useAutoSave({
    debounce: 5000,
    onSuccess: () => setLastSave(new Date()),
    onError: error => setError(error),
});
```

## Parameters

It accepts the following parameters:

| Parameter                       | Required | Type            | Default  | Description                                   |
| ------------------------------- | -------- | -------- | --------- | --------------------------------------------------- |
| `debounce`                      | -        | number   | 3000 (3s) | The interval in milliseconds between two autosaves. |
| `onSuccess`                     | -        | function |           | A callback to call when the save request succeeds.  |
| `onError`                       | -        | function |           | A callback to call when the save request fails.     |
| `transform`                     | -        | function |           | A function to transform the data before saving.    |
| `disableWarnWhenUnsavedChanges` | -        | boolean  | false     | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |

## `debounce`

The interval in milliseconds between two autosaves. Defaults to 3000 (3s).

```tsx
const isSaving = useAutoSave({
    debounce: 5000,
});
```

## `disableWarnWhenUnsavedChanges`

A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes.

```tsx
const isSaving = useAutoSave({
    disableWarnWhenUnsavedChanges: true
});
```

## `onSuccess`

A callback to call when the save request succeeds.

```tsx
const [lastSave, setLastSave] = useState();

const isSaving = useAutoSave({
    onSuccess: () => setLastSave(new Date()),
});
```

## `onError`

A callback to call when the save request fails.

```tsx
const [error, setError] = useState();

const isSaving = useAutoSave({
    onError: error => setError(error),
});
```

## `transform`

A function to transform the data before saving.

```tsx
const isSaving = useAutoSave({
    transform: data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    })
});
```
