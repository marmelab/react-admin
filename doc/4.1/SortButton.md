---
layout: default
title: "The SortButton Component"
---

# `<SortButton>`

Some List views don't have a natural UI for sorting - e.g. the `<SimpleList>`, or a list of images, don't have column headers like the `<Datagrid>`. For these cases, react-admin offers the `<SortButton>`, which displays a dropdown list of fields that the user can choose to sort on.

![Sort Button](./img/sort-button.gif)

## Usage

`<SortButton>` requires a `fields` prop, containing the list of field names it should allow to sort on. For instance, here is how to offer a button to sort on the `reference`, `sales`, and `stock` fields:

```jsx
import * as React from 'react';
import { TopToolbar, SortButton, CreateButton, ExportButton } from 'react-admin';

const ListActions = () => (
    <TopToolbar>
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);
```

## `fields`

The `fields` prop expects an array of strings. Each string is the name of a field to sort on. The `<SortButton>` renders the corresponding menu item depending on the current sort order (ASC by default, or DESC if the current sort field is active).

```jsx
<SortButton fields={['reference', 'sales', 'stock']} />
```

## `icon`

You can customize the icon rendered on the left of the button by passing an `icon` prop.

```jsx
<SortButton 
    fields={['reference', 'sales', 'stock']}
    icon={<SortIcon />}
/>
```
