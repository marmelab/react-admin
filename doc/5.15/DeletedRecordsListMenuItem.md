---
layout: default
title: "The DeletedRecordsListMenuItem Component"
---

# `<DeletedRecordsListMenuItem>`

The `<DeletedRecordsListMenuItem>` component displays a menu item for the deleted records list.

```tsx
// in src/MyMenu.tsx
import { Menu } from 'react-admin';
import { DeletedRecordsListMenuItem } from '@react-admin/ra-soft-delete';

export const MyMenu = () => (
    <Menu>
        <DeletedRecordsListMenuItem />
        ...
    </Menu>
);
```

![A deleted records list menu item](https://react-admin-ee.marmelab.com/assets/DeletedRecordsListMenuItem.png)

Clicking on the deleted records list menu item leads to the `/deleted` route by default. You can customize it using the `to` property:

```tsx
// in src/MyMenu.tsx
import { Menu } from 'react-admin';
import { DeletedRecordsListMenuItem } from '@react-admin/ra-soft-delete';

export const MyMenu = () => (
    <Menu>
        <DeletedRecordsListMenuItem to="/trash" />
        ...
    </Menu>
);
```

`<DeletedRecordsListMenuItem>` inherits all properties from [`<Menu.Item>`](https://marmelab.com/react-admin/Menu.html#menuitem) component.
This means that you can customize this menu item label by using the `primaryText` or `children` properties.