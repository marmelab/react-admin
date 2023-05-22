---
layout: default
title: "useLockOnCall"
---

# `useLockOnCall`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook gets a callback to lock a record and get a mutation state.

`useLockOnCall` calls `dataProvider.lock()` when the callback is called. It relies on `authProvider.getIdentity()` to get the identity of the current user. It guesses the current `resource` and `recordId` from the context (or the route) if not provided. It releases the lock when the component unmounts by calling `dataProvider.unlock()`.

<video controls autoplay playsinline muted loop>
  <source src="./img/useLockOnCall.webm" type="video/webm"/>
  <source src="./img/useLockOnCall.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

Use this hook in a toolbar, to let the user lock the record manually.

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { useLockOnMount } from '@react-admin/ra-realtime';
import { Alert, AlertTitle, Box, Button } from '@material-ui/core';

const PostAside = () => {
    const [doLock, { data, error, isLoading }] = useLockOnCall();
    return (
        <Box width={200} ml={1}>
            {isLoading ? (
                <Alert severity="info">Locking post...</Alert>
            ) : error ? (
                <Alert severity="warning">
                    <AlertTitle>Failed to lock</AlertTitle>Someone else is
                    probably already locking it.
                </Alert>
            ) : data ? (
                <Alert severity="success">
                    <AlertTitle>Post locked</AlertTitle> Only you can edit it.
                </Alert>
            ) : (
                <Button onClick={() => doLock()} fullWidth>
                    Lock post
                </Button>
            )}
        </Box>
    );
};
const PostEdit = () => (
    <Edit aside={<PostAside />}>
        <SimpleForm>
            <TextInput source="title" fullWidth />
            <TextInput source="headline" fullWidth multiline />
            <TextInput source="author" fullWidth />
        </SimpleForm>
    </Edit>
);
```

## Parameters

`useLockOnCall` accepts a single options parameter, with the following properties (all optional):

-   `identity`: An identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This could be an authentication token for instance. Falls back to the identifier of the identity returned by the `AuthProvider.getIdentity()` function.
-   `resource`: The resource name (e.g. `'posts'`). The hook uses the `ResourceContext` if not provided.
-   `id`: The record id (e.g. `123`). The hook uses the `RecordContext` if not provided.
-   `meta`: An object that will be forwarded to the `dataProvider.lock()` call
-   `lockMutationOptions`: `react-query` mutation options, used to customize the lock side-effects for instance
-   `unlockMutationOptions`: `react-query` mutation options, used to customize the unlock side-effects for instance

```jsx
const LockButton = ({ resource, id, identity }) => {
    const [doLock, lockMutation] = useLockOnCall({ resource, id, identity });
    return (
        <button onClick={() => doLock()} disabled={lockMutation.isLoading}>
            Lock
        </button>
    );
};
```
