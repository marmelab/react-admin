---
layout: default
title: "The AutoSave Component"
---

# `<AutoSave>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" />  component enables autosaving of the form. Alternative to [`<SaveButton>`](./SaveButton.md), it's ideal for long data entry tasks, and reduces the risk of data loss.

<video controls autoplay playsinline muted loop>
  <source src="./img/AutoSave.webm" type="video/webm"/>
  <source src="./img/AutoSave.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-form-layout-autosave-optimistic--in-simple-form).

## Usage

Put `<AutoSave>` inside a react-admin form ([`<SimpleForm>`](./SimpleForm.md), [`<TabbedForm>`](./TabbedForm.md), [`<LongForm>`](./LongForm.md), etc.), for instance in a custom toolbar. The component renders nothing by default. It will save the current form values 3 seconds after the last change, and render a message when the save succeeds or fails.

Note that you **must** set the `<Form resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

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

## Props

| Prop        | Required | Type           | Default | Description                               |
| ----------- | -------- | -------------- | ------- | ----------------------------------------- |
| `debounce`  | Optional | `number`       | 3000    | The interval in ms between two saves      |
| `onSuccess` | Optional | `function`     | -       | A callback to call when the save succeeds |
| `onError`   | Optional | `function`     | -       | A callback to call when the save fails    |
| `transform` | Optional | `function`     | -       | A function to transform the data before saving |

## `useAutoSave`

If you want an autosave feature with another user interface, you can leverage the `useAutoSave` hook. It's used internally by `<AutoSave>`, and has the same constraints (it works for the `pessimistic` and `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) but not for the `undoable`).

`useAutoSave` expects an options argument with the following fields, all optional:

-   `debounce`: The interval in ms between two saves. Defaults to 3000 (3s).
-   `onSuccess`: A callback to call when the save request succeeds.
-   `onError`: A callback to call when the save request fails.
-   `transform`: A function to transform the data before saving.

Note that you **must** add the `resetOptions` prop with `{ keepDirtyValues: true }` to avoid having the user changes overridden by the latest update operation result.

{% raw %}
```tsx
import { useAutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';

const AutoSave = () => {
    const [lastSave, setLastSave] = useState();
    const [error, setError] = useState();
    useAutoSave({
        interval: 5000,
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
    interval: 5000,
    onSuccess: () => setLastSave(new Date()),
    onError: error => setError(error),
});
```
