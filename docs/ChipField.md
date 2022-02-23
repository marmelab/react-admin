---
layout: default
title: "The ChipField Component"
---

# `<ChipField>`

Displays a value inside a ["Chip"](https://mui.com/components/chips), which is MUI's term for a label.

## `sx`: CSS API

The `<ChipField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name            | Description                                              |
|----------------------|----------------------------------------------------------|
| `&.RaChipField-chip` | Applied to the underlying MUI 's `Chip` component |

To override the style of all instances of `<ChipField>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaChipField` key.

## Usage

```jsx
import { ChipField } from 'react-admin';

<ChipField source="category" />
```

![ChipField](./img/chip-field.png)

This field type is especially useful for one to many relationships, e.g. to display a list of books for a given author:

```jsx
import { ChipField, SingleFieldList, ReferenceManyField } from 'react-admin';

<ReferenceManyField reference="books" target="author_id">
    <SingleFieldList>
        <ChipField source="title" />
    </SingleFieldList>
</ReferenceManyField>
```

Any additional props are passed to MUI's `<Chip>` element. Check [The MUI `<Chip>` documentation](https://mui.com/api/chip/) for details.
