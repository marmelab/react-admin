---
layout: default
title: "The AutoSave Component"
---

# `<AutoSave>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" />  component enables autosaving of the form. Alternative to [`<SaveButton>`](./SaveButton.md), it's ideal for long data entry tasks, and reduces the risk of data loss.

<video controls autoplay playsinline muted loop>
  <source src="./img/AutoSave.webm" type="video/webm"/>
  <source src="./img/AutoSave.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-form-layout-autosave-optimistic--in-simple-form).

## Usage

Put `<AutoSave>` inside a react-admin form ([`<SimpleForm>`](./SimpleForm.md), [`<TabbedForm>`](./TabbedForm.md), [`<LongForm>`](./LongForm.md), etc.), for instance in a custom toolbar.

{% raw %}
```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="title" />
            <TextInput source="teaser" />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

The component renders nothing by default. It will save the current form values 3 seconds after the last change, and render a message when the save succeeds or fails.

`<AutoSave>` imposes a few limitations:

- You must set the `<Form resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.
- In an `<Edit>` page, you must set [`mutationMode`](./Edit.html#mutationmode) to `pessimistic` or `optimistic` (`<AutoSave>` doesn't work with the default `mutationMode="undoable"`).
- You can't use `<Form warnWhenUnsavedChanges>` with this component. `<AutoSave>` implements its own similar mechanism, and it's enabled by default. You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges).
- It requires that you use a Data Router. This is the default for react-admin apps, but if you're using a custom router, you may need to adjust your configuration. Check the react-router documentation about [Using a Data Router with react-router v6](https://reactrouter.com/6.22.3/routers/picking-a-router) or [Using a Data Router with react-router v7](https://reactrouter.com/7.2.0/start/framework/custom).
- When used in forms that have child routes (e.g., [`<TabbedForm>`](./TabbedForm.html)), you must set the [`syncWithLocation` prop](./TabbedForm.html#syncwithlocation) to `false`.
- If you want to support navigation between Edit pages of the same resource, for instance using [`<PrevNextButtons>`](./PrevNextButtons.html#prevnextbuttons), you must ensure that the `<Edit key>` changes whenever the record changes:

{% raw %}

```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, PrevNextButton, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';
import { useParams } from 'react-router';

const AutoSaveToolbar = () => (
    <Toolbar>
        <PrevNextButton />
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => {
    const { id } = useParams<'id'>();
    return (
        <Edit key={id} mutationMode="optimistic">
            <SimpleForm
                resetOptions={{ keepDirtyValues: true }}
                toolbar={<AutoSaveToolbar />}
            >
                <TextInput source="title" />
                <TextInput source="teaser" />
            </SimpleForm>
        </Edit>
    );
};
```

{% endraw %}

## Props

| Prop                            | Required | Type              | Default  | Description                                                                 |
| ------------------------------- | -------- | ----------------- | --------- | -------------------------------------------------------------------------- |
| `debounce`                      | -        | `number`          | 3000 (3s) | The interval in milliseconds between two autosaves.                        |
| `confirmationDuration`          | -        | `number` &#124; `false` | 3000 (3s) | The delay in milliseconds before the save confirmation message disappears. |
| `onSuccess`                     | -        | `function`        |           | A callback to call when the save request succeeds.                         |
| `onError`                       | -        | `function`        |           | A callback to call when the save request fails.                            |
| `transform`                     | -        | `function`        |           | A function to transform the data before saving.                            |
| `typographyProps`               | -        | `object`          |           | Additional props to pass to the `<Typography>` component that displays the confirmation and error messages. |
| `disableWarnWhen UnsavedChanges` | -        | `boolean`         | `false`   | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |

## `debounce`

The interval in milliseconds between two autosaves. Defaults to 3000 (3s).

```tsx
<AutoSave debounce={5000} />
```

## `confirmationDuration`

The delay in milliseconds before save confirmation message disappears. Defaults to 3000 (3s). When set to `false`, the confirmation message will not disappear.

```tsx
<AutoSave confirmationDuration={5000} />
<AutoSave confirmationDuration={false} />
```

## `onSuccess`

A callback to call when the save request succeeds.

```tsx
const [lastSave, setLastSave] = useState();

<AutoSave
    onSuccess={() => setLastSave(new Date())}
/>
```

## `onError`

A callback to call when the save request fails.

```tsx
const [error, setError] = useState();

<AutoSave
    onError={error => setError(error)}
/>
```

## `transform`

A function to transform the data before saving.

```tsx
<AutoSave
    transform={data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    })}
/>
```

## `typographyProps`

Additional props to pass to the [`<Typography>`](https://mui.com/material-ui/react-typography/#api) component that displays the confirmation and error messages.

{% raw %}

```tsx
<AutoSave typographyProps={{ sx: { color: 'textSecondary' }}} />
```

{% endraw %}

## `disableWarnWhenUnsavedChanges`

A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes.

```tsx
<AutoSave disableWarnWhenUnsavedChanges />
```

## `useAutoSave`

If you want an autosave feature with another user interface, you can leverage the `useAutoSave` hook. It's used internally by `<AutoSave>`, and has the same constraints (it works for the `pessimistic` and `optimistic` [`mutationMode`](./Edit.md#mutationmode) but not for the `undoable`).

**Note**: you **must** add the `resetOptions` prop with `{ keepDirtyValues: true }` to avoid having the user changes overridden by the latest update operation result.

**Note**: `useAutoSave` is not compatible with the default `warnWhenUnsavedChanges` prop of the react-admin form components. However, it implements its own similar mechanism which is enabled by default.
You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges-1).

**Note**: Due to limitations in react-router, this equivalent of `warnWhenUnsavedChanges` only works if you use the default router provided by react-admin, or if you use a [Data Router with react-router v6](https://reactrouter.com/6.22.3/routers/picking-a-router) or [with react-router v7](https://reactrouter.com/7.2.0/start/framework/custom).
If not, you'll need to use the `disableWarnWhenUnsavedChanges` prop.

**Note**: `useAutoSave` does not currently work with forms that have child routes such as the [`<TabbedForm>`](https://marmelab.com/react-admin/TabbedForm.html).
If you want to use it in a `<TabbedForm>`, you must set its [`syncWithLocation` prop](https://marmelab.com/react-admin/TabbedForm.html#syncwithlocation) to `false`.

**Note**: `useAutoSave` is not compatible with the default `warnWhenUnsavedChanges` prop of the react-admin form components. However, it implements its own similar mechanism which is enabled by default. You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges).

**Note** `useAutoSave` does not currently work with forms that have child routes such as the [`<TabbedForm>`](./TabbedForm.md). If you want to use it in a `<TabbedForm>`, you must set its [`syncWithLocation` prop](./TabbedForm.md#syncwithlocation) to `false`.

{% raw %}

```tsx
import { useAutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';

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

const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="title" />
            <TextInput source="teaser" />
        </SimpleForm>
    </Edit>
);
```

{% endraw %}

`usaAutoSave` returns a boolean indicating whether the form is currently being saved.

```jsx
const isSaving = useAutoSave({
    debounce: 5000,
    onSuccess: () => setLastSave(new Date()),
    onError: error => setError(error),
});
```

### Parameters

It accepts the following parameters:

| Parameter                                                         | Required | Type     | Default  | Description                                          |
| ----------------------------------------------------------------- | -------- | -------- | --------- | --------------------------------------------------- |
| [`debounce`](#debounce)                                           | -        | number   | 3000 (3s) | The interval in milliseconds between two autosaves. |
| [`onSuccess`](#onsuccess)                                         | -        | function |           | A callback to call when the save request succeeds.  |
| [`onError`](#onerror)                                             | -        | function |           | A callback to call when the save request fails.     |
| [`transform`](#transform)                                         | -        | function |           | A function to transform the data before saving.     |
| [`disableWarnWhen UnsavedChanges`](#disablewarnwhenunsavedchanges) | -        | boolean  | false     | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |
