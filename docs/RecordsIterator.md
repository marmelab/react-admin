---
layout: default
title: "RecordsIterator"
storybook_path: ra-core-controller-list-recordsiterator
---

# `<RecordsIterator>`

Use the `<RecordsIterator>` component to render a list of records in a custom way. Pass a `render` function to customize how each record is displayed. Pass a `data` prop to use it out of a list context.

## Usage

Use `<RecordsIterator>` inside a [`ListContext`](./useListContext.md) to render each record:

{% raw %}
```jsx
import { ListBase, RecordsIterator } from 'react-admin';

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
{% endraw %}

You can use `<RecordsIterator>` as a child of any component that provides a [`ListContext`](./useListContext.md), such as:

- [`<ReferenceManyField>`](./ReferenceManyField.md),
- [`<ReferenceArrayField>`](./ReferenceArrayField.md),
- [`<List>`](./List.md),
- [`<ListBase>`](./ListBase.md)

```jsx
import {
    ChipField,
    ShowBase,
    RecordsIterator,
    ReferenceManyField,
    RecordsIterator
} from 'react-admin';

const PostShow = () => (
    <ShowBase>
        <ReferenceManyField reference="tags" target="post_id">
            <RecordsIterator>
                <ChipField source="name" />
            </RecordsIterator>
        </ReferenceManyField>
    </ShowBase>
);
```

`<RecordsIterator>` expects that data is properly loaded, without error. If you want to handle loading, error, offline and empty states, use related props on the component providing you the list context (like [`<List loading>`](./List.md), [`<ListBase loading>`](./ListBase.md), [`<ReferenceArrayField loading>`](./ReferenceArrayField.md), [`<ReferenceManyField loading>`](./ReferenceManyField.md)). You can also make use of [`<WithListContext>`](./WithListContext.md) [`loading`](./WithListContext.md#loading), [`error`](./WithListContext.md#error), [`offline`](./WithListContext.md#offline) and [`empty`](./WithListContext.md#empty) props.

{% raw %}
```jsx
import { ListBase, RecordsIterator } from 'react-admin';

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
{% endraw %}

## Props

| Prop        | Required    | Type                              | Default | Description                                                                                          |
| ----------- |-------------|-----------------------------------| ------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | Optional`*` | `ReactNode`                       | -       | The content to render for each record                                                                |
| `data`      | Optional`*` | `RaRecord[]`                      | -       | The records. Defaults to the `data` from the [`ListContext`](./useListContext.md)                                           |
| `isPending` | Optional    | `boolean`                         | -       | A boolean indicating whether the data is pending. Defaults to the `isPending` from the [`ListContext`](./useListContext.md) |
| `render`    | Optional    | `(record: RaRecord) => ReactNode` | -       | A function that returns the content to render for each record                                        |
| `total`     | Optional    | `number`                          | -       | The total number of records. Defaults to the `total` from the [`ListContext`](./useListContext.md)                          |

`*` Either `children` or `render` is required.

## `children`

If provided, `RecordsIterator` will render the `children` prop once for each record, inside a [`RecordContext`](./useRecordContext.md).

{% raw %}
```tsx
import { RecordsIterator, useRecordContext } from 'react-admin';

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
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<RecordsIterator>` will use the `render` prop.

This is useful for advanced scenarios where you need direct access to the record data or want to implement custom layouts.

## `data`

Although `<RecordsIterator>` reads the data from the closest [`<ListContext>`](./useListContext.md), you may provide it yourself when no such context is available:

{% raw %}
```jsx
import { RecordsIterator, TextField } from 'react-admin';
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
{% endraw %}

## `isPending`

Although `<RecordsIterator>` reads the `isPending` from the closest [`<ListContext>`](./useListContext.md), you may provide it yourself when no such context is available. This is useful when dealing with data not coming from the `dataProvider`:

{% raw %}
```tsx
import { RecordsIterator } from 'react-admin';
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
{% endraw %}

## `render`

If provided, `RecordsIterator` will call the `render` prop for each record. This is useful to customize the rendered component using the record data.

{% raw %}
```tsx
import { ListBase, RecordsIterator } from 'react-admin';

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
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<RecordsIterator>` will use the `render` prop.
