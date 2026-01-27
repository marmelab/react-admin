---
title: "<ReferenceManyToManyFieldBase>"
---

This component fetches a list of referenced records by lookup in an associative table and passes the records down to its child component, which must be an iterator component.

Note: The `<ReferenceManyToManyFieldBase>` cannot currently display multiple records with the same id from the end reference resource, even though they might have different properties in the associative table.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Let's imagine that you're writing an app managing concerts for artists. The data model features a many-to-many relationship between the `bands` and `venues` tables through a `performances` associative table.

```txt
┌─────────┐       ┌──────────────┐      ┌───────────────┐
│ bands   │       │ performances │      │ venues        │
│---------│       │--------------│      │---------------│
│ id      │───┐   │ id           │   ┌──│ id            │
│ name    │   └──╼│ band_id      │   │  │ name          │
│         │       │ venue_id     │╾──┘  │ location      │
│         │       │ date         │      │               │
└─────────┘       └──────────────┘      └───────────────┘
```

In this example, `bands.id` matches `performances.band_id`, and `performances.venue_id` matches `venues.id`.

To allow users see the `venues` for a given `band` in `<SingleFieldList>`, wrap that component in `<ReferenceManyToManyFieldBase>` where you define the relationship via the `reference`, `through` and `using` props:

```tsx
import React from 'react';
import { ShowBase } from 'ra-core';
import {
    TextField,
    DateField,
    SingleFieldList,
    ChipField,
} from 'my-react-admin-ui-library';
import { ReferenceManyToManyFieldBase } from '@react-admin/ra-core-ee';

export const BandShow = () => (
    <ShowBase>
        <div>
            <TextField source="name" />
            <ReferenceManyToManyFieldBase
                reference="venues"
                through="performances"
                using="band_id,venue_id"
                label="Performances"
            >
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceManyToManyFieldBase>
            <EditButton />
        </div>
    </ShowBase>
);
```

## Props

| Prop           | Required | Type                                        | Default                          | Description                                                                                                                                                                                                      |
| -------------- | -------- | ------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`     | Required | `element`                                   | -                                | An iterator element (e.g. `<WithListContext>`). The iterator element usually has one or more child `<Field>` components.                                                                         |
| `reference`    | Required | `string`                                    | -                                | Name of the reference resource, e.g. 'venues'                                                                                                                                                                    |
| `through`      | Required | `string`                                    | -                                | Name of the resource for the associative table, e.g. 'performances'                                                                                                                                              |
| `filter`       | Optional | `object`                                    | `{}`                             | Filter for the associative table (passed to the `getManyReference()` call)                                                                                                                                       |
| `joinLimit`    | Optional | `number`                                    | 100                              | Limit for the number of results fetched from the associative table. Should be **greater than `perPage`**                                                                                                         |
| `perPage`      | Optional | `number`                                    | 25                               | Limit the number of displayed result after `getManyReference` is called. Useful when using a pagination component. Should be **smaller than `joinLimit`**                                                        |
| `queryOptions` | Optional | `UseQueryOptions`                           | -                                | Query options for the `getMany` and `getManyReference` calls                                                                                                                                                     |
| `sort`         | Optional | `{ field: string, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }` | Sort for the associative table (passed to the `getManyReference()` call)                                                                                                                                         |
| `source`       | Optional | `string`                                    | `'id'`                           | Name of the field containing the identity of the main resource. Used determine the value to look for in the associative table.                                                                                   |
| `using`        | Optional | `string`                                    | `'[resource]_id,[reference]_id'` | Tuple (comma separated) of the two field names used as foreign keys, e.g 'band_id,venue_id'. The tuple should start with the field pointing to the resource, and finish with the field pointing to the reference |

## `children`

`<ReferenceManyToManyFieldBase>` expects an _iterator_ component as child, i.e. a component working inside a `ListContext`.

```tsx
import React from 'react';
import { ShowBase, WithListContext } from 'ra-core';
import { ReferenceManyToManyFieldBase } from '@react-admin/ra-core-ee';

