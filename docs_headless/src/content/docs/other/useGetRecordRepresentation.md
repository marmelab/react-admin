---
title: "useGetRecordRepresentation"
---

Get a function that returns the record representation, leveraging the [`<Record recordRepresentation>`](../app-configuration/Resource.md#recordrepresentation) prop.

You can also use the component version: [`<RecordRepresentation>`](./RecordRepresentation.md).

## Usage

```tsx
// in src/posts/PostBreadcrumbs.tsx
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGetRecordRepresentation, useRecordContext } from 'ra-core';

export const PostBreadcrumbs = () => {
    const record = useRecordContext();
    const getRecordRepresentation = useGetRecordRepresentation('posts');
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/posts">Posts</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    {getRecordRepresentation(record)}
                </li>
            </ol>
        </nav>
    );
}

// in src/posts/PostEdit.tsx
import { EditBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { PostBreadcrumbs } from './PostBreadcrumbs';

const PostEdit = () => (
    <EditBase>
        <PostBreadcrumbs />
        <div>
            <Form>
                <TextInput source="title" />
            </Form>
        </div>
    </EditBase>
)
```

## Default Representation

When [`<Resource recordRepresentation>`](../app-configuration/Resource.md#recordrepresentation) is not defined, `useGetRecordRepresentation` will return the first non-empty field from this list:  
1. `name`
2. `title`
3. `label`
4. `reference`
5. `id`



## Options

Here are all the options you can set on the `useGetRecordRepresentation` hook:

| Prop       | Required | Type       | Default | Description           |
| ---------- | -------- | ---------- | ------- | ----------------------|
| `resource` | Required | `string`   |         | The record's resource |

## `resource`

The record's resource.
