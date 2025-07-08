---
layout: default
title: "ListIterator"
storybook_path: react-admin-admin--basic
---

# `<ListIterator>`

## Usage

Use the `<ListIterator>` component as a child of any component that provides a [`ListContext`](./useListContext.md):

- `<List>`,
- `<ListGuesser>`,
- `<ListBase>`,
- `<ReferenceArrayField>`,
- `<ReferenceManyField>`

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    </ListBase>
);
```
{% endraw %}

## Props

Here are all the props you can set on the `<AccordionForm>` component:

| Prop        | Required | Type                               | Default | Description                                                                                          |
| ----------- | -------- | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `children`  | Optional | `ReactNode`                        | -       | The content to render for each record                                                                |
| `data`      | Optional | `RaRecord[]`                       | -       | The records. Defaults to the `data` from the `ListContext`                                           |
| `empty`     | Optional | `ReactNode`                        | `null`  | The content to display when there is no data                                                         |
| `isPending` | Optional | `boolean`                          | -       | A boolean indicating whether the data is pending. Defaults to the `isPending` from the `ListContext` |
| `pending`   | Optional | `ReactNode`                        | `null`  | The content to display while the data is loading                                                     |
| `render`    | Optional | `(record: RaRecord) => ReactNode`  | -       | A function that returns the content to render for each record                                        |
| `resource`  | Optional | `string`                           | -       | The resource. Defaults to the `ResourceContext`                                                      |
| `total`     | Optional | `number`                           | -       | The total number of records. Defaults to the `total` from the `ListContext`                          |

Additional props are passed to `react-hook-form`'s [`useForm` hook](https://react-hook-form.com/docs/useform).

## `children`

If provided, `ListIterator` will render the `children` prop for each record. This is useful when the components you render leverages the [`RecordContext`](./useRecordContext.md):

{% raw %}
```tsx
import { ListBase, ListIterator, useRecordContext } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator>
                <PostItem />
            </ListIterator>
        </OrderedList>
    </ListBase>
);

const PostItem = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <ListItem>{record.title} - {record.views}</ListItem>
    );
};
```
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `data`

Although `<ListIterator>` reads the data from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

{% raw %}
```jsx
import { ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';
import { customerSegments } from './customerSegments.json';

const MyComponent = () => {
    return (
        <OrderedList>
            <ListIterator
                data={customerSegments}
                total={customerSegments.length}
                render={record => <ListItem>{record.name}</ListItem>}
            />
        </OrderedList>
    );
}
```
{% endraw %}

## `empty`

To provide a custom UI when there is no data, use the `empty` prop.

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator
                empty={<ListItem>No posts found</ListItem>}
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    </ListBase>
);
```
{% endraw %}

## `isPending`

Although `<ListIterator>` reads the `isPending` from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available. This is useful when dealing with data not coming from the `dataProvider`:

{% raw %}
```tsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';
import { useQuery } from '@tanstack/react-query';
import { fetchPostAnalytics } from './fetchPostAnalytics';

const DashboardMostVisitedPosts = () => {
    const { data, isPending } = useQuery({
        queryKey: ['dashboard', 'posts'],
        queryFn: fetchPostAnalytics
    });

    return (
        <OrderedList>
            <ListIterator
                isPending={isPending}
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    );
}
```
{% endraw %}


## `pending`

To provide a custom UI while the data is loading use the `pending` prop.

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem, Skeleton } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator
                pending={<Skeleton />}
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    </ListBase>
);
```
{% endraw %}

## `render`

If provided, `ListIterator` will call the `render` prop for each record. This is useful when the components you render don't leverage the [`RecordContext`](./useRecordContext.md):

{% raw %}
```tsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    </ListBase>
);
```
{% endraw %}

**Note**: You can't provide both the `children` and the `render` props. If both are provided, `<ListIterator>` will use the `render` prop.

## `resource`

Although `<ListIterator>` reads the resource from the closest [`<ResourceContext>`](./Resource.md#resource-context), you may provide it yourself when no such context is available (e.g. in a [dashboard](./Admin.md#dashboard) or a [custom page](./Admin.md#adding-custom-pages)):

{% raw %}
```jsx
import { ListBase, ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';

const DashboardMostVisitedPosts = () => (
    <ListBase resource="posts" sort={{ field: 'views', order: 'DESC' }} page={1} perPage={20}>
        <OrderedList>
            <ListIterator
                render={record => <ListItem>{record.title} - {record.views}</ListItem>}
            />
        </OrderedList>
    </ListBase>
);
```
{% endraw %}

## `total`

Although `<ListIterator>` reads the total from the closest [`<ListContext>`](./useListContext), you may provide it yourself when no such context is available:

{% raw %}
```jsx
import { ListIterator } from 'react-admin';
import { OrderedList, ListItem } from 'my-favorite-ui-lib';
import { customerSegments } from './customerSegments.json';

const MyComponent = () => {
    return (
        <OrderedList>
            <ListIterator
                data={customerSegments}
                total={customerSegments.length}
                render={record => <ListItem>{record.name}</ListItem>}
            />
        </OrderedList>
    );
}
```
{% endraw %}

