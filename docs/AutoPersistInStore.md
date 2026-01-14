---
layout: default
title: "The AutoPersistInStore Component"
---

# `<AutoPersistInStore>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component prevents data loss in forms by automatically saving the form data in the store when users update it. When users return to the page, it reapplies the saved data to the form.

<video controls autoplay playsinline muted loop>
  <source src="./img/AutoPersistInStore.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The temporary form data is saved on change, and it is removed when the user submits the form or closes the tab. Users can opt out of the prefilling by clicking the "Cancel" button in the notification.

Saved data is not sent to the server. It is only persisted using the [store](./Store.md) and is removed when the user logs out.

## Usage

Add `<AutoPersistInStore>` inside a react-admin form (`<SimpleForm>`, `<TabbedForm>`, `<LongForm>`, etc.):

```tsx
import { AutoPersistInStore } from '@react-admin/ra-form-layout';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <AutoPersistInStore />
        </SimpleForm>
    </Edit>
);
```

The component will automatically save the form data in the store on change and reapply it when the form is mounted again.

It works both on create and edit forms.

## Props

| Prop                  | Required | Type       | Default                            | Description                                                                                 |
| --------------------- | -------- | ---------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| `getStoreKey`         | -        | `function` | -                                  | Function to use your own store key.                                                         |
| `notification`        | -        | `ReactNode` | `<AutoPersistNotification>`       | The element used to show the notification, that allows users to reset the form.             |
| `notificationMessage` | -        | `string`   | "Applied previous unsaved changes" | Notification message to inform users that their previously saved changes have been applied. |

## `getStoreKey`

To save the current form data in the [store](./useStoreContext.md), `<AutoPersistInStore>` uses the following store key:

`ra-persist-[RESOURCE_NAME]-[RECORD_ID]`

For example, if you are editing a `posts` resource with the ID `123`, the store key will be: `ra-persist-posts-123`. In case of a create form, the record ID is replaced by `"create"`

You can override this key by passing a custom function as the `getStoreKey` prop. It expects two parameters:

- `resource`: The current resource.
- `record`: The current record if you are in an [edit context](./useEditContext.md).  

```tsx
<AutoPersistInStore 
    getStoreKey={
        (resource: ResourceContextValue, record: RaRecord<Identifier> | undefined) =>
            `my-custom-persist-key-${resource}-${record && record.hasOwnProperty('id') ? record.id : 'create'}`
    }
/>
```

## `notification`

When `<AutoPersistInStore>` component applies the changes from the store to a form, react-admin informs users with a notification.
This notification also provides them a way to revert the changes from the store.

You can make your own element and pass it using the `notification` prop:

```tsx
import { Translate, useCloseNotification, useEvent } from 'react-admin';
import { AutoPersistInStore, useAutoPersistInStoreContext } from '@react-admin/ra-form-layout';
import { Alert } from '@mui/material';

const MyAutoPersistInStore = () => (
    <AutoPersistInStore notification={<AutoPersistNotification />} />
);

const AutoPersistNotification = () => {
    const closeNotification = useCloseNotification();
    const { reset } = useAutoPersistInStoreContext();

    const cancel = useEvent((event: React.MouseEvent) => {
        event.preventDefault();
        reset();
        closeNotification();
    });

    return (
        <Alert
            severity="info"
            action={<Button label="ra.action.cancel" onClick={cancel} />}
        >
          <Translate i18nKey="ra-form-layout.auto_persist_in_store.applied_changes" />
        </Alert>
    );
};
```

## `notificationMessage`

When `<AutoPersistInStore>` component applies the changes from the store to a form, react-admin informs users with a notification.

The default notification message is `ra-form-layout.auto_persist_in_store.applied_changes`, which is translated using the i18n provider (the default English translation is `Applied previous unsaved changes`).

You can customize it with the `notificationMessage` prop:  

```tsx
<AutoPersistInStore notificationMessage="Modifications applied" />
```

**Tip:** You can pass a translation key as well:

```tsx
<AutoPersistInStore notificationMessage="myroot.message.auto_persist_applied" />
```
