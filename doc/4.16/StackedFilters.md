---
layout: default
title: "The StackedFilters Component"
---

# `<StackedFilters>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component provides an alternative filter UI for `<List>` pages. It introduces the concept of operators to allow richer filtering.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.webm" type="video/webm"/>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-form-layout/latest/stackedfilters-overview.mp4" type="video/mp4"/>
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

## Filters Configuration

Define the filter configuration in the `<StackedFilters config>` prop. The value must be an object defining the operators and UI for each field that can be used as a filter.

It looks like this:

```tsx
import { FiltersConfig, StackedFilters, textFilter } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: {
        operators: [
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
    },
};

export const PostListToolbar = () => (
    <TopToolbar>
        // ...
        <StackedFilters config={postListFilters} />
    </TopToolbar>
);
```

For a given field, the filter configuration should be an object containing an array of `operators` and a default `input`, used for operators that don't define their own. You can use the [filter configuration builders](#filter-configuration-builders) (like `textFilter`) to build filter configuration objects.

An operator is an object that has a `label` and a `value`. 

- The `label` is a string, and can be a translation key.
- The `value` is used as a suffix to the `source` and passed to the list filters.

For instance, if the user adds the `views` filter with the `eq` operator and a value of `0`, the `dataProvider.getList()` will receive the following `filter` parameter:

```js
{ views_eq: 0 }
```

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
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
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

## `<StackedFiltersForm>`

This component is responsible for rendering the filtering form, and is used internally by `<StackedFilters>`. You can use it if you want to use the filter form without the `<FilterButton>` component, e.g. to always show the filter form.

<video controls autoplay playsinline muted loop width="100%">
  <source src="https://marmelab.com/ra-enterprise/modules/assets/stacked-filter-form-preview.mp4" type="video/mp4"/>
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
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
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
