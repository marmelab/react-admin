---
layout: default
title: "The BulkSoftDeleteButton Component"
---

# `<BulkSoftDeleteButton>`

Soft-deletes the selected rows. To be used inside [the `<DataTable bulkActionButtons>` prop](https://marmelab.com/react-admin/DataTable.html#bulkactionbuttons).

![A bulk soft delete button in a `<DataTable>`](https://react-admin-ee.marmelab.com/assets/BulkSoftDeleteButton.png)

## Usage

`<BulkSoftDeleteButton>` reads the selected record ids from the `ListContext`, and the current resource from `ResourceContext`, so in general it doesn’t need any props:

```tsx
import * as React from 'react';
import { BulkExportButton, DataTable } from 'react-admin';
import { BulkSoftDeleteButton } from '@react-admin/ra-soft-delete';

const PostBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkSoftDeleteButton />
    </>
);

export const PostList = () => (
    <List>
        <DataTable bulkActionButtons={<PostBulkActionButtons />}>
            ...
        </DataTable>
    </List>
);
```

## Props

| Prop              | Required | Type                                    | Default                                    | Description                                                                                                                          |
|-------------------|----------|-----------------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `confirm Content`  | Optional | React node                              | -                                          | Lets you customize the content of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes                  |
| `confirm Title`    | Optional | `string`                                | -                                          | Lets you customize the title of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes                    |
| `confirm Color`    | Optional | <code>'primary' &#124; 'warning'</code> | 'primary'                                  | Lets you customize the color of the confirm dialog's "Confirm" button. Only used in `'pessimistic'` or `'optimistic'` mutation modes |
| `label`           | Optional | `string`                                | 'ra-soft-delete. action. soft_delete'        | label or translation message to use                                                                                                  |
| `icon`            | Optional | `ReactElement`                          | `<DeleteIcon>`                             | iconElement, e.g. `<CommentIcon />`                                                                                                  |
| `mutation Mode`    | Optional | `string`                                | `'undoable'`                               | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                                      |
| `mutation Options` | Optional | `object`                                | null                                       | options for react-query `useMutation` hook                                                                                           |
| `success Message`  | Optional | `string`                                | 'ra-soft-delete. notification. soft_deleted' | Lets you customize the success notification message.                                                                                 |

**Tip:** If you choose the `'pessimistic'` or `'optimistic'` mutation mode, a confirm dialog will be displayed to the user before the mutation is executed.

## `successMessage`

On success, `<BulkSoftDeleteButton>` displays a "XX elements deleted" notification in English. `<BulkSoftDeleteButton>` uses two successive translation keys to build the success message:

- `resources.{resource}.notifications.soft_deleted` as a first choice
- `ra-soft-delete.notification.soft_deleted` as a fallback

To customize the notification message, you can set custom translation for these keys in your i18nProvider.

**Tip**: If you choose to use a custom translation, be aware that react-admin uses the same translation message for the `<SoftDeleteButton>`, so the message must support [pluralization](https://marmelab.com/react-admin/TranslationTranslating.html#interpolation-pluralization-and-default-translation):

```tsx
const englishMessages = {
    resources: {
        posts: {
            notifications: {
                soft_deleted: 'Post archived |||| %{smart_count} posts archived',
                // ...
            },
        },
    },
};
```

Alternately, pass a `successMessage` prop:

```tsx
<BulkSoftDeleteButton successMessage="Posts deleted successfully" />
```