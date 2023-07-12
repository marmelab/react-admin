---
layout: default
title: "The useGetRecordRepresentation Component"
---

Returns a function that get the record representation, leveraging the [`recordRepresentation`](./Resource.md#recordrepresentation) prop of the parent `<Resource>` component.

You can also uses its component version: [`<RecordRepresentation>`](./RecordRepresentation.md).

## Usage

```tsx
// in src/posts/PostBreadcrumbs.tsx
import * as React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useGetRecordRepresentation, useRecordContext, useResourceContext } from 'react-admin';

export const PostBreadcrumbs = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/">
                    Home
                </Link>
                <Link underline="hover" color="inherit" to="/posts">
                    Posts
                </Link>
                <Typography color="text.primary">
                    {getRecordRepresentation(record)}
                </Typography>
            </Breadcrumbs>
        </div>
    );
}

// in src/posts/PostEdit.tsx
import { EditBase, EditView, SimpleForm, TextInput } from 'react-admin';
import { PostBreadcrumbs } from './PostBreadcrumbs';

const PostEdit = () => (
    <EditBase>
        <PostBreadcrumbs />
        <EditView>
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </EditView>
    </EditBase>
)
```

## Options

Here are all the options you can set on the `useGetRecordRepresentation` hook:

| Prop       | Required | Type       | Default | Description           |
| ---------- | -------- | ---------- | ------- | ----------------------|
| `resource` | Required | `string`   |         | The record's resource |

## `resource`

The record's resource.
