---
layout: default
title: "The StackedFilters Component"
---

# `<StackedFilters>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component provides an alternative filter UI for `<List>` pages. It lets users build complex filters by combining a field, an operator, and a value.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.webm" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

Create a filter configuration object by specifying the operators and UI for each source that can be used as a filter. Then, pass it to the `<StackedFilters>` component, and pass that component to the `filters` prop of the `<List>` component.

```jsx
import { Datagrid, List, TextField, NumberField, BooleanField, ReferenceArrayField } from 'react-admin';
import { StackedFilters, textFilter, dateFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';

const postListFilters = {
    id: textFilter({ operators: ['eq', 'neq'] }),
    title: textFilter(),
    published_at: dateFilter(),
    is_public: booleanFilter(),
    tags: referenceFilter({ reference: 'tags' }),
};

const PostList = () => (
    <List filters={<StackedFilters config={postListFilters} />}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <ReferenceArrayField tags="tags" source="tag_ids" />
            <BooleanField source="published" />
        </Datagrid>
    </List>
)
```

The `config` prop accepts an object with the following structure:

```jsx
{
    [source]: {
        operators: [operator],
        input: ReactElement,
    },
}
```

Check the [built-in filters](#built-in-filters) section for more information about helpers for building filters.

## Data Provider Integration

Upon user interaction, `<StackedFilters>` sets the list `filter` with keys concatenating the selected source with the selected operator, separated by an underscore (`_`). In the screencast above, the user selection triggers a call to the `dataProvider` with the following filter:

```jsx
dataProvider.getList('posts', {
    filter: {
        title_contains: 'volup',
        is_public_eq: true,
    },
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 10 },
});
```

It's your responsibility to handle these compound keys in your data provider. For instance, to handle the `title_contains` filter, you can use the following code:

```jsx
// in dataProvider.js
const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        let filter = params.filter;
        if (resource === 'posts') {
            if (filter.title_contains) {
                filter = { ...filter, title: { ilike: `%${filter.title_contains}%` } };
                delete filter.title_contains;
            }
            if (filter.is_public_eq) {
                filter = { ...filter, is_public: filter.is_public_eq };
                delete filter.is_public_eq;
            }
        }
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },
};
```

**Tip**: Build a generic solution to handle compound keys for all resources in your data provider, or add support for compound keys in your API directly.

## `config`

`<StackedFilters>` requires a filter configuration object defining the possible fields and operators.

For convenience, react-admin provides a set of [built-in filters](#built-in-filters) for common field types (text, number, date, reference, etc).

```jsx
import { StackedFilters, textFilter, dateFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';

const postListFilters = {
    id: textFilter({ operators: ['eq', 'neq'] }),
    title: textFilter(),
    published_at: dateFilter(),
    is_public: booleanFilter(),
    tags: referenceFilter({ reference: 'tags' }),
};

const PostList = () => (
    <List filters={<StackedFilters config={postListFilters} />}>
        {/* ... */}
    </List>
);
```

You can also define your own filters. Each filter is an object that defines the operators and UI for a given source. For instance, the following filter configuration defines a filter for the `views` field that uses a `NumberInput` for the `eq` and `neq` operators, and a custom `MyNumberRangeInput` for the `between` operator.

```jsx
import { NumberInput } from 'react-admin';
import { textFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';

import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters = {
    title: textFilter(),
    views: {
        operators: [
            { value: 'eq', label: 'Equals', input: ({ source }) => <NumberInput source={source} />, },
            { value: 'neq', label: 'Not Equals', input: ({ source }) => <NumberInput source={source} />, },
            { value: 'between',  label: 'Between', input: ({ source }) => <MyNumberRangeInput source={source} /> },
        ],
    },
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};
```

An operator is an object with the shape `{ label, value, input }`.

- `label`: Operator input label. Can be a translation key.
- `value`: used as a suffix to the `source` when creating the list filters.
- `input`: a component accepting a `source` prop. React-admin will pass the source of the filter to the input component ('views' in the above example)

For instance, with the source `views`, the operator `eq`, and value set to `0`, the dataProvider will receive the following `filter` parameter:

```jsx
{ views_eq: 0 }
```

**Tip**: You can define a default input for all operators of a filter by using the `input` property of the filter object:

```jsx
import { NumberInput } from 'react-admin';
import { textFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';

const postListFilters = {
    title: textFilter(),
    views: {
        input: ({ source }) => <NumberInput source={source} />,
        operators: [
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            { value: 'between', label: 'Between', input: ({ source }) => <MyNumberRangeInput source={source} /> },
        ],
    },
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};
```

## Built-In Filters

To facilitate the creation of filter configurations, react-admin provides some helpers for common filter types. Each of them has predefined operators and inputs. They accept an array of operators if you want to remove some of them.

- `textFilter`: A filter for text fields. Defines the following operator: `eq`, `neq`, and `q`.
- `numberFilter`: A filter for number fields. Defines the following operator: `eq`, `neq`, `lt`, and `gt`.
- `dateFilter`: A filter for date fields. Defines the following operator: `eq`, `neq`, `lt`, and `gt`.
- `booleanFilter`: A filter for boolean fields. Defines the following operator: `eq`.
- `choicesFilter`: A filter for fields that accept a value from a list of choices. Defines the following operator: `eq`, `neq`, `eq_any`, and `neq_any`.
- `choicesArrayFilter`: A filter for array fields. Defines the following operator: `inc`, `inc_any`, and `ninc_any`.
- `referenceFilter`: A filter for reference fields. Defines the following operator: `eq`, `neq`, `eq_any`, and `neq_any`.

The operators are defined as follows:

- `eq`: Equals
- `neq`: Not Equals
- `q`: Full-text search
- `lt`: Less than
- `gt`: Greater than
- `eq_any`: Equals any
- `neq_any`: Not Equals any
- `inc`: Includes
- `inc_any`: Includes any
- `ninc_any`: Not Includes any

Use these built-in helpers to build your filter configuration:

```jsx
import { textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';

const postListFilters = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};
```

With the configuration above, the possible filter keys are:

- `title_eq`
- `title_neq`
- `title_q`
- `views_eq`
- `views_neq`
- `views_lt`
- `views_gt`
- `tag_ids_eq`
- `tag_ids_neq`
- `tag_ids_eq_any`
- `tag_ids_neq_any`
- `published_eq`

## Internationalization

React-admin uses the keys of the filter configuration to display the field names. Each key goes through the standard [resource and field name translation system](./Translation.md#translation-files), so you can customize them using a translation file.

```jsx
// in i18n/en.js
export default {
    resources: {
        posts: {
            name: 'Post |||| Posts',
            fields: {
                title: 'Title',
                views: '# views',
                tag_ids: 'Tags',
                published: 'Published',
            }
        },
    },
};
```

`<StackedFilters>` also uses internationalization for operators. To leverage it, pass a translation key as the operator label:

```jsx
import DateRangeInput from './DateRangeInput';

const MyFilterConfig = {
    published_at: {
        operators: [
            {
                value: 'between',
                label: 'resources.posts.filters.operators.between',
            },
            {
                value: 'nbetween',
                label: 'resources.posts.filters.operators.nbetween',
            },
        ],
        input: ({ source }) => <DateRangeInput source={source} />,
    },
};
```

Then translate the operators in the translation messages:

```jsx
// in i18n/en.js
export default {
    resources: {
        posts: {
            name: 'Post |||| Posts',
            filters: {
                operators: {
                    between: 'Between',
                    nbetween: 'Not Between',
                },
            },
        },
    },
};
```
