---
title: "useAutoPersistInStore"
---

A hook that saves a form data in the store on change and reapplies it on mount.
It's ideal to ensure users don't lose their already filled data in an edit or a create form when they navigate to another page.

This hook prevents data loss in forms by automatically saving the form data in the store when users update it. When users return to the page, it reapplies the saved data to the form.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/AutoPersistInStore.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The temporary form data is only saved when the user navigates away from the page, and it is removed when the user submits the form or closes the tab. Users can opt out of the prefilling by clicking the "Cancel" button in the notification.

Saved data is not sent to the server. It is only persisted using the [store](https://marmelab.com/ra-core/store/) and is removed when the user logs out.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

### Usage

Call `useAutoPersistInStore` inside a react-admin form:

```tsx
import { AutoPersistInStoreBase, useAutoPersistInStoreContext } from '@react-admin/ra-core-ee';
import { EditBase, Form, Translate, useEvent, useCloseNotification } from 'ra-core';
import { Button, TextInput } from 'my-react-admin-ui-library';

const PostEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <AutoPersistInStore />
        </Form>
    </EditBase>
);

const AutoPersistInStore = () => {
    useAutoPersistInStore({
        notification: <AutoPersistNotification />
    });
    
    return null;
}

const AutoPersistNotification = () => {
    const closeNotification = useCloseNotification();
    const { reset } = useAutoPersistInStoreContext();

    const cancel = useEvent((event: React.MouseEvent) => {
        event.preventDefault();
        reset();
        closeNotification();
    });

    return (
        <div>
          <Translate i18nKey="ra-form-layout.auto_persist_in_store.applied_changes" />
          <Button label="ra.action.cancel" onClick={cancel} />
        </div>
    );
};
```

The hook will automatically save the form data in the store on change and reapply it when the form is mounted again.

It works both on create and edit forms.

### Props

| Prop                  | Required | Type        | Default                              | Description                                                                                 |
| --------------------- | -------- | ----------- | ------------------------------------ | ------------------------------------ |
| `notification`        | Required | `ReactNode` | -                                    | A Notification element.              |
| `getStoreKey`         | -        | `function`  | -                                    | Function to use your own store key.  |

### `getStoreKey`

To save the current form data in the [store](https://marmelab.com/ra-core/usestorecontext/), `useAutoPersistInStore` uses the following store key:

`ra-persist-[RESOURCE_NAME]-[RECORD_ID]`

For example, if you are editing a `posts` resource with the ID `123`, the store key will be: `ra-persist-posts-123`. In case of a create form, the record ID is replaced by `"create"`

You can override this key by passing a custom function as the `getStoreKey` prop. It expects two parameters:

- `resource`: The current resource.
- `record`: The current record if you are in an [edit context](https://marmelab.com/ra-core/useeditcontext/).  

```tsx
useAutoPersistInStore({
    getStoreKey: (resource: ResourceContextValue, record: RaRecord<Identifier> | undefined) =>
        `my-custom-persist-key-${resource}-${record && record.hasOwnProperty('id') ? record.id : 'create'}`,
    notification: <AutoPersistNotification />
});
```

### `notification`

When `useAutoPersistInStore` hook applies the changes from the store to a form, react-admin informs users with a notification. 
The notification element provided will be passed to the `notify` function of the [`useNotify` hook](https://marmelab.com/ra-core/usenotify/).

```tsx
import { AutoPersistInStoreBase, useAutoPersistInStoreContext } from '@react-admin/ra-core-ee';
import { EditBase, Form, Translate, useEvent, useCloseNotification } from 'ra-core';
import { Button, TextInput } from 'my-react-admin-ui-library';

const PostEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="title" />
            <TextInput source="teaser" />
            <AutoPersistInStore />
        </Form>
    </EditBase>
);

const AutoPersistInStore = () => {
    useAutoPersistInStore({
        notification: <AutoPersistNotification />
    });
    
    return null;
}

const AutoPersistNotification = () => {
    const closeNotification = useCloseNotification();
    const { reset } = useAutoPersistInStoreContext();

    const cancel = useEvent((event: React.MouseEvent) => {
        event.preventDefault();
        reset();
        closeNotification();
    });

    return (
        <div>
          <Translate i18nKey="ra-form-layout.auto_persist_in_store.applied_changes" />
          <Button label="ra.action.cancel" onClick={cancel} />
        </div>
    );
};
```
