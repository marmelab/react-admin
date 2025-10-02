---
title: "<ReferenceArrayInputBase>"
---

`<ReferenceArrayInputBase>` is useful for editing an array of reference values, i.e. to let users choose a list of values (usually foreign keys) from another REST endpoint.
`<ReferenceArrayInputBase>` is a headless component, handling only the logic. This allows to use any UI library for the render.

## Usage

For instance, a post record has a `tag_ids` field, which is an array of foreign keys to tags record. 

```
┌──────────────┐       ┌────────────┐
│ post         │       │ tags       │
│--------------│       │------------│
│ id           │   ┌───│ id         │
│ title        │   │   │ name       │
│ body         │   │   └────────────┘
│ tag_ids      │───┘
└──────────────┘             
```

To make the `tag_ids` for a `post` editable, use the following:

```jsx
import { EditBase, ReferenceArrayInputBase, Form, useChoicesContext, useInput } from 'ra-core';
import { TextInput } from 'my-react-admin-ui';

const PostEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="title" />
            <ReferenceArrayInputBase source="tag_ids" reference="tags">
                <TagSelector />
            </ReferenceArrayInputBase>
            <button type="submit">Save</button>
        </Form>
    </EditBase>
);

const TagSelector = () => {
    const { choices, isLoading, error, source } = useChoicesContext();
    const { field, id } = useInput({ source });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    const handleCheckboxChange = (choiceId) => {
        const currentValue = field.value || [];
        const newValue = currentValue.includes(choiceId)
            ? currentValue.filter(id => id !== choiceId)
            : [...currentValue, choiceId];
        field.onChange(newValue);
    };
    
    return (
        <fieldset>
            <legend>Select tags</legend>
            {choices.map(choice => (
                <label key={choice.id} style={{ display: 'block' }}>
                    <input 
                        type="checkbox" 
                        name={field.name}
                        checked={(field.value || []).includes(choice.id)}
                        onChange={() => handleCheckboxChange(choice.id)}
                        onBlur={field.onBlur}
                    />
                    {choice.name}
                </label>
            ))}
        </fieldset>
    );
};
```

`<ReferenceArrayInputBase>` requires a `source` and a `reference` prop.

`<ReferenceArrayInputBase>` uses the array of foreign keys to fetch the related records. It also grabs the list of possible choices for the field. For instance, if the `PostEdit` component above is used to edit the following post:

```js
{
    id: 1234,
    title: "Lorem Ipsum",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag_ids: [1, 23, 4]
}
```

Then `<ReferenceArrayInputBase>` will issue the following queries:

```js
dataProvider.getMany('tags', { ids: [1, 23, 4] });
dataProvider.getList('tags', { 
    filter: {},
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

`<ReferenceArrayInputBase>` handles the data fetching and provides the choices through a [`ChoicesContext`](./usechoicescontext). It's up to the child components to render the selection interface.

You can tweak how `<ReferenceArrayInputBase>` fetches the possible values using the `page`, `perPage`, `sort`, and `filter` props.

## Props

| Prop               | Required | Type                                        | Default                            | Description                                                                                                         |
|--------------------|----------|---------------------------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| `source`           | Required | `string`                                    | -                                | Name of the entity property to use for the input value                                                                |
| `reference`        | Required | `string`                                    | ''                                 | Name of the reference resource, e.g. 'tags'.                                                                       |
| `children`         | Required | `ReactNode`                                 | -                                | The actual selection component                                                                                   |
| `enableGetChoices` | Optional | `({q: string}) => boolean`                  | `() => true`                       | Function taking the `filterValues` and returning a boolean to enable the `getList` call.                           |
| `filter`           | Optional | `Object`                                    | `{}`                               | Permanent filters to use for getting the suggestion list                                                            |
| `offline`          | Optional | `ReactNode`                                 | -                                  | What to render when there is no network connectivity when loading the record |
| `page`             | Optional | `number`                                    | 1                                  | The current page number                                                                                             |
| `perPage`          | Optional | `number`                                    | 25                                 | Number of suggestions to show                                                                                       |
| `queryOptions`     | Optional | [`UseQueryOptions`](https://tanstack.com/query/v5/docs/react/reference/useQuery) | `{}` | `react-query` client options     |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }`   | How to order the list of suggestions                                                                                |

## `children`

You can pass any component of your own as child, to render the selection interface as you wish.
You can access the choices context using the `useChoicesContext` hook.

