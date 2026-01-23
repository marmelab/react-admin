---
layout: default
title: "LockOnMount"
---

# `<LockOnMount>`

`<LockOnMount>` is the component version of the [`useLockOnMount`](./useLockOnMount.md) hook. It locks the current record on mount and unlocks it on unmount. It relies on `authProvider.getIdentity()` to get the identity of the current user. It guesses the current `resource` and `recordId` from the context (or the route) if not provided.

<video controls autoplay playsinline muted loop>
  <source src="https://registry.marmelab.com/assets/useLockOnMount.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Use this hook e.g. in an `<Edit>` component to lock the record so that it only accepts updates from the current user.

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { LockOnMount } from '@react-admin/ra-realtime';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" fullWidth />
            <TextInput source="headline" fullWidth multiline />
            <TextInput source="author" fullWidth />
            <LockOnMount />
        </SimpleForm>
    </Edit>
);
```

**Note**: If users close their tab/browser when on a page with a locked record, `LockOnMount` will block the navigation and show a notification until the record is unlocked.

## Parameters

`<LockOnMount>` accepts the same props as the [`useLockOnMount`](./useLockOnMount.md) hook.

