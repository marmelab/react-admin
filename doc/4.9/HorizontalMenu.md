---
layout: default
title: "The HorizontalMenu Component"
---

# `<HorizontalMenu>`


This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component renders a horizontal menu, alternative to react-admin's [`<Menu>`](./Menu.md), to be used in the AppBar of the [`<ContainerLayout>`](./ContainerLayout.md).

![Container layout](https://marmelab.com/ra-enterprise/modules/assets/ra-navigation/latest/container-layout.png)

## Usage

Create a menu component based on `<HorizontalMenu>` and `<HorizontalMenu.Item>` children. Each child should have a `value` corresponding to the [application location](https://marmelab.com/ra-enterprise/modules/ra-navigation#concepts) of the target, and can have a `to` prop corresponding to the target location if different from the app location.

```jsx
import { HorizontalMenu } from '@react-admin/ra-navigation';

export const Menu = () => (
    <HorizontalMenu>
        <HorizontalMenu.Item label="Dashboard" to="/" value="" />
        <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
        <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
    </HorizontalMenu>
);
```

Then pass it to the `<ContainerLayout>`:

```jsx
import { Admin, Resource } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

import { Menu } from './Menu';

const MyLayout = props => <ContainerLayout {...props} menu={<Menu />} />;

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        ...
    </Admin>
);
```

See more details in the [ra-navigation documentation](https://marmelab.com/ra-enterprise/modules/ra-navigation#containerlayout).