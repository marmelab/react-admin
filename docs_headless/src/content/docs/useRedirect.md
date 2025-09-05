---
title: "useRedirect"
---

This hook returns a function that redirects the user to another page.

## Usage

```jsx
import { useRedirect } from 'ra-core';

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
// redirect to edit view with state data
redirect('edit', 'posts', 1, {}, { record: { post_id: record.id } });
```

Note that `useRedirect` allows redirection to an absolute URL outside the current React app.

**Tip:** For even more specific navigation, you can use the [`useNavigate`](https://reactrouter.com/en/main/hooks/use-navigate) hook from `react-router-dom` as follows:

```jsx
import { useNavigate } from 'react-router-dom';

const MyPageButton = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(
            {
                pathname: '/some/path',
                search: '?query=string',
                hash: '#hash',
            },
            {
                state: { key: 'value' },
            }
        );
    }
    return <button onClick={handleClick}>My page</button>;
};
```

## Redirect function

`useRedirect` allows you to redirect to the result of a function as follows:

```jsx
redirect((resource, id, data) => { 
    return data.hasComments ? '/comments' : '/posts';
}, 'posts', 1, { hasComments: true });
```

Your function can also return an object containing a `pathname` and optionally some keys of [a `NavigateOptions` object](https://api.reactrouter.com/dev/interfaces/react_router.NavigateOptions.html).

```jsx
redirect((resource, id, data) => { 
    return {
        pathname: `/${resource}/1`,
        state: { record: { id: 1, foo: 'bar' } },
        flushSync: true,
        preventScrollReset: true,
        replace: false,
        viewTransition: true,
    };
});
```

## Disable Scroll To Top

By default, ra-core scrolls to top on each redirection. You can disable it by passing a `_scrollToTop: false` option in the 5th argument:

```jsx
redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
    _scrollToTop: false,
});
```

## Reset the record form

`useRedirect` resets the record form, so you can use the `redirect` function to reset it without redirecting as follows:

```jsx
// do not redirect (resets the record form)
redirect(false);
```
