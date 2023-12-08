---
layout: default
title: "useGetIdentity"
---

# `useGetIdentity`

React-admin calls `authProvider.getIdentity()` to retrieve and display the current logged-in username and avatar. The logic for calling this method is packaged into a custom hook, `useGetIdentity`, which you can use in your own code.

![identity](./img/identity.png)

## Syntax

`useGetIdentity()` calls `authProvider.getIdentity()` on mount. It returns an object containing the loading state, the error state, and the identity.

```jsx
const { data, isPending, error } = useGetIdentity();
```

Once loaded, the `data` object contains the following properties:

```jsx
const { id, fullName, avatar } = data;
```

`useGetIdentity` uses [react-query's `useQuery` hook](https://tanstack.com/query/v5/docs/react/reference/useQuery) to call the `authProvider`.

## Usage

Here is an example Edit component, which falls back to a Show component if the record is locked for edition by another user:

```jsx
import { useGetIdentity, useGetOne } from 'react-admin';

const PostDetail = ({ id }) => {
    const { data: post, isPending: isPendingPost } = useGetOne('posts', { id });
    const { data: identity, isPending: isPendingIdentity } = useGetIdentity();
    if (isPendingPost || isPendingIdentity) return <>Loading...</>;
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

If your application contains a form letting the current user update their name and/or avatar, you may want to refresh the identity after the form is submitted. As `useGetIdentity` uses [react-query's `useQuery` hook](https://tanstack.com/query/v5/docs/react/reference/useQuery) to call the `authProvider`, you can take advantage of the `refetch` function to do so:

```jsx
const IdentityForm = () => {
    const { isPending, error, data, refetch } = useGetIdentity();
    const [newIdentity, setNewIdentity] = useState('');
    
    if (isPending) return <>Loading</>;
    if (error) return <>Error</>;

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
            // call authProvider.getIdentity() again and notify the listeners of the result,
            // including the UserMenu in the AppBar
            refetch();
         });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input defaultValue={data.fullName} onChange={handleChange} />
            <input type="submit" value="Save" />
        </form>
    );
};
```