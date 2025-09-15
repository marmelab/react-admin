---
title: "<ListIterator>"
---

## Usage

Use the `<ListIterator>` component to render a list of records in a custom way. Pass a `render` function to customize how each record is displayed.

```jsx
import { ListBase, ListIterator } from 'ra-core';

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

You can use `<ListIterator>` as a child of any component that provides a [`ListContext`](./useListContext.md), such as:

- [`<ListBase>`](./ListBase.md)
- [`<InfiniteListBase>`](./InfiniteListBase.md)
- [`<ReferenceArrayFieldBase>`](./ReferenceArrayFieldBase.md)

**Tip**: Since this is the headless version, you have full control over how to render lists. `<ListIterator>` is a low-level component that helps you iterate over records while respecting the loading and error states from the `ListContext`.

## Props

Here are all the props you can set on the `<ListIterator>` component:

| Prop        | Required | Type                              | Default | Description                                                                                          |
| ----------- | -------- | --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | Optional | `ReactNode`                       | -       | The content to render for each record                                                                |
| `data`      | Optional | `RaRecord[]`                      | -       | The records. Defaults to the `data` from the `ListContext`                                           |
| `empty`     | Optional | `ReactNode`                       | `null`  | The content to display when there is no data                                                         |
| `error`     | Optional | `ReactNode`                       | `null`  | The content to display when the data fetching fails                                                  |
| `isPending` | Optional | `boolean`                         | -       | A boolean indicating whether the data is pending. Defaults to the `isPending` from the `ListContext` |
| `loading`   | Optional | `ReactNode`                       | `null`  | The content to display while the data is loading                                                     |
| `render`    | Optional | `(record: RaRecord) => ReactNode` | -       | A function that returns the content to render for each record                                        |
| `total`     | Optional | `number`                          | -       | The total number of records. Defaults to the `total` from the `ListContext`                          |

Additional props are passed to `react-hook-form`'s [`useForm` hook](https://react-hook-form.com/docs/useform).

## `children`

If provided, `ListIterator` will render the `children` prop once for each record, inside a [`RecordContext`](./useRecordContext.md).

```tsx
import { ListIterator, useRecordContext } from 'ra-core';

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

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `data`

Although `<ListIterator>` reads the data from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

```jsx
import { ListIterator } from 'ra-core';
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

## `empty`

To provide a custom UI when there is no data, use the `empty` prop.

```jsx
import { ListBase, ListIterator } from 'ra-core';

const PostList = () => (
    <ul>
        <ListIterator
            empty={<li>No posts found</li>}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```

## `error`

To provide a custom UI when the data fetching fails, use the `error` prop.

```jsx
import { ListIterator } from 'ra-core';

const PostList = () => (
    <ul>
        <ListIterator
            error={<li>Error loading posts</li>}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```

## `isPending`

Although `<ListIterator>` reads the `isPending` from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available. This is useful when dealing with data not coming from the `dataProvider`:

```tsx
import { ListIterator } from 'ra-core';
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


## `loading`

To provide a custom UI while the data is loading, use the `loading` prop.

```jsx
import { ListIterator } from 'ra-core';

const PostList = () => (
    <ul>
        <ListIterator
            loading={<li>Loading posts...</li>}
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```

## `render`

If provided, `ListIterator` will call the `render` prop for each record. This is useful when the components you render need the record data to render themselves, or when you want to pass additional props to the rendered component.

```tsx
import { ListIterator } from 'ra-core';

const PostList = () => (
    <ul>
        <ListIterator
            render={record => <li>{record.title} - {record.views}</li>}
        />
    </ul>
);
```

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `total`

Although `<ListIterator>` reads the total from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

```jsx
import { ListIterator } from 'ra-core';
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

