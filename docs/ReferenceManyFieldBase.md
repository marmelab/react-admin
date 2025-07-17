---
layout: default
title: "The ReferenceManyFieldBase Component"
storybook_path: ra-ui-materialui-fields-referencemanyfieldbase--basic
---

# `<ReferenceManyFieldBase>`

`<ReferenceManyFieldBase>` is useful for displaying a list of related records via a one-to-many relationship, when the foreign key is carried by the referenced resource. 

This component fetches a list of referenced records by a reverse lookup of the current `record.id` in the `target` field of another resource (using the `dataProvider.getManyReference()` REST method), and puts them in a [`ListContext`](./useListContext.md). This component is headless, and its children need to use the data from this context to render the desired ui.
For a component handling the UI too use [the `<ReferenceManyField>` component](./ReferenceManyField.md) instead.

**Tip**: If the relationship is materialized by an array of ids in the initial record, use [the `<ReferenceArrayFieldBase>` component](./ReferenceArrayFieldBase.md) instead.

## Usage

### With children

For instance, if an `author` has many `books`, and each book resource exposes an `author_id` field:

```
┌────────────────┐       ┌──────────────┐
│ authors        │       │ books        │
│----------------│       │--------------│
│ id             │───┐   │ id           │
│ first_name     │   └──╼│ author_id    │
│ last_name      │       │ title        │
│ date_of_birth  │       │ published_at │
└────────────────┘       └──────────────┘
```

`<ReferenceManyFieldBase>` can render the titles of all the books by a given author.

```jsx
import { Show, SimpleShowLayout, ReferenceManyFieldBase, DataTable, TextField, DateField } from 'react-admin';

const BookList = ({
    source,
    children,
}: {
    source: string;
}) => {
    const context = useListContext();

    if (context.isPending) {
        return <p>Loading...</p>;
    }

    if (context.error) {
        return <p className="error">{context.error.toString()}</p>;
    }
    return (
        <p>
            {listContext.data?.map((book, index) => (
                <li key={index}>{book[source]}</li>
            ))}
        </p>
    );
};

const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceManyFieldBase reference="books" target="author_id" >
              <BookList source="title" />
            </ReferenceManyFieldBase>
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceManyFieldBase>` accepts a `reference` attribute, which specifies the resource to fetch for the related record. It also accepts a `source` attribute which defines the field containing the value to look for in the `target` field of the referenced resource. By default, this is the `id` of the resource (`authors.id` in the previous example).

You can also use `<ReferenceManyFieldBase>` in a list, e.g. to display the authors of the comments related to each post in a list by matching `post.id` to `comment.post_id`:

```jsx
import { List, DataTable, ChipField, ReferenceManyFieldBase, SingleFieldList } from 'react-admin';

export const PostList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col label="Comments by">
                <ReferenceManyFieldBase reference="comments" target="post_id">
                    <CustomAuthorView source="name"/>
                </ReferenceManyFieldBase>
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);
```

## Props

