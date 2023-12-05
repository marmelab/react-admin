---
layout: default
title: "useSaveContext"
---

# `useSaveContext`

`useSaveContext` grabs the `save` callback prepared either by [`useEditController`](./useEditController.md) or [`useCreateController`](./useCreateController.md). It is used by [`<SaveButton>`](./SaveButton.md) to submit the form.

`useSaveContext` is necessary because the `<SaveButton>` doesn't know if it is used in a `<Create>` or an `<Edit>` page.

## Usage

```jsx
import { useSaveContext } from 'react-admin';

const { save, saving, mutationMode } = useSaveContext();
```

You can create a custom `SaveContext` to override the default `save` callback:

{% raw %}
```jsx
import { SaveContextProvider } from 'react-admin';

const MyComponent = () => {
    const save = data => {
        console.log(data);
    }
    const saving = false;
    const mutationMode = "pessimistic";
    return (
        <SaveContextProvider value={{ save, saving, mutationMode }}>
            <MyForm />
        </SaveContextProvider>
    );
}
```
{% endraw %}

## Return Value

`useSaveContext` returns an object with the following keys:

```jsx
const {
    save, // Create or update callback which receives form data and calls dataProvider
    saving, // Boolean, true when dataProvider is called
    mutationMode, // Current mutation mode, either 'undoable', 'optimistic' or 'pessimistic'
} = useSaveContext();
```
