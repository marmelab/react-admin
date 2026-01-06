---
layout: default
title: "<SimpleFormIteratorBase>"
---

`<SimpleFormIteratorBase>` helps building a component that lets users edit, add, remove and reorder sub-records. It is designed to be used as a child of [`<ArrayInputBase>`](./ArrayInputBase.md) or [`<ReferenceManyInputBase>`](https://react-admin-ee.marmelab.com/documentation/ra-core-ee#referencemanyinputbase). You can also use it within an `ArrayInputContext` containing a *field array*, i.e. the value returned by [react-hook-form's `useFieldArray` hook](https://react-hook-form.com/docs/usefieldarray).

## Usage

Here's how one could implement a minimal `SimpleFormIterator` using `<SimpleFormIteratorBase>`:

```tsx
import {
    SimpleFormIteratorBase,
    SimpleFormIteratorItemBase,
    useArrayInput,
    useFieldValue,
    useSimpleFormIterator,
    useSimpleFormIteratorItem,
    useWrappedSource,
    type SimpleFormIteratorBaseProps
} from 'ra-core';

export const SimpleFormIterator = ({ children, ...props }: SimpleFormIteratorBaseProps) => {
    const { fields } = useArrayInput(props);
    // Get the parent source by passing an empty string as source
    const source = useWrappedSource('');
    const records = useFieldValue({ source });

    return (
        <SimpleFormIteratorBase {...props}>
            <ul>
                {fields.map((member, index) => (
                    <SimpleFormIteratorItemBase
                        key={member.id}
                        index={index}
                        record={record}
                    >
                        <li>
                            {children}
                            <RemoveItemButton />
                        </li>
                    </SimpleFormIteratorItemBase>
                ))}
            </ul>
            <AddItemButton />
        </SimpleFormIteratorBase>
    )
}

const RemoveItemButton = () => {
    const { remove } = useSimpleFormIteratorItem();
    return (
        <button type="button" onClick={() => remove()}>Remove</button>
    )
}

const AddItemButton = () => {
    const { add } = useSimpleFormIterator();
    return (
        <button type="button" onClick={() => add()}>Add</button>
    )
}
```

## Props

| Prop               | Required | Type        | Default | Description                                             |
| ------------------ | -------- | ----------- | ------- | ------------------------------------------------------- |
| `children`         | Optional | `ReactNode` | -       | List of inputs to display for each array item           |
| `disableAutoFocus` | Optional | `boolean`   | `false` | Prevent focusing the first input when adding a new item |

## `disableAutoFocus`

When true, will pass `{ shouldFocus: false }` to `react-hook-form`'s [`useFieldArray`](https://react-hook-form.com/docs/usefieldarray) `append()` method when adding a new item, preventing the first input of the newly added item from being focused automatically.
