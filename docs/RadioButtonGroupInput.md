---
layout: default
title: "The RadioButtonGroupInput Component"
---

# `<RadioButtonGroupInput>`

If you want to let the user choose a value among a list of possible values that are always shown, `<RadioButtonGroupInput>` is the right component. It renders using [MUI's `<RadioGroup>`](https://mui.com/material-ui/react-radio-button/).

![RadioButtonGroupInput](./img/radio-button-group-input.gif)

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
| `choices`         | Optional | `Object[]`                 | -       | List of items to show as options. Required unless inside a ReferenceInput.                                                                                                        |
| `options`         | Optional | `Object`                   | -       | Props to pass to the underlying `<RadioButtonGroup>` element                                                                           |
| `optionText`      | Optional | `string` &#124; `Function` | `name`  | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`     | Optional | `string`                   | `id`    | Field name of record containing the value to use as input value                                                                        |
| `row`             | Optional | `boolean`                  | `true`  | Display options in a compact row.                                                                                                      |
| `translateChoice` | Optional | `boolean`                  | `true`  | Whether the choices should be translated                                                                                               |

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

See [Using in a `<ReferenceInput>`](#using-in-a-referenceinput) below for more information.

If you have an *array of values* for the options, turn it into an array of objects with the `id` and `name` properties:

```jsx
const possibleValues = ['tech', 'lifestyle', 'people'];
const ucfirst = name => name.charAt(0).toUpperCase() + name.slice(1);
const choices = possibleValues.map(value => ({ id: value, name: ucfirst(value) }));

<RadioButtonGroupInput source="category" choices={choices} />
```

## `options`

Use the `options` attribute if you want to override any of MUI's `<RadioGroup>` attributes:

{% raw %}
```jsx
<RadioButtonGroupInput
    source="category"
    choices={choices}
    options={{ labelPosition: 'right' }} />
```
{% endraw %}

Refer to [MUI RadioGroup documentation](https://mui.com/api/radio-group) for more details.

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

See [Using in a `<ReferenceInput>`](#using-in-a-referenceinput) below for more details.

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

## `row`

By default, the radio buttons are displayed in a row. You can change that and let react-admin render one choice per row by setting the `row` prop to `false`:

```jsx
<RadioButtonGroupInput source="category" choices={choices} row={false} />
```

![RadioButtonGroupInput row false](./img/radio-button-group-input-row.gif)

## `sx`: CSS API

The `<RadioButtonGroupInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                          | Description                                                   |
|------------------------------------|---------------------------------------------------------------|
| `& .RaRadioButtonGroupInput-label` | Applied to the underlying MUI's `FormLabel` component |

To override the style of all instances of `<RadioButtonGroupInput>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaRadioButtonGroupInput` key.

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

## Using In A ReferenceInput

If you want to populate the `choices` attribute with a list of related records, you should decorate `<RadioButtonGroupInput>` with [`<ReferenceInput>`](./ReferenceInput.md), and leave the `choices` empty:

```jsx
import { RadioButtonGroupInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <RadioButtonGroupInput />
</ReferenceInput>
```

In that case, `<RadioButtonGroupInput>` uses the [`recordRepresentation`](./Resource.md#recordrepresentation) to render each choice from the list of possible records. You can override this behavior by setting the `optionText` prop:

```jsx
import { RadioButtonGroupInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <RadioButtonGroupInput optionText="last_name" />
</ReferenceInput>
```