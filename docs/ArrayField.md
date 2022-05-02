---
layout: default
title: "The ArrayField Component"
---

# `<ArrayField>`

Display a collection using `<Field>` child components.

Ideal for embedded arrays of objects, e.g. `tags` and `backlinks` in the following `post` object:

```js
{
    id: 123,
    tags: [
        { name: 'foo' },
        { name: 'bar' }
    ],
    backlinks: [
        {
            uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
            date: '2012-08-10T00:00:00.000Z',
            url: 'http://example.com/foo/bar.html',
        },
        {
            uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
            date: '2012-08-14T00:00:00.000Z',
            url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
        }
    ]
}
```

The child must be an iterator component (like `<Datagrid>` or `<SingleFieldList>`).

Here is how to display all the backlinks of the current post as a `<Datagrid>`:

```jsx
<ArrayField source="backlinks">
    <Datagrid>
        <DateField source="date" />
        <UrlField source="url" />
    </Datagrid>
</ArrayField>
```

And here is how to display all the tags of the current post as `<Chip>` components:

```jsx
<ArrayField source="tags">
    <SingleFieldList>
        <ChipField source="name" />
    </SingleFieldList>
</ArrayField>
```

## Properties

`<ArrayField>` accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

**Tip**: If you need to render a custom collection, it's often simpler to write your own component:

```jsx
const TagsField = ({ record }) => (
    <ul>
        {record.tags.map(item => (
            <li key={item.name}>{item.name}</li>
        ))}
    </ul>
)
```
