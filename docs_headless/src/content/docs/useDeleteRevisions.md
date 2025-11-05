---
title: "useDeleteRevisions"
---
Provides a mutation function to delete all revisions for a specific record. This is useful notably to delete all revisions when the record itself is deleted.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Here is an example showing how to implement a `<DeleteWithRevisionsButton>` that deletes both the record and its revisions:

```tsx
import { EditBase, Form, useResourceContext, useRecordContext } from 'ra-core';
import { TextInput, DeleteButton } from 'my-react-admin-ui-library';
import { useDeleteRevisions } from '@react-admin/ra-core-ee';

const DeleteWithRevisionsButton = () => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const [deleteRevisions] = useDeleteRevisions();
    return (
        <DeleteButton
            mutationOptions={{
                onSettled: (_data, error) => {
                    if (error) return;
                    deleteRevisions(resource, { recordId: record?.id });
                },
            }}
            label="Delete with revisions"
        />
    );
};

export const ProductEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="reference" />
            <TextInput source="category" />
            <DeleteWithRevisionsButton />
        </Form>
    </EditBase>
);
```

**Hook Parameters:**

- `resource?`: Resource name. Defaults to the current resource context.
- `params?`: Default parameters with `recordId`
- `options?`: Default mutation options

**Returns:**
A tuple with:

1. `deleteRevisions`: Function to trigger the deletion
2. `mutation`: React Query mutation result object

**`deleteRevisions` Parameters:**

- `resource?`: Resource name (overrides hook-time resource)
- `params?`: Object with `recordId` (overrides hook-time params)
- `options?`: Mutation options including `returnPromise: boolean` (overrides hook-time options)