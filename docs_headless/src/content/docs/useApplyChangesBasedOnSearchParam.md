---
title: "useApplyChangesBasedOnSearchParam"
---
Monitors the URL for a `_change` search parameter and automatically applies those changes to the current form. This is useful for implementing a "revert to revision" functionality.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

```tsx
import { EditBase } from 'ra-core';
import { SimpleForm, TextInput } from 'my-react-admin-ui-library';
import { useApplyChangesBasedOnSearchParam } from '@react-admin/ra-core-ee';

const ApplyChangesBasedOnSearchParam = () => {
    const hasCustomParams = useApplyChangesBasedOnSearchParam();
    return hasCustomParams ? (
        <div
            style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #856404',
                padding: '0.75em 1em',
            }}
            role="alert"
        >
            This form has been pre-filled with the changes from a previous
            revision. You can still modify the data before saving it.
        </div>
    ) : null;
};

const ProductEdit = () => (
    <EditBase>
        <SimpleForm>
            <ApplyChangesBasedOnSearchParam />
            <TextInput source="name" />
            <TextInput source="description" />
        </SimpleForm>
    </EditBase>
);
```

**Usage:**
Navigate to a URL like `/products/1?_change={"name":"New Name","description":"New Description"}` to pre-fill the form with the specified data.

**Returns:**

- `boolean`: `true` if the form was pre-filled from URL parameters and the user hasn't made changes yet. Useful to show a warning message.

The hook:

1. Reads the `_change` parameter from the URL
2. Parses the JSON data
3. Sets form values using `setValue` with `shouldDirty: true`
4. Removes the search parameter from the URL
5. Tracks whether the form has custom parameters and user modifications

**Tip:** Be sure to use this hook as a child of a form component such as `<Form>` so that it can access the form context.
