---
layout: default
title: "useMediaQuery"
---

# `useMediaQuery`

To provide an optimized experience on mobile, tablet, and desktop devices, you often need to display different components depending on the screen size. Material UI provides a hook dedicated to help such responsive layouts: [useMediaQuery](https://mui.com/material-ui/react-use-media-query/#usemediaquery-query-options-matches).

## Usage

`useMediaQuery` expects a function receiving the Material UI theme as a parameter, and returning a media query. Use the theme breakpoints to check for common screen sizes. The hook returns a boolean indicating if the current screen matches the media query or not.

```jsx
const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
```

You can also pass a custom media query as a screen.

```jsx
const isSmall = useMediaQuery('(min-width:600px)');
```

**Tip**: Previous versions of react-admin shipped a `<Responsive>` component to do media queries. This component is now deprecated. Use `useMediaQuery` instead.

## Responsive Layouts

Here is an example for a responsive list of posts, displaying a `SimpleList` on mobile, and a `Datagrid` otherwise:

```jsx
// in src/posts.js
import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { List, SimpleList, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export const PostList = () => {
    const isSmall = useMediaQuery(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField label="User" source="userId" reference="users">
                        <TextField source="name" />
                    </ReferenceField>
                    <TextField source="title" />
                    <TextField source="body" />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
};
```

## Responsive Styles

If you need to apply different styles depending on the screen size, use [responsive values in the SX prop](./SX.md#responsive-values) instead of calling the `useMediaQuery` hook manually

{% raw %}
```jsx
<Box
  sx={{
    width: {
      xs: 100, // theme.breakpoints.up('xs')
      sm: 200, // theme.breakpoints.up('sm')
      md: 300, // theme.breakpoints.up('md')
      lg: 400, // theme.breakpoints.up('lg')
      xl: 500, // theme.breakpoints.up('xl')
    },
  }}
>
  This box has a responsive width.
</Box>
```
{% endraw %}

## Performance

To perform the server-side hydration, the hook needs to render twice. A first time with `false`, the value of the server, and a second time with the resolved value. This double pass rendering cycle comes with a drawback. It's slower. To avoid it, you can set the `noSsr` option to `true` if you are doing client-side only rendering.

```jsx
const isSmall = useMediaQuery('(min-width:600px)', { noSsr: true });
```

## TypeScript

`useMediaQuery` is generic, and can be used with a custom theme type:

```tsx
import { useMediaQuery, Theme } from '@mui/material';

const MyComponent = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    // ...
};
```