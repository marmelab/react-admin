---
layout: default
title: "<SimpleFormIteratorBase>"
---

`<SimpleFormIteratorBase>` helps building a component that lets users edit, add, remove and reorder sub-records. It is designed to be used as a child of [`<ArrayInputBase>`](./ArrayInputBase.md) or [`<ReferenceManyInput>`](./ReferenceManyInput.md). You can also use it within an `ArrayInputContext` containing a *field array*, i.e. the value returned by [react-hook-form's `useFieldArray` hook](https://react-hook-form.com/docs/usefieldarray).

## Usage

Here's one could implement a minimal `SimpleFormIterator` using `<SimpleFormIteratorBase>`:

```tsx
export const SimpleFormIterator = ({ children, ...props }: SimpleFormIteratorBaseProps) => {
    const { fields, replace } = useArrayInput(props);
    const records = useFieldValue({ source: finalSource });

    return (
        <SimpleFormIteratorBase {...props}>
            <ul>
                {fields.map((member, index) => (
                    <SimpleFormIteratorItemBase
                        key={member.id}
                        fields={fields}
                        index={index}
                    >
                        <li>
                            {props.children}
                        </li>
                    </SimpleFormIteratorItemBase>
                ))}
            </ul>
        </SimpleFormIteratorBase>
    )
}
```

## Props

| Prop       | Required | Type           | Default               | Description                                   |
|------------|----------|----------------|-----------------------|-----------------------------------------------|
| `children` | Optional | `ReactElement` | -                     | List of inputs to display for each array item |