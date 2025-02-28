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

Put `<AutoSave>` inside a react-admin form ([`<SimpleForm>`](./SimpleForm.md), [`<TabbedForm>`](./TabbedForm.md), [`<LongForm>`](./LongForm.md), etc.), for instance in a custom toolbar. The component renders nothing by default. It will save the current form values 3 seconds after the last change, and render a message when the save succeeds or fails.

Note that you **must** set the `<Form resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](./Edit.md#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

**Note**: `<AutoSave>` is not compatible with the default `warnWhenUnsavedChanges` prop of the react-admin form components. However, it implements its own similar mechanism which is enabled by default. You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges).

**Note** `<AutoSave>` does not currently work with forms that have child routes such as the [`<TabbedForm>`](./TabbedForm.md). If you want to use it in a `<TabbedForm>`, you must set its [`syncWithLocation` prop](./TabbedForm.md#syncwithlocation) to `false`.

{% raw %}
```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, SimpleForm, TextInput, DateInput, SelectInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <AutoSave />
    </Toolbar>
);

const PersonEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <DateInput source="dob" />
            <SelectInput source="sex" choices={[
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' },
            ]}/>
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

The app will save the current form values after 3 seconds of inactivity.

You can use a toolbar containing both a `<SaveButton>` and an `<AutoSave>` component. The `<SaveButton>` will let the user save the form immediately, while the `<AutoSave>` will save the form after 3 seconds of inactivity.

```tsx
const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);
```

**Tip**: If your `<Edit>` could change without being unmounted, for instance when it includes a [`<PrevNextButton>`](./PrevNextButtons.md#prevnextbuttons), you must ensure the `<Edit key>` changes whenever the record changes:

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
| `confirmationDuration`          | -        | `number \| false` | 3000 (3s) | The delay in milliseconds before the save confirmation message disappears. |
| `onSuccess`                     | -        | `function`        |           | A callback to call when the save request succeeds.                         |
| `onError`                       | -        | `function`        |           | A callback to call when the save request fails.                            |
| `transform`                     | -        | `function`        |           | A function to transform the data before saving.                            |
| `typographyProps`               | -        | `object`          |           | Additional props to pass to the `<Typography>` component that displays the confirmation and error messages. |
| `disableWarnWhenUnsavedChanges` | -        | `boolean`         | `false`   | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |

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

Note that you **must** add the `resetOptions` prop with `{ keepDirtyValues: true }` to avoid having the user changes overridden by the latest update operation result.

**Note**: `useAutoSave` is not compatible with the default `warnWhenUnsavedChanges` prop of the react-admin form components. However, it implements its own similar mechanism which is enabled by default. You can disable it with the [`disableWarnWhenUnsavedChanges` prop](#disablewarnwhenunsavedchanges-1).

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

| Parameter                       | Required | Type            | Default  | Description                                   |
| ------------------------------- | -------- | -------- | --------- | --------------------------------------------------- |
| `debounce`                      | -        | number   | 3000 (3s) | The interval in milliseconds between two autosaves. |
| `onSuccess`                     | -        | function |           | A callback to call when the save request succeeds.  |
| `onError`                       | -        | function |           | A callback to call when the save request fails.     |
| `transform`                     | -        | function |           | A function to transform the data before saving.    |
| `disableWarnWhenUnsavedChanges` | -        | boolean  | false     | A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes. |

### `debounce`

The interval in milliseconds between two autosaves. Defaults to 3000 (3s).

```tsx
const isSaving = useAutoSave({
    debounce: 5000,
});
```

### `onSuccess`

A callback to call when the save request succeeds.

```tsx
const [lastSave, setLastSave] = useState();

const isSaving = useAutoSave({
    onSuccess: () => setLastSave(new Date()),
});
```

### `onError`

A callback to call when the save request fails.

```tsx
const [error, setError] = useState();

const isSaving = useAutoSave({
    onError: error => setError(error),
});
```

### `transform`

A function to transform the data before saving.

```tsx
const isSaving = useAutoSave({
    transform: data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    })
});
```

### `disableWarnWhenUnsavedChanges`

A boolean indicating whether users should be warned when they close the browser tab or navigate away from the application if they have unsaved changes.

```tsx
const isSaving = useAutoSave({
    disableWarnWhenUnsavedChanges: true
});
```
