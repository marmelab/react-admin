---
layout: default
title: "useGetIdentity"
---

# `useGetIdentity`

You may want to use the current user name, avatar, or id in your code. for that purpose, call the `useGetIdentity()` hook, which calls `authProvider.getIdentity()` on mount. It returns an object containing the loading state, the error state, and the identity.

## Syntax

```jsx
const { identity, isLoading, error } = useGetIdentity();
```

Once loaded, the `identity` object contains the following properties:

```jsx
const { id, fullName, avatar } = identity;
```

## Usage

Here is an example Edit component, which falls back to a Show component if the record is locked for edition by another user:

```jsx
import { useGetIdentity, useGetOne } from 'react-admin';

const PostDetail = ({ id }) => {
    const { data: post, isLoading: postLoading } = useGetOne('posts', { id });
    const { identity, isLoading: identityLoading } = useGetIdentity();
    if (postLoading || identityLoading) return <>Loading...</>;
    if (!post.lockedBy || post.lockedBy === identity.id) {
        // post isn't locked, or is locked by me
        return <PostEdit post={post} />
    } else {
        // post is locked by someone else and cannot be edited
        return <PostShow post={post} />
    }
}
```

## Refreshing The Identity

If your application contains a form letting the current user update their name and/or avatar, you may want to refresh the identity after the form is submitted. To do so, you should invalidate the react-query query cache for the `['auth', 'getIdentity']` key:

```jsx
const IdentityForm = () => {
    const { isLoading, error, identity } = useGetIdentity();
    const [newIdentity, setNewIdentity] = useState('');
    const queryClient = useQueryClient();

    const handleChange = event => {
        setNewIdentity(event.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newIdentity) return;
        fetch('/update_identity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: newIdentity })
        }).then(() => { 
            // invalidate the react-query query cache for the useGetIdentity call
            queryClient.invalidateQueries(['auth', 'getIdentity']);
         });
    };
    
    if (isLoading) return <>Loading</>;
    if (error) return <>Error</>;
    
    return (
        <form onSubmit={handleSubmit}>
            <input defaultValue={identity.fullName} onChange={handleChange} />
            <input type="submit" value="Save" />
        </form>
    );
};
```