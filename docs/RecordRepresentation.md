---
layout: default
title: "The RecordRepresentation Component"
---

Render the record representation, leveraging the [`recordRepresentation`](./Resource.md#recordrepresentation) prop of the parent `<Resource>` component.

You can also uses its hook version: [`<useGetRecordRepresentation>`](./useGetRecordRepresentation.md).

## Usage

```tsx
// in src/posts/PostBreadcrumbs.tsx
import * as React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, RecordRepresentation } from 'react-admin';

export const PostBreadcrumbs = () => {
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
                    <RecordRepresentation />
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

## Props

Here are all the props you can set on the `<RecordRepresentation>` component:

| Prop       | Required | Type       | Default                                    | Description           |
| ---------- | -------- | ---------- | ------------------------------------------ | ----------------------|
| `record`   | Optional | `RaRecord` | Record from the parent `RecordContext`     | The record to display |
| `resource` | Optional | `string`   | Resource from the parent `ResourceContext` | The record's resource |

## `record`

The record to display. Defaults to the record from the parent `RecordContext`.

## `resource`

The record's resource. Defaults to the resource from the parent `ResourceContext`.
