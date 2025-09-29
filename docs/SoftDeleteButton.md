---
layout: default
title: "The SoftDeleteButton Component"
---

# `<SoftDeleteButton>`

Soft-deletes the current record.

![A soft delete button in a `<DataTable>`](https://react-admin-ee.marmelab.com/assets/SoftDeleteButton.png)

## Usage

`<SoftDeleteButton>` reads the current record from `RecordContext`, and the current resource from `ResourceContext`, so in general it doesn't need any property:

{% raw %}
```tsx
import { SoftDeleteButton } from '@react-admin/ra-soft-delete';

const CommentShow = () => (
    <>
        {/* ... */}
        <SoftDeleteButton />
    </>
);
```
{% endraw %}

When pressed, it will call `dataProvider.softDelete()` with the current record's `id`.

You can also call it with a record and a resource:

{% raw %}
```tsx
<SoftDeleteButton record={{ id: 123, author: 'John Doe' }} resource="comments" />
```
{% endraw %}

## Props


| Prop                | Required | Type                             | Default           | Description                                                            |
|-------------------- |----------|--------------------------------- |-------------------|------------------------------------------------------------------------|
| `className`         | Optional | `string`                         | -                 | Class name to customize the look and feel of the button element itself |
| `label`             | Optional | `string`                         | -                 | label or translation message to use                                    |
| `icon`              | Optional | `ReactElement`                   | `<DeleteIcon>`    | iconElement, e.g. `<CommentIcon />`                                    |
| `mutationMode`      | Optional | `string`                         | `'undoable'`      | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)        |
| `mutation Options`  | Optional |                                  | null              | options for react-query `useMutation` hook                             |
| `record`            | Optional | `Object`                         | -                 | Record to soft delete, e.g. `{ id: 12, foo: 'bar' }`                   |
| `redirect`          | Optional | `string`, `false` or function    | 'list'            | Custom redirection after success side effect                           |
| `resource`          | Optional | `string`                         | -                 | Resource to soft delete, e.g. 'posts'                                  |
| `sx`                | Optional | `SxProps`                        | -                 | The custom styling for the button                                      |
| `success Message`   | Optional | `string`                         | 'Element deleted' | Lets you customize the success notification message.                   |

## `label`

By default, the label is `Archive` in English. In other languages, it's the translation of the `'ra-soft-delete.action.soft_delete'` key.

You can customize this label by providing a resource specific translation with the key `resources.RESOURCE.action.soft_delete` (e.g. `resources.posts.action.soft_delete`):

{% raw %}
```ts
// in src/i18n/en.ts
import englishMessages from 'ra-language-english';

export const en = {
    ...englishMessages,
    resources: {
        posts: {
            name: 'Post |||| Posts',
            action: {
                soft_delete: 'Archive %{recordRepresentation}'
            }
        },
    },
    // ...
};
```
{% endraw %}

You can also customize this label by specifying a custom `label` prop:

```tsx
<SoftDeleteButton label="Delete this comment" />
```

Custom labels are automatically translated, so you can use a translation key, too:

```tsx
<SoftDeleteButton label="resources.comments.actions.soft_delete" />
```

## `icon`

Customize the icon of the button by passing an `icon` prop:

{% raw %}
```jsx
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';

<SoftDeleteButton icon={<AutoDeleteIcon />} />
```
{% endraw %}

## `mutationMode`

`<SoftDeleteButton>` has three modes, depending on the `mutationMode` prop:

- `'undoable'` (default): Clicking the button will update the UI optimistically and display a confirmation snackbar with an undo button. If the user clicks the undo button, the record will not be soft-deleted and the UI will be rolled back. Otherwise, the record will be soft-deleted after 5 seconds.
- `optimistic`: Clicking the button will update the UI optimistically and soft-delete the record. If the soft-deletion fails, the UI will be rolled back.
- `pessimistic`: Clicking the button will display a confirmation dialog. If the user confirms, the record will be soft-deleted. If the user cancels, nothing will happen.

**Note**: When choosing the `pessimistic` mode, `<SoftDeleteButton>` will actually render a [`<SoftDeleteWithConfirmButton>`](#softdeletewithconfirmbutton) component and accept additional props to customize the confirm dialog (see below).

## `mutationOptions`

`<SoftDeleteButton>` calls the `useMutation` hook internally to soft-delete the record. You can pass options to this hook using the `mutationOptions` prop.

{% raw %}
```tsx
<SoftDeleteButton mutationOptions={{ onError: () => alert('Record not deleted, please retry') }} />
```
{% endraw %}

Check out the [useMutation documentation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) for more information on the available options.

## `record`

By default, `<SoftDeleteButton>` reads the current record from the `RecordContext`. If you want to delete a different record, you can pass it as a prop:

{% raw %}
```tsx
<SoftDeleteButton record={{ id: 123, author: 'John Doe' }} />
```
{% endraw %}

## `redirect`

By default, `<SoftDeleteButton>` redirects to the list page after a successful deletion. You can customize the redirection by passing a path as the `redirect` prop:

```tsx
<SoftDeleteButton redirect="/comments" />
```

## `resource`

By default, `<SoftDeleteButton>` reads the current resource from the `ResourceContext`. If you want to delete a record from a different resource, you can pass it as a prop:

{% raw %}
```tsx
<SoftDeleteButton record={{ id: 123, author: 'John Doe' }} resource="comments" />
```
{% endraw %}

## `successMessage`

On success, `<SoftDeleteButton>` displays a "Element deleted" notification in English. `<SoftDeleteButton>` uses two successive translation keys to build the success message:

- `resources.{resource}.notifications.soft_deleted` as a first choice
- `ra-soft-delete.notification.soft_deleted` as a fallback

To customize the notification message, you can set custom translation for these keys in your i18nProvider.

**Tip**: If you choose to use a custom translation, be aware that react-admin uses the same translation message for the `<SoftDeleteButton>` and `<BulkSoftDeleteButton>`, so the message must support [pluralization](https://marmelab.com/react-admin/TranslationTranslating.html#interpolation-pluralization-and-default-translation):

{% raw %}
```tsx
const englishMessages = {
    resources: {
        comments: {
            notifications: {
                soft_deleted: 'Comment archived |||| %{smart_count} comments archived',
                // ...
            },
        },
    },
};
```
{% endraw %}

Alternately, pass a `successMessage` prop:

```tsx
<SoftDeleteButton successMessage="Comment deleted successfully" />
```

## Access Control

If your `authProvider` implements [Access Control](https://marmelab.com/react-admin/Permissions.html#access-control), `<SoftDeleteButton>` will only render if the user has the "soft_delete" access to the related resource.

`<SoftDeleteButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "soft_delete", resource: [current resource], record: [current record] }
```