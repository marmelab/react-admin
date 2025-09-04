---
title: "useSaveContext"
---

`useSaveContext` grabs the `save` callback prepared either by [`useEditController`](./useEditController.md) or [`useCreateController`](./useCreateController.md). It is used by [`<Form>`](./Form.md) to provide a default submit handler.

## Usage

```jsx
import { useSaveContext } from 'ra-core';

const { save, saving, mutationMode } = useSaveContext();
```

You can create a custom `SaveContext` to override the default `save` callback:

```jsx
import { SaveContextProvider } from 'ra-core';

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

## Return Value

`useSaveContext` returns an object with the following keys:

```jsx
const {
    save, // Create or update callback which receives form data and calls dataProvider
    saving, // Boolean, true when dataProvider is called
    mutationMode, // Current mutation mode, either 'undoable', 'optimistic' or 'pessimistic'
} = useSaveContext();
```
