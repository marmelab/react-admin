---
title: "useGenerateChangeMessage"
---
Automatically generates a human-readable message describing the changes made to a record by comparing the new data with the existing record.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

```tsx
import { EditBase } from 'ra-core';
import { SimpleForm, TextInput } from 'my-react-admin-ui-library';
import { useGenerateChangeMessage } from '@react-admin/ra-core-ee';

const ProductEdit = () => {
    const generateChangeMessage = useGenerateChangeMessage();

    const handleSave = data => {
        const message = generateChangeMessage({ data });
        // message might be: "Changed name, description" or "Initial revision"
        console.log(message);
    };

    return (
        <EditBase mutationOptions={{ onSuccess: handleSave }}>
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="description" />
            </SimpleForm>
        </EditBase>
    );
};
```

**Parameters:**

- `props.resource?`: The resource name (defaults to current resource context)
- `props.record?`: The original record (defaults to current record context)

**Returns:**
A function that takes `{ data, record?, resource? }` and returns a localized message describing the changes:

- `"Initial revision"` for new records
- `"No changes"` when no fields were modified
- `"Changed [field]"` for single field changes
- `"Changed [field1], [field2], ..."` for multiple field changes

**Internationalization:**
The returned message is fully internationalized using the `i18n` provider. The following translation keys are used:

- `ra-history.on_save.initial_changes`: "Initial revision"
- `ra-history.on_save.no_changes`: "No changes"
- `ra-history.on_save.one_change`: "Changed %{field}"
- `ra-history.on_save.many_changes`: "Changed %{fields}"