---
layout: default
title: "IfCanAccess"
---

# `<IfCanAccess>`

This component, part of [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac#ifcanaccess)<img class="icon" src="./img/premium.svg" />, relies on the `authProvider` to render its child only if the user has the right permissions. It accepts the following props:

- `action` (`string`, required): the action to check, e.g. 'read', 'list', 'export', 'delete', etc.
- `resource` (`string`, optional): the resource to check, e.g. 'users', 'comments', 'posts', etc. Falls back to the current resource context if absent.
- `record` (`object`, optional): the record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }`
- `fallback` (`ReactNode`, optional): The element to render when the user does not have the permission. Defaults to `null`.

Additional props are passed down to the child element. 

```jsx
import { IfCanAccess } from '@react-admin/ra-rbac';
import { Toolbar, DeleteButton, EditButton, ShowButton } from 'react-admin';

const RecordToolbar = () => (
    <Toolbar>
        <IfCanAccess action="edit">
            <EditButton />
        </IfCanAccess>
        <IfCanAccess action="show">
            <ShowButton />
        </IfCanAccess>
        <IfCanAccess action="delete">
            <DeleteButton />
        </IfCanAccess>
    </Toolbar>
);
```

## Showing An Access Denied Message Instead Of A Not Found Page

`ra-rbac` shows a Not Found page when users try to access a page they don't have the permissions for. It is considered good security practice not to disclose to a potentially malicious user that a page exists if they are not allowed to see it.

However, should you prefer to show an Access Denied screen in those cases, you can do so by using the `Resource` component from `react-admin` instead of the one from `ra-rbac` and leveraging the `IfCanAccess` component in your views:

```tsx
// In src/App.tsx
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import posts from './posts';

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="posts" {...posts} />
    </Admin>
);

// in src/AccessDenied.tsx
export const AccessDenied = () => (
    <Typography>You don't have the required permissions to access this page.</Typography>
);

// in src/posts/PostCreate.tsx
import { Create, SimpleForm, TextInput } from 'react-admin';
import { IfCanAccess } from '@react-admin/ra-rbac';
import { AccessDenied } from '../AccessDenied';

export const PostCreate = () => (
    <IfCanAccess action="create" fallback={<AccessDenied />}>
        <Create>
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Create>
    </IfCanAccess>
);
```

You can also choose to redirect users to a [custom route](https://marmelab.com/react-admin/CustomRoutes.html):

```tsx
// In src/App.tsx
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import posts from './posts';
import { AccessDenied } from '../AccessDenied';

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <CustomRoutes>
            <Route path="access-denied" element={<AccessDenied />} />
        </CustomRoutes>
        <Resource name="posts" {...posts} />
    </Admin>
);

// in src/AccessDenied.tsx
export const AccessDenied = () => (
    <Typography>You don't have the required permissions to access this page.</Typography>
);

// in src/posts/PostCreate.tsx
import { Create, SimpleForm, TextInput } from 'react-admin';
import { IfCanAccess } from '@react-admin/ra-rbac';
import { Navigate } from 'react-router-dom';

export const PostCreate = () => (
    <IfCanAccess action="create" fallback={<Navigate to="/access-denied" />}>
        <Create>
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Create>
    </IfCanAccess>
);
```
