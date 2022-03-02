---
layout: default
title: "useGetIdentity"
---

# `useGetIdentity`

You may want to use the current user name, avatar, or id in your code. for that purpose, call the `useGetIdentity()` hook, which calls `authProvider.getIdentity()` on mount.

Here is an example Edit component, which falls back to a Show component is the record is locked for edition by another user:

```jsx
import { useGetIdentity, useGetOne } from 'react-admin';

const PostDetail = ({ id }) => {
    const { data: post, isLoading: postLoading } = useGetOne('posts', { id });
    const { identity, loading: identityLoading } = useGetIdentity();
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
