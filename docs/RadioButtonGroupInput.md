---
layout: default
title: "The RadioButtonGroupInput Component"
storybook_path: ra-ui-materialui-input-radiobuttongroupinput--basic
---

# `<RadioButtonGroupInput>`

If you want to let the user choose a value among a list of possible values that are always shown, `<RadioButtonGroupInput>` is the right component. It renders using [Material UI's `<RadioGroup>`](https://mui.com/material-ui/react-radio-button/).

<video controls autoplay playsinline muted loop>
  <source src="./img/radio-button-group-input.webm" type="video/webm"/>
  <source src="./img/radio-button-group-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


This input allows editing record fields that are scalar values, e.g. `123`, `'admin'`, etc. 

## Usage

In addition to the `source`, `<RadioButtonGroupInput>` requires one prop: the `choices` listing the possible values.

```jsx
import { RadioButtonGroupInput } from 'react-admin';

<RadioButtonGroupInput source="category" choices={[
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People' },
]} />
```

By default, the possible choices are built from the `choices` prop, using:
  - the `id` field as the option value,
  - the `name` field as the option text

The form value for the source must be the selected value, e.g.

```js
{
    id: 123,
    title: 'Lorem Ipsum',
    category: 'lifestyle',
}
```

**Tip**: React-admin includes other components to edit such values:

 - [`<SelectInput>`](./SelectInput.md) renders a dropdown
 - [`<AutocompleteInput>`](./AutocompleteInput.md) renders a list of suggestions in an autocomplete input

**Tip**: If you need to let users select more than one item in the list, check out the [`<CheckboxGroupInput>`](./CheckboxGroupInput.md) component.

## Props

| Prop              | Required | Type                       | Default | Description                                                                                                                            |
| ----------------- | -------- | -------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`         | Optional | `Object[]`                 | -       | List of items to show as options. Required unless inside a ReferenceInput.                                                             |
| `isPending`       | Optional | `boolean`                  | `false` | If `true`, the component will display a loading indicator.                                                                             |
| `options`         | Optional | `Object`                   | -       | Props to pass to the underlying `<RadioButtonGroup>` element                                                                           |
| `optionText`      | Optional | `string` &#124; `Function` | `name`  | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`     | Optional | `string`                   | `id`    | Field name of record containing the value to use as input value                                                                        |
| `row`             | Optional | `boolean`                  | `true`  | Display options in a compact row.                                                                                                      |
| `translateChoice` | Optional | `boolean`                  | `true`  | Whether the choices should be translated                                                                                               |
| `disableValue`    | Optional | `string`                   | `disabled` | The custom field name used in `choices` to disable some choices                                                                     |

`<RadioButtonGroupInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

An array of objects that represents the choices to show in the options. The objects must have at least two fields: one to use for the option name, and the other to use for the option value. By default, `<RadioButtonGroupInput>` will use the `id` and `name` fields.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People' },
];
<RadioButtonGroupInput source="category" choices={choices} />
```

If the choices have different keys, you can use [`optionText`](#optiontext) and [`optionValue`](#optionvalue) to specify which fields to use for the name and value.

```jsx
const choices = [
    { _id: 'tech', label: 'Tech' },
    { _id: 'lifestyle', label: 'Lifestyle' },
    { _id: 'people', label: 'People' },
];
<RadioButtonGroupInput
    source="category"
    choices={choices}
    optionText="label"
    optionValue="_id"
/>
```

You can render some options as disabled by setting the `disabled` field in some choices:

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', disabled: true },
];
<RadioButtonGroupInput source="category" choices={choices} />
```

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
    { id: 'tech', name: 'myroot.categories.tech' },
    { id: 'lifestyle', name: 'myroot.categories.lifestyle' },
    { id: 'people', name: 'myroot.categories.people' },
];
```

You can opt-out of this translation by setting [the `translateChoice` prop](#translatechoice) to `false`.

If you need to *fetch* the options from another resource, you're actually editing a many-to-one or a one-to-one relationship. In this case, wrap the `<RadioButtonGroupInput>` in a [`<ReferenceInput>`](./ReferenceInput.md). You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceInput label="Author" source="author_id" reference="authors">
    <RadioButtonGroupInput />
</ReferenceInput>
```

See [Selecting a foreign key](#selecting-a-foreign-key) below for more information.

You can also pass an *array of strings* for the choices:

```jsx
const categories = ['tech', 'lifestyle', 'people'];
<RadioButtonGroupInput source="category" choices={categories} />
// is equivalent to
const choices = categories.map(value => ({ id: value, name: value }));
<RadioButtonGroupInput source="category" choices={choices} />
```

## `isPending`

When [fetching choices from a remote API](#fetching-choices), the `<RadioButtonGroupInput>` can't be used until the choices are fetched. To let the user know, you can pass the `isPending` prop to `<RadioButtonGroupInput>`. This displays a loading indicator while the choices are being fetched.

```jsx
import { useGetList, RadioButtonGroupInput } from 'react-admin';

const UserCountry = () => {
    const { data, isPending } = useGetList('countries');
    // data is an array of { id: 123, code: 'FR', name: 'France' }
    return (
        <RadioButtonGroupInput 
            source="country"
            choices={data}
            optionText="name"
            optionValue="code"
            isPending={isPending}
        />
    );
}
```

## `options`

Use the `options` attribute if you want to override any of Material UI's `<RadioGroup>` attributes:

{% raw %}
```jsx
<RadioButtonGroupInput
    source="category"
    choices={choices}
    options={{ labelPosition: 'right' }} />
```
{% endraw %}

Refer to [Material UI RadioGroup documentation](https://mui.com/api/radio-group) for more details.

## `optionText`

You can customize the property to use for the option name (instead of the default `name`) thanks to the `optionText` prop:

```jsx
const choices = [
    { id: 'tech', label: 'Tech' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'people', label: 'People' },
];
<RadioButtonGroupInput source="category" choices={choices} optionText="label" />
```

`optionText` is particularly useful when the choices are records fetched from another resource, and `<RadioButtonGroupInput>` is a child of a [`<ReferenceInput>`](./ReferenceInput.md). By default, react-admin uses the [`recordRepresentation`](./Resource.md#recordrepresentation) function to display the record label. But if you set the `optionText` prop, react-admin will use it instead.

```jsx
import { RadioButtonGroupInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <RadioButtonGroupInput optionText="last_name" />
</ReferenceInput>
```

See [fetching choices](#fetching-choices) below for more details.

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<RadioButtonGroupInput
    source="author_id"
    choices={choices}
    optionText={optionRenderer}
/>
```

`optionText` also accepts a React Element, that will be rendered inside a [`<RecordContext>`](./useRecordContext.md) using the related choice as the `record` prop. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];

const FullNameField = () => {
    const record = useRecordContext();
    return <span>{record.first_name} {record.last_name}</span>;
}

<RadioButtonGroupInput source="author_id" choices={choices} optionText={<FullNameField />}/>
```

## `optionValue`

You can customize the property to use for the option value (instead of the default `id`) thanks to the `optionValue` prop:

```jsx
const choices = [
    { _id: 'tech', name: 'Tech' },
    { _id: 'lifestyle', name: 'Lifestyle' },
    { _id: 'people', name: 'People' },
];
<RadioButtonGroupInput
    source="category"
    choices={choices}
    optionValue="_id"
/>
```

**Note:** `optionValue` is only supported when the choices are provided directly via the `choices` prop. If you use `<RadioButtonGroupInput>` inside a `<ReferenceInput>`, the `optionValue` is always set to `id`, as the choices are records fetched from the related resource, and [records should always have an `id` field](./FAQ.md#can-i-have-custom-identifiersprimary-keys-for-my-resources).

## `row`

By default, the radio buttons are displayed in a row. You can change that and let react-admin render one choice per row by setting the `row` prop to `false`:

```jsx
<RadioButtonGroupInput source="category" choices={choices} row={false} />
```

<video controls autoplay playsinline muted loop>
  <source src="./img/radio-button-group-input-row.webm" type="video/webm"/>
  <source src="./img/radio-button-group-input-row.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## `sx`: CSS API

The `<RadioButtonGroupInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                          | Description                                                   |
|------------------------------------|---------------------------------------------------------------|
| `& .RaRadioButtonGroupInput-label` | Applied to the underlying Material UI's `FormLabel` component |

To override the style of all instances of `<RadioButtonGroupInput>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaRadioButtonGroupInput` key.

## `translateChoice`

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
   { id: 'M', name: 'myroot.gender.male' },
   { id: 'F', name: 'myroot.gender.female' },
];
```

However, in some cases, you may not want the choice to be translated. In that case, set the `translateChoice` prop to `false`.

```jsx
<RadioButtonGroupInput source="gender" choices={choices} translateChoice={false}/>
```

Note that `translateChoice` is set to `false` when `<RadioButtonGroupInput>` is a child of `<ReferenceInput>`.

## `disableValue`

By default, `<RadioButtonGroupInput>` renders the choices with the field `disabled: true` as disabled.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', disabled: true },
];
<RadioButtonGroupInput source="category" choices={choices} />
```

If you want to use another field to denote disabled options, set the `disableValue` prop.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', not_available: true },
];
<RadioButtonGroupInput source="category" choices={choices} disableValue="not_available" />
```

## Fetching Choices

You can use [`useGetList`](./useGetList.md) to fetch choices. For example, to fetch a list of countries for a user profile:

```jsx
import { useGetList, RadioButtonGroupInput } from 'react-admin';

