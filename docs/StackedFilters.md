---
layout: default
title: "The StackedFilters Component"
---

# `<StackedFilters>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component provides an alternative filter UI for `<List>` pages. It introduces the concept of operators to allow richer filtering.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/stackedfilters-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Use a `<StackedFilters>` component in the [`<List actions>`](./List.md#actions) element. Define the filters using the `config` prop, which must contain a [filtering configuration](#filters-configuration).

```tsx
// in src/posts/PostList.tsx
import {
    BooleanField,
    Datagrid,
    List,
    NumberField,
    ReferenceArrayField,
    TextField,
} from 'react-admin';
import { PostListToolbar } from './PostListToolbar';

const PostList = () => (
    <List actions={<PostListToolbar />}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <ReferenceArrayField tags="tags" source="tag_ids" />
            <BooleanField source="published" />
        </Datagrid>
    </List>
);

// in src/posts/PostListToolbar.tsx
import { CreateButton, TopToolbar } from 'react-admin';
import {
    StackedFilters,
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-form-layout';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};

export const PostListToolbar = () => (
    <TopToolbar>
        <CreateButton />
        <StackedFilters config={postListFilters} />
    </TopToolbar>
);
```

You must also update your data provider to support filters with operators. See the [data provider configuration](#data-provider-configuration) section below. 

## Filters Configuration

Define the filter configuration in the `<StackedFilters config>` prop. The value must be an object defining the operators and UI for each field that can be used as a filter.

It looks like this:

```tsx
import { FiltersConfig, StackedFilters, textFilter } from '@react-admin/ra-form-layout';
import { NumberInput, TextInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: {
        operators: [
            { value: 'eq', label: 'Equals', type: 'single' },
            { value: 'neq', label: 'Not Equals', type: 'single', defaultValue: 0 },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
                type: 'multiple'
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
    },
    description: {
        operators: [
            { value: 'eq', label: 'Equals', type: 'single' },
            { value: 'neq', label: 'Not Equals', type: 'single' },
        ],
        input: ({ source }) => <TextInput source={source} />,
        defaultValue: 'Lorem Ipsum',
    }
};

export const PostListToolbar = () => (
    <TopToolbar>
        // ...
        <StackedFilters config={postListFilters} />
    </TopToolbar>
);
```

For a given field, the filter configuration should be an object containing an array of `operators` and a default `input`, used for operators that don't define their own. You can use the [filter configuration builders](#filter-configuration-builders) (like `textFilter`) to build filter configuration objects.

An **operator** is an object that has a `label`, a `value`, a `defaultValue` and a `type`.

- The `label` is a string, and can be a translation key.
- The `value` is used as a suffix to the `source` and passed to the list filters.
- The `defaultValue` is used as the default filter value.
- The `type` ensures that when selecting an operator with a different type than the previous one, React-admin resets the filter value. Its value should be either `single` for filters that accepts a single value (for instance a `string`) or `multiple` for filters that accepts multiple values (for instance an `Array` of `string`). Should you need to differentiate a custom input from those two types, you may provide any type you want to the `type` option (for instance, `map`).

For instance, if the user adds the `views` filter with the `eq` operator and a value of `0`, the `dataProvider.getList()` will receive the following `filter` parameter:

```js
{ views_eq: 0 }
```

In your filter declaration, you can provide an `operator`, an `input` and a `defaultValue`.
The **input** is a react object taking `source` as prop and rendering the input you will need to fill for your filter.

**Tip:** The `defaultValue` of an `operator` takes priority over the `defaultValue` of a filter.

## Filter Configuration Builders

To make it easier to create a filter configuration, `ra-form-layout` provides some helper functions. Each of them has predefined operators and inputs. They accept an array of operators if you want to remove some of them.

-   `textFilter`: A filter for text fields. Defines the following operator: `eq`, `neq` and `q`.
-   `numberFilter`: A filter for number fields. Defines the following operator: `eq`, `neq`, `lt` and `gt`.
-   `dateFilter`: A filter for date fields. Defines the following operator: `eq`, `neq`, `lt` and `gt`.
-   `booleanFilter`: A filter for boolean fields. Defines the following operator: `eq`.
-   `choicesFilter`: A filter for fields that accept a value from a list of choices. Defines the following operator: `eq`, `neq`, `eq_any` and `neq_any`.
-   `choicesArrayFilter`: A filter for array fields. Defines the following operator: `inc`, `inc_any` and `ninc_any`.
-   `referenceFilter`: A filter for reference fields. Defines the following operator: `eq`, `neq`, `eq_any` and `neq_any`.

Build your filter configuration by calling the helpers for each source:

```tsx
import {
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-form-layout';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};
```

## Data Provider Configuration

In react-admin, `dataProvider.getList()` accepts a `filter` parameter to filter the records. There is no notion of *operators* in this parameter, as the expected format is an object like `{ field: value }`. As `StackedFilters` needs operators, it uses a convention to concatenate the field name and the operator with an underscore.

For instance, if the Post resource has a `title` field, and you configure `<StackedFilters>` to allow filtering on this field as a text field, the `dataProvider.getList()` may receive the following `filter` parameter:

- title_eq
- title_neq
- title_q

The actual suffixes depend on the type of filter configured in `<StackedFilter>` (see [filters configuration builders](#filter-configuration-builders) above). Here is an typical call to `dataProvider.getList()` with a posts list using `<StackedFilters>`:

```jsx
const { data } = useGetList('posts', {
    filter: {
        title_q: 'lorem',
        date_gte: '2021-01-01',
        views_eq: 0,
        tags_inc_any: [1, 2],
    },
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'title', order: 'ASC' },
});
```

It's up to your data provider to convert the `filter` parameter into a query that your API understands. 

For instance, if your API expects filters as an array of criteria objects (`[{ field, operator, value }]`), `dataProvider.getList()` should convert the `filter` parameter as follows:

```jsx
const dataProvider = {
    // ...
    getList: async (resource, params) => {
        const { filter } = params;
        const filterFields = Object.keys(filter);
        const criteria = [];
        // eq operator
        filterFields.filter(field => field.endsWith('_eq')).forEach(field => {
            criteria.push({ field: field.replace('_eq', ''), operator: 'eq', value: filter[field] });
        });
        // neq operator
        filterFields.filter(field => field.endsWith('_neq')).forEach(field => {
            criteria.push({ field: field.replace('_neq', ''), operator: 'neq', value: filter[field] });
        });
        // q operator
        filterFields.filter(field => field.endsWith('_q')).forEach(field => {
            criteria.push({ field: field.replace('_q', ''), operator: 'q', value: filter[field] });
        });
        // ...
    },
}
```

Few of the [existing data providers](./DataProviderList.md) implement this convention. this means you'll probably have to adapt your data provider to support the operators used by `<StackedFilters>`.

## Props

| Prop                      | Required      | Type     | Default         | Description                                                                                       |
| ------------------------- | ------------- | -------- | --------------- |---------------------------------------------------------------------------------------------------|
| `config`                  | Required      | object   | -               | The stacked filters configuration                                                                 |
| `BadgeProps`              | Optional      | object   | -               | Additional props to pass to the [MUI Badge](https://mui.com/material-ui/react-badge/) element     |
| `ButtonProps`             | Optional      | object   | -               | Additional props to pass to the [Button](./Buttons.md#button) element                             |
| `className`               | Optional      | string   | -               | Additional CSS class applied on the root component                                                |
| `PopoverProps`            | Optional      | Object   | -               | Additional props to pass to the [MUI Popover](https://mui.com/material-ui/react-popover/) element |
| `StackedFilters FormProps` | Optional      | Object   | -               | Additional props to pass to the [StackedFiltersForm](#stackedfiltersform) element                 |
| `sx`                      | Optional      | Object   | -               | An object containing the MUI style overrides to apply to the root component                       |

## `BadgeProps`

This prop lets you pass additional props for the [MUI Badge](https://mui.com/material-ui/react-badge/).

{% raw %}
```tsx
import { StackedFilters } from '@react-admin/ra-form-layout';

export const MyStackedFilter = () => (
    <StackedFilters config={config} BadgeProps={{ showZero: true }} />
);
```
{% endraw %}

## `ButtonProps`

This prop lets you pass additional props for the [Button](./Buttons.md#button).

{% raw %}
```tsx
import { StackedFilters } from '@react-admin/ra-form-layout';

export const MyStackedFilter = () => (
    <StackedFilters config={config} ButtonProps={{ variant: 'contained' }} />
);
```
{% endraw %}

## `className`

This prop lets you pass additional CSS classes to apply to the root element (a `div`).

```tsx
import { StackedFilters } from '@react-admin/ra-form-layout';

export const MyStackedFilter = () => (
    <StackedFilters config={config} className="my-css-class" />
);
```

## `config`

This prop lets you define the filter configuration, which is required. This is an object defining the operators and UI for each source that can be used as a filter:

```tsx
import { FiltersConfig, StackedFilters } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    views: {
        operators: [
            { value: 'eq', label: 'Equals', type: 'single' },
            { value: 'neq', label: 'Not Equals', type: 'single', defaultValue: 1 },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
                type: 'multiple',
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
        defaultValue: 0
    },
};

export const MyStackedFilter = () => (
    <StackedFilters config={postListFilters} />
);
```

## `PopoverProps`

This prop lets you pass additional props for the [MUI Popover](https://mui.com/material-ui/react-popover/).

{% raw %}
```tsx
import { StackedFilters } from '@react-admin/ra-form-layout';

export const MyStackedFilter = () => (
    <StackedFilters config={config} PopoverProps={{ elevation: 4 }} />
);
```
{% endraw %}

## `StackedFiltersFormProps`

This prop lets you pass additional props for the [StackedFiltersForm](#stackedfiltersform).

{% raw %}
```tsx
import { StackedFilters } from '@react-admin/ra-form-layout';

export const MyStackedFilter = () => (
    <StackedFilters config={config} StackedFiltersForm={{ className: 'my-css-class' }} />
);
```
{% endraw %}

## `sx`: CSS API

This prop lets you override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                           | Description                                                              |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `RaStackedFilters`                  | Applied to the root component                                            |
| `& .RaStackedFilters-popover`       | Applied to the [MUI Popover](https://mui.com/material-ui/react-popover/) |
| `& .RaStackedFilters-formContainer` | Applied to the form container (a `div`)                                  |

## Internationalization

The source field names are translatable. `ra-form-layout` uses the react-admin [resource and field name translation system](./Translation.md#translation-files). 

This is an example of an English translation file for the `customer` resource:

```ts
// in i18n/en.js
export default {
    resources: {
        customer: {
            name: 'Customer |||| Customers',
            fields: {
                first_name: 'First name',
                last_name: 'Last name',
                dob: 'Date of birth',
            },
        },
    },
};
```

`<StackedFilters>` also supports internationalization for operators. To leverage it, pass a translation key as the operator label:

```tsx
import { FiltersConfig } from '@react-admin/ra-form-layout';
import DateRangeInput from './DateRangeInput';

const MyFilterConfig: FiltersConfig = {
    published_at: {
        operators: [
            {
                value: 'between',
                label: 'resources.posts.filters.operators.between',
                type: 'mutliple',
            },
            {
                value: 'nbetween',
                label: 'resources.posts.filters.operators.nbetween',
                type: 'mutliple',
            },
        ],
        input: ({ source }) => <DateRangeInput source={source} />,
    },
};
```

## `<StackedFiltersForm>`

This component is responsible for rendering the filtering form, and is used internally by `<StackedFilters>`. You can use it if you want to use the filter form without the `<FilterButton>` component, e.g. to always show the filter form.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://react-admin-ee.marmelab.com/assets/stacked-filter-form-preview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Usage

Just like `<StackedFilters>`, `<StackedFiltersForm>` requires a [filtering configuration](#filters-configuration) as its `config` prop value.

{% raw %}
```tsx
import {
    Datagrid,
    List,
    TextField,
    NumberField,
    BooleanField,
    ReferenceArrayField,
    useListContext,
} from 'react-admin';
import {
    StackedFiltersForm,
    FiltersConfig,
    textFilter,
    referenceFilter,
    booleanFilter,
    dateFilter,
} from '@react-admin/ra-form-layout';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const postListFilters: FiltersConfig = {
    id: textFilter({ operators: ['eq', 'neq'] }),
    title: textFilter(),
    published_at: dateFilter(),
    is_public: booleanFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
};

const PostListFiltersForm = () => {
    const { filterValues } = useListContext();
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="filters-content"
                id="filters-header"
            >
                <Typography>
                    {Object.keys(filterValues).length ? `${Object.keys(filterValues).length} filter(s) applied` : 'Filters'}
                </Typography>
            </AccordionSummary>
            <AccordionDetails id="filters-content">
                <StackedFiltersForm config={postListFilters} />
            </AccordionDetails>
        </Accordion>
    );
};
```
{% endraw %}

If you need to be notified when users have applied filters, pass a function to the `onFiltersApplied` prop. This is useful if you want to close the filters container (`<Modal>`, `<Drawer>`, etc.).

### Props

| Prop                      | Required      | Type     | Default         | Description                                            |
| ------------------------- | ------------- | -------- | --------------- | ------------------------------------------------------ |
| `config`                  | Required      | object   | -               | The stacked filters configuration                                          |
| `className`               | Optional      | string   | -               | Additional CSS class applied on the root component                                              |
| `onFiltersApplied`        | Optional      | Function | -               | A function called when users click on the apply button                                           |
| `sx`                      | Optional      | Object   | -               | An object containing the MUI style overrides to apply to the root component               |

### `className`

This prop lets you pass additional CSS classes to apply to the root element (a `Form`).

```tsx
import { StackedFiltersForm } from '@react-admin/ra-form-layout';

export const MyStackedFilterForm = () => (
    <StackedFiltersForm config={config} className="my-css-class" />
);
```

### `config`

This prop lets you define the filter configuration, which is required. This is an object defining the operators and UI for each source that can be used as a filter:

```tsx
import { FiltersConfig, StackedFiltersForm } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    views: {
        operators: [
            { value: 'eq', label: 'Equals', type: 'single' },
            { value: 'neq', label: 'Not Equals', type: 'single', defaultValue: 1 },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
                type: 'mutliple',
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
        defaultValue: 0,
    },
};

export const MyStackedFiltersForm = () => (
    <StackedFiltersForm config={postListFilters} />
);
```

### `onFiltersApplied`

This prop lets you provide a function that will be called when users click the apply button:

```tsx
import { FiltersConfig } from '@react-admin/ra-form-layout';

export const MyStackedFiltersForm = () => (
    <StackedFiltersForm config={config} onFiltersApplied={() => alert('Filters applied')} />
);
```

### `sx`: CSS API

This prop lets you override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                               | Description                                                          |
| --------------------------------------- | -------------------------------------------------------------------- |
| `RaStackedFiltersForm`                  | Applied to the root component                                                     |
| `& .RaStackedFiltersForm-sourceInput`   | Applied to the [AutocompleteInput](./AutocompleteInput.md) that allows users to select the field |
| `& .RaStackedFiltersForm-operatorInput`   | Applied to the [SelectInput](./SelectInput.md) that allows users to select the field       |
| `& .RaStackedFiltersForm-valueInput`    | Applied to the input that allows users to set  the filter value                                                         |
