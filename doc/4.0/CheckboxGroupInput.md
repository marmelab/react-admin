---
layout: default
title: "The CheckboxGroupInput Component"
---

# `<CheckboxGroupInput>`

If you want to let the user choose multiple values among a list of possible values by showing them all, `<CheckboxGroupInput>` is the right component.

![CheckboxGroupInput](./img/checkbox-group-input.png)

Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```jsx
import { CheckboxGroupInput } from 'react-admin';

<CheckboxGroupInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

## Properties

| Prop          | Required | Type                       | Default | Description                                                                                                                            |
| ------------- | -------- | -------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------  |
| `choices`     | Required | `Object[]`                 | -       | List of choices                                                                                                                        |
| `optionText`  | Optional | `string` &#124; `Function` | `name`  | Field name of record to display in the suggestion item or function which accepts the correct record as argument (`record => {string}`) |
| `optionValue` | Optional | `string`                   | `id`    | Field name of record containing the value to use as input value                                                                        |
| `row`         | Optional | `boolean`                  | `true`  | Display group of elements in a compact row.                                                                                            |

Refer to [Material UI Checkbox documentation](https://material-ui.com/api/checkbox/) for more details.

`<CheckboxGroupInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

You can customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
];
<CheckboxGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<CheckboxGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
```

`optionText` also accepts a React Element, that will be cloned and receive the related choice as the `record` prop. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
<CheckboxGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
```

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
    { id: 'programming', name: 'myroot.category.programming' },
    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
    { id: 'photography', name: 'myroot.category.photography' },
];
```

However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want the choice to be translated. In that case, set the `translateChoice` prop to `false`.

```jsx
<CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
```

Lastly, use the `options` attribute if you want to override any of Material UI's `<Checkbox>` attributes:

{% raw %}
```jsx
import { FavoriteBorder, Favorite } from '@material-ui/icons';

<CheckboxGroupInput source="category" options={{
    icon: <FavoriteBorder />,
    checkedIcon: <Favorite />
}} />
```
{% endraw %}

## `sx`: CSS API

The `<CheckboxGroupInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                       | Description                                                   |
|---------------------------------|---------------------------------------------------------------|
| `&.RaCheckboxGroupInput-root`   | Applied to the root element                                   |
| `& .RaCheckboxGroupInput-label` | Applied to the underlying Material UI's `FormLabel` component |

To override the style of all instances of `<CheckboxGroupInput>` using the [material-ui style overrides](https://mui.com/customization/globals/#css), use the `RaCheckboxGroupInput` key.