| Prop           | Required | Type                                                                              | Default                          | Description                                                                         |
| -------------- | -------- | --------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `children`     | Optional | `Element`                                                                         | -                                | One or several elements that render a list of records based on a `ListContext`      |
| `render`     | Optional\* | `(ListContext) => Element`                                                                         | -                                | Function that receives a `ListContext` and render elements      |
| `debounce`     | Optional\* | `number`                                                                          | 500                              | debounce time in ms for the `setFilters` callbacks                                  |
| `empty`        | Optional | `ReactNode`                                                                       | -                                | Element to display when there are no related records.                                |
| `filter`       | Optional | `Object`                                                                          | -                                | Filters to use when fetching the related records, passed to `getManyReference()`    |
| `perPage`      | Optional | `number`                                                                          | 25                               | Maximum number of referenced records to fetch                                       |
| `queryOptions` | Optional | [`UseQuery Options`](https://tanstack.com/query/v3/docs/react/reference/useQuery) | `{}`                             | `react-query` options for the `getMany` query                                       |
| `reference`    | Required | `string`                                                                          | -                                | The name of the resource for the referenced records, e.g. 'books'                   |
| `sort`         | Optional | `{ field, order }`                                                                | `{ field: 'id', order: 'DESC' }` | Sort order to use when fetching the related records, passed to `getManyReference()` |
| `source`       | Optional | `string`                                                                          | `id`                             | Target field carrying the relationship on the source record (usually 'id')          |
| `storeKey`     | Optional | `string`                                                                          | -                                | The key to use to store the records selection state                                 |
| `target`       | Required | `string`                                                                          | -                                | Target field carrying the relationship on the referenced resource, e.g. 'user_id'   |

\* Either one of children or render is required.

## `children`

`<ReferenceManyFieldBase>` renders its children inside a [`ListContext`](./useListContext.md). This means you can use any component that uses a `ListContext`:

- [`<SingleFieldList>`](./SingleFieldList.md)
- [`<DataTable>`](./DataTable.md)
- [`<Datagrid>`](./Datagrid.md)
- [`<SimpleList>`](./SimpleList.md)
- [`<EditableDatagrid>`](./EditableDatagrid.md)
- [`<Calendar>`](./Calendar.md)

For instance, use a `<DataTable>` to render the related records in a table:

```jsx
import { Show, SimpleShowLayout, TextField, ReferenceManyFieldBase, DataTable, DateField } from 'react-admin';

export const AuthorShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <DateField label="Born" source="dob" />
      <ReferenceManyFieldBase label="Books" reference="books" target="author_id">
        <DataTable>
          <DataTable.Col source="title" />
          <DataTable.Col source="published_at" field={DateField} />
        </DataTable>
      </ReferenceManyFieldBase>
    </SimpleShowLayout>
  </Show>
);
```

## `render`

Alternatively, you can pass a `render` function prop instead of children. The `render` prop will receive the `ListContext` as arguments, allowing to inline the render logic.
When receiving a `render` function prop the `<ReferenceManyFieldBase>` component will ignore the children property.

```jsx
import { Show, SimpleShowLayout, ReferenceManyFieldBase, DataTable, TextField, DateField } from 'react-admin';

const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceManyFieldBase
                reference="books"
                target="author_id"
                render={
                    ({ isPending, error, data }) => {

                        if (isPending) {
                            return <p>Loading...</p>;
                        }

                        if (error) {
                            return <p className="error">{error.toString()}</p>;
                        }
                        return (
                            <p>
                                {data.map((author, index) => (
                                    <li key={index}>{author.name}</li>
                                ))}
                            </p>
                        );
                    }
                }
            />
        </SimpleShowLayout>
    </Show>
);
```

## `debounce`

By default, `<ReferenceManyFieldBase>` does not refresh the data as soon as the user enters data in the filter form. Instead, it waits for half a second of user inactivity (via `lodash.debounce`) before calling the `dataProvider` on filter change. This is to prevent repeated (and useless) calls to the API.

You can customize the debounce duration in milliseconds - or disable it completely - by passing a `debounce` prop to the `<ReferenceManyFieldBase>` component:

```jsx
// wait 1 seconds instead of 500 milliseconds before calling the dataProvider
const PostCommentsField = () => (
    <ReferenceManyFieldBase debounce={1000}>
        ...
    </ReferenceManyFieldBase>
);
```

## `empty`

Use `empty` to customize the text displayed when the related record is empty.

```jsx
<ReferenceManyFieldBase
  reference="books"
  target="author_id"
  empty="no books"
>
    ...
</ReferenceManyFieldBase>
```

`empty` also accepts a translation key.

```jsx
<ReferenceManyFieldBase
  reference="books"
  target="author_id"
  empty="resources.authors.fields.books.empty"
>
    ...
</ReferenceManyFieldBase>
```

`empty` also accepts a `ReactNode`.

```jsx
<ReferenceManyFieldBase
  reference="books"
  target="author_id"
    empty={<CreateButton resource="books" />}
>
    ...
</ReferenceManyFieldBase>
```

## `filter`: Permanent Filter

You can filter the query used to populate the possible values. Use the `filter` prop for that.

{% raw %}

```jsx
<ReferenceManyFieldBase
  reference="comments"
  target="post_id"
  filter={{ is_published: true }}
>
   ...
</ReferenceManyFieldBase>
```

{% endraw %}

## Filtering The References

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceManyFieldBaseFilterInput.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

You can add filters to `<ReferenceManyFieldBase>` by adding [`<FilterForm>`](./FilterForm.md) and [`<FilterButton>`](./FilterButton.md):

{% raw %}

```jsx
const filters = [<TextInput source="q" label="Search" />];

const AuthorEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceManyFieldBase reference="comments" target="post_id">
          <FilterButton filters={filters}/>
          <FilterForm filters={filters}/>
          <DataTable>
              ...
          </DataTable>
      </ReferenceManyFieldBase>
    </SimpleForm>
  </Edit>
);
```

{% endraw %}

## `perPage`

By default, react-admin restricts the possible values to 25 and displays no pagination control. You can change the limit by setting the `perPage` prop:

```jsx
<ReferenceManyFieldBase perPage={10} reference="comments" target="post_id">
   ...
</ReferenceManyFieldBase>
```

## `queryOptions`

Use the `queryOptions` prop to pass options to [the `dataProvider.getMany()` query](./useGetOne.md#aggregating-getone-calls) that fetches the referenced record.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceManyFieldBase queryOptions={{ meta: { foo: 'bar' } }} />
```
{% endraw %}

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `books` of a given `author`, the `reference` name should be `books`:

```jsx
<ReferenceManyFieldBase label="Books" reference="books" target="author_id">
  <DataTable>
    <DataTable.Col source="title" />
    <DataTable.Col source="published_at" field={DateField} />
  </DataTable>
</ReferenceManyFieldBase>
```

## `sort`

By default, it orders the possible values by id desc. You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}
```jsx
<ReferenceManyFieldBase
  target="post_id"
  reference="comments"
  sort={{ field: 'created_at', order: 'DESC' }}
>
   ...
</ReferenceManyFieldBase>
```
{% endraw %}

## `source`

By default, `ReferenceManyFieldBase` uses the `id` field as target for the reference. If the foreign key points to another field of your record, you can select it with the `source` prop.

```jsx
<ReferenceManyFieldBase
  target="post_id"
  reference="comments"
  source="_id"
>
   ...
</ReferenceManyFieldBase>
```

## `storeKey`

By default, react-admin stores the reference list selection state in localStorage so that users can come back to the list and find it in the same state as when they left it. React-admin uses the main resource, record id and reference resource as the identifier to store the selection state (under the key `${resource}.${record.id}.${reference}.selectedIds`).

If you want to display multiple lists of the same reference and keep distinct selection states for each one, you must give each list a unique `storeKey` property.

In the example below, both lists use the same reference ('books'), but their selection states are stored separately (under the store keys `'authors.1.books.selectedIds'` and `'custom.selectedIds'` respectively). This allows to use both components in the same page, each having its own state.

{% raw %}
```jsx
<Stack direction="row" spacing={2}>
    <ReferenceManyFieldBase
        reference="books"
        target="author_id"
        queryOptions={{
            meta: { foo: 'bar' },
        }}
    >
        <DataTable>
            <DataTable.Col source="title" />
        </DataTable>
    </ReferenceManyFieldBase>
    <ReferenceManyFieldBase
        reference="books"
        target="author_id"
        queryOptions={{
            meta: { foo: 'bar' },
        }}
        storeKey="custom"
    >
        <DataTable>
            <DataTable.Col source="title" />
        </DataTable>
    </ReferenceManyFieldBase>
</Stack>
```
{% endraw %}

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if an `author` has many `books`, and each book resource exposes an `author_id` field, the `target` would be `author_id`.

```jsx
<ReferenceManyFieldBase label="Books" reference="books" target="author_id">
  <DataTable>
    <DataTable.Col source="title" />
    <DataTable.Col source="published_at" field={DateField} />
  </DataTable>
</ReferenceManyFieldBase>
```
