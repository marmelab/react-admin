---
layout: default
title: "TabbedShowLayout"
---

# `<TabbedShowLayout>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component replace react-admin's `<TabbedShowLayout>` that only renders a tab if the user has the right permissions.

Use it in conjuction with [`<TabbedShowLayout.Tab>`](#tabbedshowlayouttab) and add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'read' permissions for.

**Tip:** [`<TabbedShowLayout.Tab>`](#tabbedshowlayouttab) also allows to only render the child fields for which the user has the 'read' permissions.

```tsx
import { Show, TextField } from 'react-admin';
import { TabbedShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () =>
        Promise.resolve([
            { action: ['list', 'show'], resource: 'products' },
            { action: 'read', resource: 'products.reference' },
            { action: 'read', resource: 'products.width' },
            { action: 'read', resource: 'products.height' },
            { action: 'read', resource: 'products.thumbnail' },
            { action: 'read', resource: 'products.tab.description' },
            // 'products.tab.stock' is missing
            { action: 'read', resource: 'products.tab.images' },
        ]),
};

const ProductShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Description" name="description">
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                <TextField source="description" />
            </TabbedShowLayout.Tab>
            {/* Tab Stock is not displayed */}
            <TabbedShowLayout.Tab label="Stock" name="stock">
                <TextField source="stock" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Images" name="images">
                <TextField source="image" />
                <TextField source="thumbnail" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## `<TabbedShowLayout.Tab>`

Replacement for react-admin's `<TabbedShowLayout.Tab>` that only renders a tab and its content if the user has the right permissions.

Add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'read' permissions for.

`<TabbedShowLayout.Tab>` also only renders the child fields for which the user has the 'read' permissions.

```tsx
import { Show, TextField } from 'react-admin';
import { TabbedShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () =>
        Promise.resolve([
            { action: ['list', 'show'], resource: 'products' },
            { action: 'read', resource: 'products.reference' },
            { action: 'read', resource: 'products.width' },
            { action: 'read', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'read', resource: 'products.thumbnail' },
            // 'products.image' is missing
            { action: 'read', resource: 'products.tab.description' },
            // 'products.tab.stock' is missing
            { action: 'read', resource: 'products.tab.images' },
        ]),
};

const ProductShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Description" name="description">
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                {/* Field Description is not displayed */}
                <TextField source="description" />
            </TabbedShowLayout.Tab>
            {/* Tab Stock is not displayed */}
            <TabbedShowLayout.Tab label="Stock" name="stock">
                <TextField source="stock" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Images" name="images">
                {/* Field Image is not displayed */}
                <TextField source="image" />
                <TextField source="thumbnail" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```