const CountryInput = () => {
    const { data, isPending } = useGetList('countries');
    // data is an array of { id: 123, code: 'FR', name: 'France' }
    return (
        <RadioButtonGroupInput 
            source="country"
            choices={data}
            optionText="name"
            optionValue="code"
            isPending={isPending}
        />
    );
}
```

The `isPending` prop is used to display a loading indicator while the data is being fetched.

However, most of the time, if you need to populate a `<RadioButtonGroupInput>` with choices fetched from another resource, it's because you are trying to set a foreign key. In that case, you should use [`<ReferenceInput>`](./ReferenceInput.md) to fetch the choices instead (see next section). 

## Selecting a Foreign Key

If you use `<RadioButtonGroupInput>` to set a foreign key for a many-to-one or a one-to-one relationship, you'll have to [fetch choices](#fetching-choices), as explained in the previous section. You'll also have to fetch the record corresponding to the current value of the foreign key, as it may not be in the list of choices. 

For example, if a `contact` has one `company` via the `company_id` foreign key, a contact form can let users select a company as follows:

```jsx
import { useGetList, useGetOne, RadioButtonGroupInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

const CompanyInput = () => {
    // fetch possible companies
    const { data: choices, isPending: isPendingChoices } = useGetList('companies');
    // companies are like { id: 123, name: 'Acme' }
    // get the current value of the foreign key
    const companyId = useWatch({ name: 'company_id'})
    // fetch the current company
    const { data: currentCompany, isPending: isPendingCurrentCompany } = useGetOne('companies', { id: companyId });
    // if the current company is not in the list of possible companies, add it
    const choicesWithCurrentCompany = choices
        ? choices.find(choice => choice.id === companyId)
            ? choices
            : [...choices, currentCompany]
        : [];
    const isPending = isPendingChoices && isPendingCurrentCompany;
    
    return (
        <RadioButtonGroupInput 
            label="Company"
            source="company_id"
            choices={choicesWithCurrentCompany}
            optionText="name"
            disabled={isPending}
        />
    );
}
```

As this is a common task, react-admin provides a shortcut to do the same in a declarative way: [`<ReferenceInput>`](./ReferenceInput.md):

```jsx
import { ReferenceInput, RadioButtonGroupInput } from 'react-admin';

const CompanyInput = () => (
    <ReferenceInput reference="companies" source="company_id">
        <RadioButtonGroupInput 
            label="Company"
            source="company_id"
            optionText="name"
        />
    </ReferenceInput>
);
```

`<ReferenceInput>` is a headless component that:
 
 - fetches a list of records with `dataProvider.getList()` and `dataProvider.getOne()`, using the `reference` prop for the resource,
 - puts the result of the fetch in the `ChoiceContext` as the `choices` prop, as well as the `isPending` state,
 - and renders its child component

When rendered as a child of `<ReferenceInput>`, `<RadioButtonGroupInput>` reads that `ChoiceContext` to populate its own `choices` and `isPending` props.

In fact, you can simplify the code even further:

- `<ReferenceInput>` puts all its props inside the `ChoiceContext`, including `source`, so `<RadioButtonGroupInput>` doesn't need to repeat it.
- You can also put the `label` prop on the `<ReferenceInput>` rather than `<RadioButtonGroupInput>` so that it looks just like [`<ReferenceField>`](./ReferenceField.md) (for easier memorization). 
- `<RadioButtonGroupInput>` uses the [`recordRepresentation`](./Resource.md#recordrepresentation) to determine how to represent the related choices. In the example above, the `companies` resource uses `name` as its `recordRepresentation`, so `<RadioButtonGroupInput>` will default to `optionText="name"`. 

The code for the `<CompanyInput>` component can be reduced to:

```jsx
import { ReferenceInput, RadioButtonGroupInput } from 'react-admin';

const CompanyInput = () => (
    <ReferenceInput reference="companies" source="company_id" label="Company">
        <RadioButtonGroupInput />
    </ReferenceInput>
);
```

This is the recommended approach for using `<RadioButtonGroupInput>` to select a foreign key. This not only signifies that the input is a `<RadioButtonGroupInput>` but also highlights its function in fetching choices from another resource, ultimately enhancing the code's readability.

**Tip**: `<ReferenceInput>` is much more powerful than the initial snippet. It optimizes and caches API calls, enables refetching of both API calls with a single command, and stores supplementary data in the `<ChoicesContext>`. `<ReferenceInput>` can provide choices to `<RadioButtonGroupInput>`, but also to [`<AutocompleteInput>`](./AutocompleteInput.md) and [`<SelectInput>`](./SelectInput.md). For further information, refer to [the `<ReferenceInput>` documentation](./ReferenceInput.md).
