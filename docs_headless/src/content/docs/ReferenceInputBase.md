---
title: "<ReferenceInputBase>"
---

`<ReferenceInputBase>` is useful for foreign-key values, for instance, to edit the `company_id` of a `contact` resource. 
`<ReferenceInputBase>` is a headless component, handling only the logic. This allows to use any UI library for the render.

## Usage

For instance, a contact record has a `company_id` field, which is a foreign key to a company record. 

```
┌──────────────┐       ┌────────────┐
│ contacts     │       │ companies  │
│--------------│       │------------│
│ id           │   ┌───│ id         │
│ first_name   │   │   │ name       │
│ last_name    │   │   │ address    │
│ company_id   │───┘   └────────────┘
└──────────────┘             
```

To make the `company_id` for a `contact` editable, use the following syntax:

```jsx
import { EditBase, ReferenceInputBase, Form, useChoicesContext, useInput } from 'ra-core';
import { TextInput } from 'my-react-admin-ui';

const ContactEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="title" />
            <ReferenceInputBase source="company_id" reference="companies">
                <CompanySelector />
            </ReferenceInputBase>
            <button type="submit">Save</button>
        </Form>
    </EditBase>
);

const CompanySelector = () => {
    const { allChoices, isLoading, error, source } = useChoicesContext();
    const { field, id } = useInput({ source });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            <label htmlFor={id}>Company</label>
            <select id={id} {...field}>
                <option value="">Select a company</option>
                {allChoices.map(choice => (
                    <option key={choice.id} value={choice.id}>
                        {choice.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
```

`<ReferenceInputBase>` requires a `source` and a `reference` prop.

`<ReferenceInputBase>` uses the foreign key value to fetch the related record. It also grabs the list of possible choices for the field. For instance, if the `ContactEdit` component above is used to edit the following contact:

```js
{
    id: 123,
    first_name: 'John',
    last_name: 'Doe',
    company_id: 456
}
```

Then `<ReferenceInputBase>` will issue the following queries:

```js
dataProvider.getMany('companies', { ids: [456] });
dataProvider.getList('companies', { 
    filter: {},
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

`<ReferenceInputBase>` handles the data fetching and provides the choices through a [`ChoicesContext`](./usechoicescontext). It's up to the child components to render the selection interface.

You can tweak how `<ReferenceInputBase>` fetches the possible values using the `page`, `perPage`, `sort`, and `filter` props.

## Props

| Prop               | Required | Type                                        | Default                          | Description                                                                                    |
|--------------------|----------|---------------------------------------------|----------------------------------|------------------------------------------------------------------------------------------------|
| `source`           | Required | `string`                                    | -                                | Name of the entity property to use for the input value                                         |
| `reference`        | Required | `string`                                    | ''                               | Name of the reference resource, e.g. 'companies'.                                                  |
| `children`         | Required | `ReactNode`                                 | -                                | The actual selection component                                                                 |
| `enableGetChoices` | Optional | `({q: string}) => boolean`                  | `() => true`                     | Function taking the `filterValues` and returning a boolean to enable the `getList` call.       |
| `filter`           | Optional | `Object`                                    | `{}`                             | Permanent filters to use for getting the suggestion list                                       |
| `page`             | Optional | `number`                                    | 1                                | The current page number                                                                        |
| `perPage`          | Optional | `number`                                    | 25                               | Number of suggestions to show                                                                  |
| `offline`          | Optional | `ReactNode`                                 | -                                | What to render when there is no network connectivity when loading the record                  |
| `queryOptions`     | Optional | [`UseQueryOptions`](https://tanstack.com/query/v5/docs/react/reference/useQuery) | `{}` | `react-query` client options                                                                   |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field:'id', order:'DESC' }` | How to order the list of suggestions                                                           |

## `children`

You can pass any component of your own as child, to render the selection interface as you wish.
You can access the choices context using the `useChoicesContext` hook.