```tsx
import { ReferenceArrayInputBase, useChoicesContext, useInput } from 'ra-core';

export const CustomArraySelector = () => {
    const { choices, isLoading, error, source } = useChoicesContext();
    const { field, id } = useInput({ source });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error.toString()}</div>;
    }

    const handleCheckboxChange = (choiceId) => {
        const currentValue = field.value || [];
        const newValue = currentValue.includes(choiceId)
            ? currentValue.filter(id => id !== choiceId)
            : [...currentValue, choiceId];
        field.onChange(newValue);
    };

    return (
        <fieldset>
            <legend>Select multiple tags</legend>
            {choices.map(choice => (
                <label key={choice.id} style={{ display: 'block' }}>
                    <input 
                        type="checkbox" 
                        name={field.name}
                        checked={(field.value || []).includes(choice.id)}
                        onChange={() => handleCheckboxChange(choice.id)}
                        onBlur={field.onBlur}
                    />
                    {choice.name}
                </label>
            ))}
        </fieldset>
    );
};

export const MyReferenceArrayInput = () => (
    <ReferenceArrayInputBase source="tag_ids" reference="tags">
        <CustomArraySelector />
    </ReferenceArrayInputBase>
);
```

## `enableGetChoices`

You can make the `getList()` call lazy by using the `enableGetChoices` prop. This prop should be a function that receives the `filterValues` as parameter and return a boolean. This can be useful when using a search input on a resource with a lot of data. The following example only starts fetching the options when the query has at least 2 characters:

```jsx
<ReferenceArrayInputBase
     source="tag_ids"
     reference="tags"
     enableGetChoices={({ q }) => q && q.length >= 2}
/>
```

## `filter`

You can filter the query used to populate the possible values. Use the `filter` prop for that.

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" filter={{ is_published: true }} />
```

## `offline`

`<ReferenceArrayInputBase>` can display a custom message when the referenced record is missing because there is no network connectivity, thanks to the `offline` prop.

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" offline="No network, could not fetch data" />
```

`<ReferenceArrayInputBase>` renders the `offline` element when:

- the referenced record is missing (no record in the `tags` table with the right `tag_ids`), and
- there is no network connectivity

You can pass either a React element or a string to the `offline` prop:

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" offline={<span>No network, could not fetch data</span>} />
<ReferenceArrayInputBase source="tag_ids" reference="tags" offline="No network, could not fetch data" />
```

## `perPage`

By default, `<ReferenceArrayInputBase>` fetches only the first 25 values. You can extend this limit by setting the `perPage` prop.

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" perPage={100} />
```

## `queryOptions`

Use the `queryOptions` prop to pass options to the `dataProvider.getList()` query that fetches the possible choices.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

```jsx
<ReferenceArrayInputBase 
    source="tag_ids"
    reference="tags"
    queryOptions={{ meta: { foo: 'bar' } }}
/>
```

## `reference`

The name of the reference resource. For instance, in a post form, if you want to edit the post tags, the reference should be "tags".

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" />
```

`<ReferenceArrayInputBase>` will use the reference resource [`recordRepresentation`](./Resource.md#recordrepresentation) to display the selected record and the list of possible records. So for instance, if the `tags` resource is defined as follows:

```jsx
<Resource name="tags" recordRepresentation="name" />
```

Then `<ReferenceArrayInputBase>` will display the tag name in the choices list.

## `sort`

By default, `<ReferenceArrayInputBase>` orders the possible values by `id` desc. 

You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

```jsx
<ReferenceArrayInputBase 
    source="tag_ids"
    reference="tags"
    sort={{ field: 'name', order: 'ASC' }}
/>
```

## `source`

The name of the property in the record that contains the array of identifiers of the selected record.

For instance, if a post contains a reference to tags via a `tag_ids` property:

```js
{
    id: 456,
    title: "Hello, world!",
    tag_ids: [123, 456]
}
```

Then to display a selector for the post tags, you should call `<ReferenceArrayInputBase>` as follows:

```jsx
<ReferenceArrayInputBase source="tag_ids" reference="tags" />
```

## Performance 

Why does `<ReferenceArrayInputBase>` use the `dataProvider.getMany()` method with multiple values `[id1, id2, ...]` instead of multiple `dataProvider.getOne()` calls to fetch the records for the current values?

Because when there may be many `<ReferenceArrayInputBase>` for the same resource in a form (for instance when inside an `<ArrayInput>`), react-admin *aggregates* the calls to `dataProvider.getMany()` into a single one with `[id1, id2, id3, ...]`.

This speeds up the UI and avoids hitting the API too much.