export const BandShow = () => (
    <ShowBase>
        <div>
            <ReferenceManyToManyFieldBase
                reference="venues"
                through="performances"
                using="band_id,venue_id"
                label="Performances"
            >
                <WithListContext render={({ isPending, data }) => (
                        isPending ? (
                            <div>
                                {data.map(tag => (
                                    <span key={tag.id} label={tag.name} />
                                ))}
                            </div>
                        ) : null
                    )}
                />
            </ReferenceManyToManyFieldBase>
        </div>
    </ShowBase>
);
```

## `filter`

You can filter the records of the associative table (e.g. `performances`) using the `filter` prop. This `filter` is passed to the `getManyReference()` call.

```tsx
<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
    filter={{ date: '2018-08-31' }}
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `joinLimit`

By default, `<ReferenceManyToManyFieldBase>` fetches 100 entries in the join table (e.g. `performances`). You can decrease or increase the number of entries fetched from the associative table by modifying the `joinLimit` prop:

```tsx
import { Pagination } from 'my-react-admin-ui-library';

<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
    joinLimit={50}
>
    {/* ... */}
</ReferenceManyToManyFieldBase>;
```

## `perPage`

By default, `<ReferenceManyToManyFieldBase>` displays at most 25 entries from the associative table (e.g. 25 `performances`). You can change the limit by setting the `perPage` prop:

```tsx
<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
    perPage={10}
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `queryOptions`

Use the `queryOptions` prop to customize the queries for `getMany` and `getManyReference`.

You can for instance use it to pass [a custom meta](https://marmelab.com/ra-core/actions#meta-parameter) to the dataProvider.

```tsx
<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
    queryOptions={{ meta: { myParameter: 'value' } }}
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `reference`

The name of the target resource to fetch.

For instance, if you want to display the `venues` of a given `bands`, through `performances`, the `reference` name should be `venues`:

```tsx
<ReferenceManyToManyFieldBase
    source="id"
    reference="venues"
    resource="bands"
    through="performances"
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `sort`

By default, `<ReferenceManyToManyFieldBase>` orders the possible values by `id` desc for the associative table (e.g. `performances`). You can change this order by setting the `sort` prop (an object with `field` and `order` properties) to be applied to the associative resource.

```tsx
<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
    sort={{ field: 'id', order: 'DESC' }}
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `source`

By default, `<ReferenceManyToManyFieldBase>` uses the `id` field as target for the reference. If the foreign key points to another field of your record, you can select it with the `source` prop

```tsx
<ReferenceManyToManyFieldBase
    source="_id"
    reference="venues"
    resource="bands"
    through="performances"
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `through`

You must specify the associative table name using the `through` prop.

```tsx
<ReferenceManyToManyFieldBase reference="venues" through="performances">
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## `using`

You can specify the columns to use in the associative `using` the using prop.

```tsx
<ReferenceManyToManyFieldBase
    reference="venues"
    through="performances"
    using="band_id,venue_id"
>
    {/* ... */}
</ReferenceManyToManyFieldBase>
```

## DataProvider Calls

`<ReferenceManyToManyFieldBase>` fetches the `dataProvider` twice in a row:

-   once to get the records of the associative resource (`performances` in this case), using a `getManyReference()` call
-   once to get the records of the reference resource (`venues` in this case), using a `getMany()` call.

For instance, if the user displays the band of id `123`, `<ReferenceManyToManyFieldBase>` first issues the following query to the `dataProvider`:

```js
dataProvider.getManyReference('performances', {
    target: 'band_id',
    id: 123,
});
```

Let's say that the `dataProvider` returns the following response:

```json
{
    "data": [
        { "id": 667, "band_id": 123, "venue_id": 732 },
        { "id": 895, "band_id": 123, "venue_id": 874 }
        { "id": 901, "band_id": 123, "venue_id": 756 }
    ],
    "total": 3
}
```

Then, `<ReferenceManyToManyFieldBase>` issues a second query to the `dataProvider`:

```js
dataProvider.getMany('venues', {
    ids: [732, 874, 756],
});
```

And receives the reference venues:

```json
{
    "data": [
        { "id": 732, "name": "Madison Square Garden" },
        { "id": 874, "name": "Yankee Stadium" }
        { "id": 874, "name": "Barclays Center" }
    ],
    "total": 3
}
```
