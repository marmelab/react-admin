---
layout: default
title: "WithPermissions"
---

# `<WithPermissions>`

This component, part of [the ra-rbac module](https://marmelab.com/ra-rbac)<img class="icon" src="./img/premium.svg" />, relies on the `authProvider` to render its child only if the user has the right permissions. It accepts the following props:

- `action` (string, required): the action to check, e.g. 'read', 'list', 'export', 'delete', etc.
- `resource` (string required): the resource to check, e.g. 'users', 'comments', 'posts', etc.
- `record` (object, optional): the record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }`

Additional props are passed down to the child element. 

```jsx
import { WithPermissions } from '@react-admin/ra-rbac';
import { DeleteButton, EditButton, ShowButton } from 'react-admin';

const RecordToolbar = ({ resource }) => (
    <Toolbar>
        <WithPermissions action="edit" resource={resource}>
            <EditButton />
        </WithPermissions>
        <WithPermissions action="show" resource={resource}>
            <ShowButton />
        </WithPermissions>
        <WithPermissions action="delete" resource={resource}>
            <DeleteButton />
        </WithPermissions>
    </Toolbar>
);
```
