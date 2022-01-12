---
layout: default
title: "The ChipField Component"
---

# `<ChipField>`

Displays a value inside a ["Chip"](https://material-ui.com/components/chips), which is Material UI's term for a label.

## CSS API

| Rule name  | Description                                              |
| ---------- | -------------------------------------------------------- |
| `chip`     | Applied to the underlying Material UI's `Chip` component |

To override the style of all instances of `<ChipField>` using the [material-ui style overrides](https://material-ui.com/customization/globals/#css), use the `RaChipField` key.

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

Any additional props are passed to material-ui's `<Chip>` element. Check [The material-ui `<Chip>` documentation](https://material-ui.com/api/chip/) for details.
