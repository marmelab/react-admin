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

const { 
    save, // the create or update callback, which receives the form data and calls the dataProvider
    saving, //  boolean that becomes true when the dataProvider is called
    mutationMode, // the current mutation mode, either 'undoable', 'optimistic', or 'pessimistic'
} = useSaveContext();
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
