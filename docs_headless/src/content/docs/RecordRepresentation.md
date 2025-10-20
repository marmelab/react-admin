---
title: "<RecordRepresentation>"
storybook_path: ra-core-controller-record-recordrepresentation--no-record-representation
---

Render the current record as text, leveraging the [`<Resource recordRepresentation>`](./Resource.md#recordrepresentation) prop.

You can also use its hook version: [`useGetRecordRepresentation`](./useGetRecordRepresentation.md).

## Usage

`<RecordRepresentation>` doesn't require any argument. It reads the current record from the parent [`RecordContext`](./useRecordContext.md) and the current resource from the parent `ResourceContext`.

The component uses the [`useGetRecordRepresentation`](./useGetRecordRepresentation.md) hook and the same [rules](./useGetRecordRepresentation.md#default-representation) are therefore applied.

```tsx
// in src/posts/PostBreadcrumbs.tsx
import * as React from 'react';
import { Link } from 'react-router-dom';
import { RecordRepresentation } from 'ra-core';

export const PostBreadcrumbs = () => {
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
                    <RecordRepresentation />
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

## Props

Here are all the props you can set on the `<RecordRepresentation>` component:

| Prop       | Required | Type       | Default                                    | Description           |
| ---------- | -------- | ---------- | ------------------------------------------ | ----------------------|
| `record`   | Optional | `RaRecord` | Record from the parent `RecordContext`     | The record to display |
| `resource` | Optional | `string`   | Resource from the parent `ResourceContext` | The record's resource |

## `record`

The record to display. Defaults to the record from the parent `RecordContext`.

```tsx
<RecordRepresentation record={record} />
```

## `resource`

The record's resource. Defaults to the resource from the parent `ResourceContext`.

```tsx
<RecordRepresentation resource="posts" />
```
