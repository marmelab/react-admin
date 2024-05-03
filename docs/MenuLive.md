---
layout: default
title: "The MenuLive Component"
---

# `<MenuLive>`

`<MenuLive>` is an [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component that renders a Menu, and displays a badge with the number of updated records on each unactive Menu item.

![MenuLive](./img/MenuLive.png)

## Usage

Use `<MenuLive>` instead of `<Menu>` in a custom layout:

```tsx
import type { ReactNode } from 'react';
import { Admin, Layout, Resource } from 'react-admin';
import { MenuLive } from '@react-admin/ra-realtime';
import { PostList, PostShow, PostEdit, realTimeDataProvider } from '.';

const CustomLayout = ({ children }: { children: ReactNode }) => (
    <Layout menu={MenuLive}>
        {children}
    </Layout>
);

const MyReactAdmin = () => (
    <Admin dataProvider={realTimeDataProvider} layout={CustomLayout}>
        <Resource name="posts" list={PostList} show={PostShow} edit={PostEdit} />
    </Admin>
);
```

To trigger the `<MenuLive>` badges, the API has to publish events containing at least the followings keys:

```js
{
    topic : '/resource/{resource}',
    type: '{deleted || created || updated}',
    payload: { ids: [{listOfRecordIdentifiers}]},
}
```

## `<MenuLiveItemLink>`

`<MenuLiveItemLink>` displays a badge with the number of updated records if the current menu item is not active (Used to build `<MenuLive>` and your custom `<MyMenuLive>`).

```jsx
import React from 'react';
import { MenuProps } from 'react-admin';
import { MenuLiveItemLink } from '@react-admin/ra-realtime';

const CustomMenuLive = () => (
    <div>
        <MenuLiveItemLink
            to="/posts"
            primaryText="The Posts"
            resource="posts"
            badgeColor="primary"
        />
        <MenuLiveItemLink
            to="/comments"
            primaryText="The Comments"
            resource="comments"
        />
    </div>
);
```

`<MenuLiveItemLink>` has two additional props compared to `<MenuItemLink>`:

-   `resource`: Needed, The name of the concerned resource (can be different from the path in the `to` prop)
-   `badgeColor`: Optional, It's the Material UI color used to display the color of the badge. The default is `alert` (not far from the red). It can also be `primary`, `secondary`, or any of the Material UI colors available in the [Material UI palette](https://material-ui.com/customization/palette/).

The badge displays the total number of changed records since the last time the `<MenuItem>` opened. The badge value resets whenever the user opens the resource list page, and the `<MenuItem>` becomes active.

To trigger `<MenuLiveItemLink>` behavior, the API has to publish events containing at least the following elements:

```js
{
    topic : '/resource/{resource}',
    type: '{deleted || created || updated}',
    payload: { ids: [{listOfRecordIdentifiers}]},
}
```
