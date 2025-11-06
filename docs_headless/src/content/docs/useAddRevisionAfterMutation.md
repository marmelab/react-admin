---
title: "useAddRevisionAfterMutation"
---

This hook registers a mutation [middleware](https://marmelab.com/ra-core/useregistermutationmiddleware/) that automatically creates a revision after a successful create or update operation.

This middleware reads the revision metadata from a field named after the `REVISION_FIELD` constant, then removes it from the form data before saving the record.

The `REVISION_FIELD` constant can be imported from `@react-admin/ra-core-ee`.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Below is an example showing how to override the [`SaveContext`](https://marmelab.com/ra-core/usesavecontext/) to provide the revision metadata when saving a form:

```tsx
import React, { ReactNode, useMemo } from 'react';
import {
    EditBase,
    SaveContextProvider,
    useSaveContext,
    type SaveContextValue,
} from 'ra-core';
import { SimpleForm, TextInput, DeleteButton } from 'my-react-admin-ui-library';
import {
    useAddRevisionAfterMutation,
    useGenerateChangeMessage,
    REVISION_FIELD,
} from '@react-admin/ra-core-ee';

export const ProductEdit = () => (
    <EditBase>
        <CreateRevisionOnSave>
            <SimpleForm>
                <TextInput source="reference" />
                <TextInput source="category" />
            </SimpleForm>
        </CreateRevisionOnSave>
    </EditBase>
);

const CreateRevisionOnSave = ({ children }: { children: ReactNode }) => {
    const originalSaveContext = useSaveContext();
    useAddRevisionAfterMutation();
    const generateChangeMessage = useGenerateChangeMessage();

    // Wrap the original save function to add the revision data before saving
    const saveContext = useMemo<SaveContextValue>(
        () => ({
            ...originalSaveContext,
            save: async (record, callbacks) =>
                originalSaveContext.save!(
                    {
                        ...record,
                        // Store the revision metadata in a special field that will be removed by the middleware
                        [REVISION_FIELD]: {
                            message: generateChangeMessage({ data: record }),
                            description: '',
                            authorId: 'john',
                        },
                    },
                    callbacks
                ),
        }),
        [generateChangeMessage, originalSaveContext]
    );

    return (
        <SaveContextProvider value={saveContext}>
            {children}
        </SaveContextProvider>
    );
};
```

**Tip:** This example also leverages the [`useGenerateChangeMessage`](./useGenerateChangeMessage.md) hook to automatically generate a revision message based on the changes made in the form.
