---
layout: default
title: "useRedirect"
---

# `useRedirect`

This hook returns a function that redirects the user to another page.

```jsx
import { useRedirect } from 'react-admin';

const DashboardButton = () => {
    const redirect = useRedirect();
    const handleClick = () => {
        redirect('/dashboard');
    }
    return <button onClick={handleClick}>Dashboard</button>;
};
```

The callback takes 5 arguments:
 - The page to redirect the user to ('list', 'create', 'edit', 'show', a function or a custom path)
 - The current `resource`
 - The `id` of the record to redirect to (if any)
 - A record-like object to be passed to the first argument, when the first argument is a function
 - A `state` to be set to the location

Here are more examples of `useRedirect` calls: 

```jsx
// redirect to the post list page
redirect('list', 'posts');
// redirect to the edit page of a post:
redirect('edit', 'posts', 1);
// redirect to the post creation page:
redirect('create', 'posts');
// redirect to the result of a function
redirect((resource, id, data) => { 
    return data.hasComments ? '/comments' : '/posts';
}, 'posts', 1, { hasComments: true });
// redirect to edit view with state data
redirect('edit', 'posts', 1, {}, { record: { post_id: record.id } });
// do not redirect (resets the record form)
redirect(false);
```

Note that `useRedirect` allows redirection to an absolute URL outside the current React app.
