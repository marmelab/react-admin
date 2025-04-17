---
layout: default
title: "The AutoPersistInStore Component"
---

# `<AutoPersistInStore>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component saves a form data in the store on unmount (e.g. when users leave the page) and reapplies it on mount.
It's ideal to ensure users don't loose their already filled data in an edit or a create form when they navigate to another page.

<video controls autoplay playsinline muted loop>
  <source src="./img/AutoPersistInStore.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

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

## Props

| Prop                  | Required | Type       | Default                                                  | Description                                                   |
| --------------------- | -------- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| `getStoreKey`         | -        | `function` | -                                                        | Function to use your own store key.                           |
| `notificationMessage` | -        | `string`   | `"ra-form-layout.` `auto_persist_ in_store` `.applied_changes"` | Notification message to inform users that their previously saved changes have been applied. |

## `getStoreKey`

To save the current form data in the [store](./useStoreContext.md), `<AutoPersistInStore>` uses a default key that can be overridden with the `getStoreKey` prop.
It accepts a function with two parameters:

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

The default key is `ra-persist-YOUR_RESOURCE-RECORD_ID` (in case of a create form, the record `id` is replaced by `"create"`), e.g. `ra-persist-customers-5`.

## `notificationMessage`

When `<AutoPersistInStore>` component applies the changes from the store to a form, react-admin's inform users with a notification. You can customize it with the `notificationMessage` prop:  

```tsx
<AutoPersistInStore notificationMessage="Modifications applied" />
```

**Tip:** You can pass a translation key as well:

```tsx
<AutoPersistInStore notificationMessage="myroot.message.auto_persist_applied" />
```