```tsx
import { ReferenceInputBase, useChoicesContext, useInput } from 'ra-core';

export const CustomSelector = () => {
    const { allChoices, isLoading, error, source } = useChoicesContext();
    const { field, id } = useInput({ source });

    if (error) {
        return <div className="error">{error.toString()}</div>;
    }

    return (
        <div>
            <label htmlFor={id}>Company</label>
            <select id={id} {...field}>
                {isPending && <option value="">Loading...</option>}
                <option value="">Select a company</option>
                {allChoices.map(choice => (
                    <option key={choice.id} value={choice.id}>
                        {choice.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const MyReferenceInput = () => (
    <ReferenceInputBase source="company_id" reference="companies">
        <CustomSelector />
    </ReferenceInputBase>
);
```

## `enableGetChoices`

You can make the `getList()` call lazy by using the `enableGetChoices` prop. This prop should be a function that receives the `filterValues` as parameter and return a boolean. This can be useful when using a search input on a resource with a lot of data. The following example only starts fetching the options when the query has at least 2 characters:

```jsx
<ReferenceInputBase
     source="company_id"
     reference="companies"
     enableGetChoices={({ q }) => q && q.length >= 2}
/>
```

## `filter`

You can filter the query used to populate the possible values. Use the `filter` prop for that.

```jsx
<ReferenceInputBase source="company_id" reference="companies" filter={{ is_published: true }} />
```

## `offline`

`<ReferenceInputBase>` can display a custom message when the referenced record is missing because there is no network connectivity, thanks to the `offline` prop.

```jsx
<ReferenceInputBase source="user_id" reference="users" offline="No network, could not fetch data" />
```

`<ReferenceInputBase>` renders the `offline` element when:

- the referenced record is missing (no record in the `users` table with the right `user_id`), and
- there is no network connectivity

You can pass either a React element or a string to the `offline` prop:

```jsx
<ReferenceInputBase source="user_id" reference="users" offline={<span>No network, could not fetch data</span>} />
<ReferenceInputBase source="user_id" reference="users" offline="No network, could not fetch data" />
<ReferenceInputBase
    source="user_id"
    reference="users"
    offline={<Translate i18nKey="myapp.reference_input.offline">No network, could not fetch data</Translate>}
/>
```

## `perPage`

By default, `<ReferenceInputBase>` fetches only the first 25 values. You can extend this limit by setting the `perPage` prop.

```jsx
<ReferenceInputBase source="company_id" reference="companies" perPage={100} />
```

## `reference`

The name of the reference resource. For instance, in a contact form, if you want to edit the contact employer, the reference should be "companies".

```jsx
<ReferenceInputBase source="company_id" reference="companies" />
```

`<ReferenceInputBase>` will use the reference resource [`recordRepresentation`](./Resource.md#recordrepresentation) to display the selected record and the list of possible records. So for instance, if the `companies` resource is defined as follows:

```jsx
<Resource name="companies" recordRepresentation="name" />
```

Then `<ReferenceInputBase>` will display the company name in the choices list.

## `queryOptions`

Use the `queryOptions` prop to pass options to the `dataProvider.getList()` query that fetches the possible choices.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

```jsx
<ReferenceInputBase 
    source="company_id"
    reference="companies"
    queryOptions={{ meta: { foo: 'bar' } }}
/>
```

## `sort`

By default, `<ReferenceInputBase>` orders the possible values by `id` desc. 

You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

```jsx
<ReferenceInputBase
    source="company"
    reference="companies"
    sort={{ field: 'name', order: 'ASC' }}
/>
```

## `source`

The name of the property in the record that contains the identifier of the selected record.

For instance, if a contact contains a reference to a company via a `company_id` property:

```js
{
    id: 456,
    firstName: "John",
    lastName: "Doe",
    company_id: 12,
}
```

Then to display a selector for the contact company, you should call `<ReferenceInputBase>` as follows:

```jsx
<ReferenceInputBase source="company_id" reference="companies" />
```

## Performance 

Why does `<ReferenceInputBase>` use the `dataProvider.getMany()` method with a single value `[id]` instead of `dataProvider.getOne()` to fetch the record for the current value?

Because when there may be many `<ReferenceInputBase>` for the same resource in a form (for instance when inside an `<ArrayInput>`), react-admin *aggregates* the calls to `dataProvider.getMany()` into a single one with `[id1, id2, ...]`.

This speeds up the UI and avoids hitting the API too much.