---
layout: default
title: "IfCanAccess"
---

# `<IfCanAccess>`

This component, part of [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac#ifcanaccess)<img class="icon" src="./img/premium.svg" />, renders its child only if the user has the right permissions.

## Usage

Wrap the components that you want to add access control to with the `<IfCanAccess>` component. 

For example, to display action buttons for a company record only if the user has the right permissions:

```jsx
import { IfCanAccess } from '@react-admin/ra-rbac';
import { Toolbar, DeleteButton, EditButton } from 'react-admin';

const CompanyRecordToolbar = () => (
    <Toolbar>
        <IfCanAccess action="edit">
            <EditButton />
        </IfCanAccess>
        <IfCanAccess action="delete">
            <DeleteButton />
        </IfCanAccess>
    </Toolbar>
);
```

With this code and the following user permissions:

```jsx
console.log(await authProvider.getPermissions())
// [
//     { action: ["create", "edit"], resource: "companies" },
//     ...
// ];
```

The `CompanyRecordToolbar` component will render the `<EditButton>` but not the `<DeleteButton>`.

## Props

| Prop | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `action` | Required | `string` | | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `resource` | Optional | `string` | | The resource to check, e.g. 'users', 'comments', 'posts', etc. Falls back to the current resource context if absent. |
| `record` | Optional | `object` | | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |
| `fallback` | Optional | `ReactNode` | `null` | The element to render when the user does not have the permission. Defaults to `null`. |

Additional props are passed down to the child element. 

## `action`

The `action` prop allows you to restrict a component to users who have a permission to use the specified action on the current resource.

For instance, if the user has the following permissions:

```jsx
console.log(await authProvider.getPermissions())
// [
//     { action: ["read", "create", "edit", "export"], resource: "companies" },
//     ...
// ];
```

To display the `ExportButton` in a `CompanyList` component, you would use:

```jsx
<IfCanAccess action="export">
    <ExportButton />
</IfCanAccess>
```

## `resource`

By default, `<IfCanAccess>` uses the current resource (from the `ResourceContext`) to check permissions. You can override this behavior by passing the `resource` prop:

```jsx
<IfCanAccess action="export" resource="companies">
    <ExportButton />
</IfCanAccess>
```

## `record`

RBAC allows to specify [record-level permissions](./AuthRBAC.md#record-level-permissions). These permissions are triggered when you specify the `record` prop.

For example, let's say a user has the permission to edit a company only if the company is in the same group as the user:

```jsx
console.log(await authProvider.getPermissions())
// [
    // { action: 'edit', resource: "companies', record: { group: 'middle_east' } },
// ];
```

To display the `EditButton` in a `CompanyShow` component, you would use:

```jsx
const EditCompanyButton = () => {
    const record = useRecordContext();
    return (
        <IfCanAccess action="edit" record={record}>
            <EditButton />
        </IfCanAccess>
    );
};
```

## `fallback`

`ra-rbac` shows a Not Found page when users try to access a page they don't have the permissions for. It is considered good security practice not to disclose to a potentially malicious user that a page exists if they are not allowed to see it.

However, should you prefer to show an Access Denied screen in those cases, you can do so by specifying a `fallback` component in `<IfCanAccess>`:

```tsx
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

**Tip**: This example uses a `Navigate` component to redirect to a custom page because you cannot use a `Redirect` component in this context. The `IfCanAccess` component uses a render prop, and `Redirect` only works in the render method of a component.

Note that if you use the `fallback` prop for a CRUD page (Create, Edit, List, Show) as above, you must use the `<Resource>` component from `react-admin` rather than the one from `ra-rbac`. This is because `ra-rbac` already does the access control check, and would redirect to the Not Found page before the fallback component is rendered.

```tsx
// In src/App.tsx
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import posts from './posts';

const AccessDenied = () => (
    <Typography>You don't have the required permissions to access this page.</Typography>
);

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>    
        <CustomRoutes>
            <Route path="access-denied" element={<AccessDenied />} />
        </CustomRoutes>
        <Resource name="posts" {...posts} />
    </Admin>
);
```
