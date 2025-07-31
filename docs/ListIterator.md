---
layout: default
title: "ListIterator"
storybook_path: ra-core-controller-list-listiterator--using-render
---

# `<ListIterator>`

## Usage

Use the `<ListIterator>` component to render a list of records in a custom way. Pass a `render` function to customize how each record is displayed.

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';

const MostVisitedPosts = () => (
    <ListBase
        resource="posts"
        sort={{ field: 'views', order: 'DESC' }}
        perPage={20}
    >
        <ul>
            <ListIterator
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    </ListBase>
);
```
{% endraw %}

You can use `<ListIterator>` as a child of any component that provides a [`ListContext`](./useListContext.md), such as:

- [`<List>`](./List.md),
- [`<ListGuesser>`](./ListGuesser.md),
- [`<ListBase>`](./ListBase.md),
- [`<ReferenceArrayField>`](./ReferenceArrayField.md),
- [`<ReferenceManyField>`](./ReferenceManyField.md)

**Tip**: React-admin provides several list components that use `<ListIterator>` internally, that you should prefer if you want to render a list of records in a standard way:

- [`<DataTable>`](./DataTable.md) renders a list of records in a table format.
- [`<SimpleList>`](./SimpleList.md) renders a list of records in a simple format, suitable for mobile devices.
- [`<SingleFieldList>`](./SingleFieldList.md) renders a list of records with a single field.

## Props

Here are all the props you can set on the `<ListIterator>` component:

| Prop        | Required | Type                               | Default | Description                                                                                          |
| ----------- | -------- | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | Optional | `ReactNode`                        | -       | The content to render for each record                                                                |
| `data`      | Optional | `RaRecord[]`                       | -       | The records. Defaults to the `data` from the `ListContext`                                           |
| `empty`     | Optional | `ReactNode`                        | `null`  | The content to display when there is no data                                                         |
| `error`     | Optional | `ReactNode`                        | `null`  | The content to display when the data fetching fails                                                   |
| `isPending` | Optional | `boolean`                          | -       | A boolean indicating whether the data is pending. Defaults to the `isPending` from the `ListContext` |
| `loading`   | Optional | `ReactNode`                        | `null`  | The content to display while the data is loading                                                     |
| `render`    | Optional | `(record: RaRecord) => ReactNode`  | -       | A function that returns the content to render for each record                                        |
| `total`     | Optional | `number`                           | -       | The total number of records. Defaults to the `total` from the `ListContext`                          |

Additional props are passed to `react-hook-form`'s [`useForm` hook](https://react-hook-form.com/docs/useform).

## `children`

If provided, `ListIterator` will render the `children` prop once for each record, inside a [`RecordContext`](./useRecordContext.md).

{% raw %}
```tsx
import { ListIterator, useRecordContext } from 'react-admin';

const PostList = () => (
    <ul>
        <ListIterator>
            <PostItem />
        </ListIterator>
    </ul>
);

const PostItem = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <li>{record.title} - {record.views}</li>;
};
```
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `data`

Although `<ListIterator>` reads the data from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

{% raw %}
```jsx
import { ListIterator } from 'react-admin';
import { customerSegments } from './customerSegments.json';

const PostList = () => (
    <ul>
        <ListIterator
            data={customerSegments}
            total={customerSegments.length}
            render={record => <li>{record.name}</li>}
        />
    </ul>
);
```
{% endraw %}

## `empty`

To provide a custom UI when there is no data, use the `empty` prop.

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';

const PostList = () => (
    <ul>
        <ListIterator
            empty={<li>No posts found</li>}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```
{% endraw %}

## `error`

To provide a custom UI when the data fetching fails, use the `error` prop.

{% raw %}
```jsx
import { ListIterator } from 'react-admin';

const PostList = () => (
    <ul>
        <ListIterator
            error={<li>Error loading posts</li>}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```
{% endraw %}

## `isPending`

Although `<ListIterator>` reads the `isPending` from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available. This is useful when dealing with data not coming from the `dataProvider`:

{% raw %}
```tsx
import { ListIterator } from 'react-admin';
import { useQuery } from '@tanstack/react-query';
import { fetchPostAnalytics } from './fetchPostAnalytics';

const DashboardMostVisitedPosts = () => {
    const { data, isPending } = useQuery({
        queryKey: ['dashboard', 'posts'],
        queryFn: fetchPostAnalytics
    });

    return (
        <ul>
            <ListIterator
                data={data}
                isPending={isPending}
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
    );
}
```
{% endraw %}


## `loading`

To provide a custom UI while the data is loading, use the `loading` prop.

{% raw %}
```jsx
import { ListIterator } from 'react-admin';
import { Skeleton } from 'my-favorite-ui-lib';

const PostList = () => (
    <ul>
        <ListIterator
            loading={<Skeleton />}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```
{% endraw %}

## `render`

If provided, `ListIterator` will call the `render` prop for each record. This is useful when the components you render need the record data to render themselves, or when you want to pass additional props to the rendered component.

{% raw %}
```tsx
import { ListBase, ListIterator } from 'react-admin';

const PostList = () => (
    <ul>
        <ListIterator
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `total`

Although `<ListIterator>` reads the total from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

{% raw %}
```jsx
import { ListIterator } from 'react-admin';
import { customerSegments } from './customerSegments.json';

const PostList = () => (
    <ul>
        <ListIterator
            data={customerSegments}
            total={customerSegments.length}
            render={record => <li>{record.name}</li>}
        />
    </ul>
);
```
{% endraw %}

