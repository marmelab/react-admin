---
title: "<BulkUpdateFormBase>"
---

This component can be used to create forms that update multiple records at once. It's typically used in list views or in components that display a list of references and allow users to select records. When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/BulkUpdateButton-SimpleForm.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Here's how one could implement a form that sets the role of multiple users:

```tsx
import { ListBase, Form } from 'ra-core';
import { DataTable, SelectInput } from 'my-react-admin-ui-library';
import { BulkUpdateFormBase } from '@react-admin/ra-core-ee';
const UserList = () => (
    <ListBase>
        <BulkUpdateFormBase>
            <Form>
                <SelectInput source="role" />
                <button type="submit">Update users role</button>
            </Form>
        </BulkUpdateFormBase>
        <DataTable hasBulkActions>
            <DataTable.Col source="id" />
            <DataTable.Col source="email" />
            <DataTable.Col source="role" />
        </DataTable>
    </ListBase>
);
```

## Props

| Prop              | Required      | Type     | Default         | Description                                                                                                                        |
| ----------------- | ------------- | -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `children`        | Required (\*) | Element  | -               | A form component                                                                                                                   |
| `mutationMode`    | -             | `string` | `'pessimistic'` | The mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                                |
| `mutationOptions` | -             | Object   | -               | Mutation options passed to [react-query](https://tanstack.com/query/v3/docs/react/reference/useMutation) when calling `updateMany` |

## `children`

`<BulkUpdateFormBase>` expects a form component as children, such as [`<Form>`](https://marmelab.com/ra-core/form/).

```tsx
import * as React from 'react';
import { Form } from 'ra-core';
import { BulkUpdateFormBase } from '@react-admin/ra-core-ee';
import { SelectInput } from 'my-react-admin-ui-library';
const UserRoleBulkUpdateForm = () => (
    <BulkUpdateFormBase>
        <Form>
            <SelectInput source="role" />
            <button type="submit">Update users role</button>
        </Form>
    </BulkUpdateFormBase>
);
```

## `mutationMode`

Use the `mutationMode` prop to specify the [mutation mode](https://marmelab.com/ra-core/editbase/#mutationmode).

```tsx
import * as React from 'react';
import { Form } from 'ra-core';
import { BulkUpdateFormBase } from '@react-admin/ra-core-ee';
import { SelectInput } from 'my-react-admin-ui-library';
const UserRoleBulkUpdateForm = () => (
    <BulkUpdateFormBase mutationMode="undoable">
        <Form>
            <SelectInput source="role" />
            <button type="submit">Update users role</button>
        </Form>
    </BulkUpdateFormBase>
);
```

## `mutationOptions` and `meta`

The `mutationOptions` prop can be used to pass options to the [react-query mutation](https://react-query.tanstack.com/reference/useMutation#options) used to call the dataProvider's `updateMany` method.

```tsx
import * as React from 'react';
import { Form } from 'ra-core';
import { BulkUpdateFormBase } from '@react-admin/ra-core-ee';
import { SelectInput } from 'my-react-admin-ui-library';
const UserRoleBulkUpdateForm = () => (
    <BulkUpdateFormBase mutationOptions={{ retry: false }}>
        <Form>
            <SelectInput source="role" />
            <button type="submit">Update users role</button>
        </Form>
    </BulkUpdateFormBase>
);
```

You can also use this prop to pass a `meta` object, that will be passed to the dataProvider when calling `updateMany`.

```tsx
import * as React from 'react';
import { Form } from 'ra-core';
import { BulkUpdateFormBase } from '@react-admin/ra-core-ee';
import { SelectInput } from 'my-react-admin-ui-library';
const UserRoleBulkUpdateForm = () => (
    <BulkUpdateFormBase mutationOptions={{ meta: { foo: 'bar' } }}>
        <Form>
            <SelectInput source="role" />
            <button type="submit">Update users role</button>
        </Form>
    </BulkUpdateFormBase>
);
```
