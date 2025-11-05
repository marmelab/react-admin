---
title: "<RecordsIterator>"
storybook_path: ra-core-controller-list-recordsiterator
---

Use the `<RecordsIterator>` component to render a list of records in a custom way. Pass a `render` function to customize how each record is displayed. Pass a `data` prop to use it out of a list context.

## Usage

Use `<RecordsIterator>` inside a [`ListContext`](./useListContext.md) to render each record:

```jsx
import { ListBase, RecordsIterator } from 'ra-core';

const MostVisitedPosts = () => (
    <ListBase
        resource="posts"
        sort={{ field: 'views', order: 'DESC' }}
        perPage={20}
    >
        <ul>
            <RecordsIterator
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    </ListBase>
);
```

You can use `<RecordsIterator>` as a child of any component that provides a [`ListContext`](./useListContext.md), such as:

- [`<ReferenceManyFieldBase>`](./ReferenceManyFieldBase.md),
- [`<ReferenceArrayFieldBase>`](./ReferenceArrayField.md),
- [`<ListBase>`](./ListBase.md)

```jsx
import { ShowBase, RecordsIterator, ReferenceManyFieldBase } from 'ra-core';

const PostShow = () => (
    <ShowBase>
        <ReferenceManyFieldBase reference="tags" target="post_id">
            <ul>
                <RecordsIterator
                    render={tag => <li>#{tag.name}</li>}
                />
            </ul>
        </ReferenceManyFieldBase>
    </ShowBase>
);
```

`<RecordsIterator>` expects that data is properly loaded, without error. If you want to handle loading, error, offline and empty states, use properties on the component providing you the list context (like [`<ListBase loading>`](./ListBase.md), [`<ReferenceArrayFieldBase loading>`](./ReferenceArrayFieldBase.md), [`<ReferenceManyFieldBase loading>`](./ReferenceManyFieldBase.md)). You can also make use of [`<WithListContext>`](./WithListContext.md) [`loading`](./WithListContext.md#loading), [`error`](./WithListContext.md#error), [`offline`](./WithListContext.md#offline) and [`empty`](./WithListContext.md#empty) props.

```jsx
import { ListBase, RecordsIterator } from 'ra-core';

const MostVisitedPosts = () => (
    <ListBase
        resource="posts"
        sort={{ field: 'views', order: 'DESC' }}
        perPage={20}
        loading={<p>Loading...</p>}
        error={<p>Something went wrong</p>}
        offline={<p>You are offline</p>}
    >
        <ul>
            <RecordsIterator
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    </ListBase>
);
```

## Props

| Prop        | Required    | Type                              | Default | Description                                                                                          |
| ----------- |-------------|-----------------------------------| ------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | Optional`*` | `ReactNode`                       | -       | The content to render for each record                                                                |
| `data`      | Optional    | `RaRecord[]`                      | -       | The records. Defaults to the `data` from the [`ListContext`](./useListContext.md)                                           |
| `isPending` | Optional    | `boolean`                         | -       | A boolean indicating whether the data is pending. Defaults to the `isPending` from the [`ListContext`](./useListContext.md) |
| `render`    | Optional`*` | `(record: RaRecord) => ReactNode` | -       | A function that returns the content to render for each record                                        |
| `total`     | Optional    | `number`                          | -       | The total number of records. Defaults to the `total` from the [`ListContext`](./useListContext.md)                          |

`*` Either `children` or `render` is required.

## `children`

If provided, `RecordsIterator` will render the `children` prop once for each record, inside a [`RecordContext`](./useRecordContext.md).

```tsx
import { RecordsIterator, useRecordContext } from 'ra-core';

const PostList = () => (
    <ul>
        <RecordsIterator>
            <PostItem />
        </RecordsIterator>
    </ul>
);

const PostItem = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <li>{record.title} - {record.views}</li>;
};
```

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<RecordsIterator>` will use the `render` prop.

This is useful for advanced scenarios where you need direct access to the record data or want to implement custom layouts.

## `data`

Although `<RecordsIterator>` reads the data from the closest [`<ListContext>`](./useListContext.md), you may provide it yourself when no such context is available:

```jsx
import { RecordsIterator, TextField } from 'ra-core';
import { customerSegments } from './customerSegments.json';

const PostList = () => (
    <ul>
        <RecordsIterator
            data={customerSegments}
            total={customerSegments.length}
        >
            <li>
                <TextField source="name" />
            </li>
        </RecordsIterator>
    </ul>
);
```

## `isPending`

Although `<RecordsIterator>` reads the `isPending` from the closest [`<ListContext>`](./useListContext.md), you may provide it yourself when no such context is available. This is useful when dealing with data not coming from the `dataProvider`:

```tsx
import { RecordsIterator } from 'ra-core';
import { useQuery } from '@tanstack/react-query';
import { fetchPostAnalytics } from './fetchPostAnalytics';

const DashboardMostVisitedPosts = () => {
    const { data, isPending } = useQuery({
        queryKey: ['dashboard', 'posts'],
        queryFn: fetchPostAnalytics
    });

    return (
        <ul>
            <RecordsIterator
                data={data}
                isPending={isPending}
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    );
}
```

## `render`

If provided, `RecordsIterator` will call the `render` prop for each record. This is useful to customize the rendered component using the record data.

```tsx
import { ListBase, RecordsIterator } from 'ra-core';

const PostList = () => (
    <ListBase resource="posts">
        <ul>
            <RecordsIterator
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    </ListBase>
);
```

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<RecordsIterator>` will use the `render` prop.
