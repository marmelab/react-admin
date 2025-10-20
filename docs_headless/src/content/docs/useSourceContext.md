---
title: useSourceContext
---

When using an `<ArrayInput>`, the `name` under which an input is registered in a `<Form>` is dynamically generated depending on the index of the item in the array.

To get the `name` of the input for a given index, you can leverage the `SourceContext` created by `ra-core`, which can be accessed using the `useSourceContext` hook.

You can then leverage `react-hook-form`’s <a href="https://react-hook-form.com/docs/useform/setvalue" target="_blank"  rel="noreferrer">`setValue`</a> method to change an item’s value programmatically.

```tsx
import { useSourceContext } from 'ra-core';
import { useFormContext } from 'react-hook-form';
import {
    ArrayInput,
    Button,
    SimpleFormIterator,
    TextInput,
} from 'your-ra-ui-library';

const MakeAdminButton = () => {
    const sourceContext = useSourceContext();
    const { setValue } = useFormContext();

    const onClick = () => {
        // sourceContext.getSource('role') will for instance return
        // 'users.0.role'
        setValue(sourceContext.getSource('role'), 'admin');
    };

    return (
        <Button onClick={onClick} size="small" sx={{ minWidth: 120 }}>
            Make admin
        </Button>
    );
};

const UserArray = () => (
    <ArrayInput source="users">
        <SimpleFormIterator inline>
            <TextInput source="name" helperText={false} />
            <TextInput source="role" helperText={false} />
            <MakeAdminButton />
        </SimpleFormIterator>
    </ArrayInput>
);
```

## Hook Value

| Name        | Type       | Description                                                             |
| ----------- | ---------- | ----------------------------------------------------------------------- |
| `getSource` | `function` | A function that returns the `name` of the input for the given `source`  |
| `getLabel`  | `function` | A function that returns the `label` of the input for the given `source` |

## `getSource`

The `getSource` function returns the `name` of a `source` withing a `SourceContext`.

```tsx
export function MyCustomInput({ source }: MyCustomInputProps) {
    const sourceContext = useSourceContext();
    const name = sourceContext.getSource(source);

    return /* ... */;
}

export type MyCustomInputProps = {
    source: string;
};
```

## `getLabel`

The `getLabel` function returns the `label` of a `source` withing a `SourceContext`.

```tsx
export function MyCustomInput({ source }: MyCustomInputProps) {
    const sourceContext = useSourceContext();
    const label = sourceContext.getLabel(source);

    return /* ... */;
}

export type MyCustomInputProps = {
    source: string;
};
```
