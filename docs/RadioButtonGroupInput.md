---
layout: default
title: "The RadioButtonGroupInput Component"
---

# `<RadioButtonGroupInput>`

If you want to let the user choose a value among a list of possible values that are always shown (instead of hiding them behind a dropdown list, as in [`<SelectInput>`](./SelectInput.md)), `<RadioButtonGroupInput>` is the right component.

![RadioButtonGroupInput](./img/radio-button-group-input.gif)

Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```jsx
import { RadioButtonGroupInput } from 'react-admin';

<RadioButtonGroupInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

## Properties

| Prop              | Required | Type                       | Default | Description                                                                                                                            |
| ----------------- | -------- | -------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`         | Required | `Object[]`                 | -       | List of items to show as options                                                                                                       |
| `options`         | Optional | `Object`                   | -       | Props to pass to the underlying `<RadioButtonGroup>` element                                                                           |
| `optionText`      | Optional | `string` &#124; `Function` | `name`  | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`     | Optional | `string`                   | `id`    | Field name of record containing the value to use as input value                                                                        |
| `row`             | Optional | `boolean`                  | `true`  | Display options in a compact row.                                                                                                      |
| `translateChoice` | Optional | `boolean`                  | `true`  | Whether the choices should be translated                                                                                               |

`<RadioButtonGroupInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

You can customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
];
<RadioButtonGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<RadioButtonGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
```

`optionText` also accepts a React Element, that will be cloned and receive the related choice as the `record` prop. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
<RadioButtonGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
```

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
   { id: 'M', name: 'myroot.gender.male' },
   { id: 'F', name: 'myroot.gender.female' },
];
```

However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want the choice to be translated. In that case, set the `translateChoice` prop to `false`.

```jsx
<RadioButtonGroupInput source="gender" choices={choices} translateChoice={false}/>
```

Lastly, use the `options` attribute if you want to override any of Material UI's `<RadioButtonGroup>` attributes:

{% raw %}
```jsx
<RadioButtonGroupInput source="category" options={{
    labelPosition: 'right'
}} />
```
{% endraw %}

Refer to [Material UI RadioGroup documentation](https://material-ui.com/api/radio-group) for more details.

**Tip**: If you want to populate the `choices` attribute with a list of related records, you should decorate `<RadioButtonGroupInput>` with [`<ReferenceInput>`](./ReferenceInput.md), and leave the `choices` empty:

```jsx
import { RadioButtonGroupInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <RadioButtonGroupInput optionText="last_name" />
</ReferenceInput>
```

## `sx`: CSS API

The `<RadioButtonGroupInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                          | Description                                                   |
|------------------------------------|---------------------------------------------------------------|
| `& .RaRadioButtonGroupInput-label` | Applied to the underlying Material UI's `FormLabel` component |

To override the style of all instances of `<RadioButtonGroupInput>` using the [material-ui style overrides](https://mui.com/customization/globals/#css), use the `RaRadioButtonGroupInput` key.
