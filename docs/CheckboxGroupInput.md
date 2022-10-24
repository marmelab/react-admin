---
layout: default
title: "The CheckboxGroupInput Component"
---

# `<CheckboxGroupInput>`

If you want to let the user choose multiple values among a list of possible values by showing them all, `<CheckboxGroupInput>` is the right component.

![CheckboxGroupInput](./img/checkbox-group-input.png)

This input allows editing values that are arrays of scalar value, e.g. `[123, 456]`. 

**Tip**: React-admin includes other components allowing the edition of such values:

- [`<SelectArrayInput>`](./SelectArrayInput.md) renders a dropdown list of choices
- [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) renders an autocomplete input of choices

And if you are looking for a way to edit a lost of embedded objects (e.g. `[{ id: 123, title: 'bar' }, { id: 456, title: 'baz' }]`), check the [`<ArrayInput>`](./ArrayInput.md) component.

## Usage

In addition to the `source`, `<CheckboxGroupInput>` requires one prop: the `choices` listing the possible values:

```jsx
import { CheckboxGroupInput } from 'react-admin';

<CheckboxGroupInput source="categories" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

By default, the possible choices are built from the `choices` prop, using:
  - the `id` field as the option value,
  - the `name` field as the option text

  The form value for the source must be an array of the selected values, e.g.

```js
{
    "id": 123,
    "categories": ["programming", "photography"],
}
```

If you need to *fetch*  the options from another retource, you're actually editing a one-to-many or a many-to-many relationship. In this case, wrap the `<CheckboxGroupInput>` in a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) or a [`<ReferenceManyToManyInput>`](./ReferenceManyToManyInput.md) component. You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <CheckboxGroupInput />
</ReferenceArrayInput>
```

## Props

| Prop          | Required | Type                       | Default | Description                                                                                                                            |
| ------------- | -------- | -------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------  |
| `choices`     | Required | `Object[]`                 | -       | List of choices                                                                                                                        |
| `labelPlacement` | Optional | `"bottom" `&#124;`"end"`&#124;`"start"`&#124;`"top" ` | `"end"` | The position of the checkbox label.                                                                                                    |
| `options`     | Optional | `Object`                   | -       | Props to pass to the MUI `<CheckboxGroup>` component.  |
| `optionText`  | Optional | `string` &#124; `Function` | `name`  | Field name of record to display in the suggestion item or function which accepts the correct record as argument (`record => {string}`) |
| `optionValue` | Optional | `string`                   | `id`    | Field name of record containing the value to use as input value                                                                        |
| `row`         | Optional | `boolean`                  | `true`  | Display group of elements in a compact row.                                                                                            |
| `translateChoice` | Optional | `boolean`              | `true`  | Whether the choices should be translated                                                                                               |

`<CheckboxGroupInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

The list of choices is an array of objects with an `id` and a `name` property. The `id` is the value of the input, and the `name` is the label displayed to the user.

```jsx
<CheckboxGroupInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

You can also use an array of objects with different properties for the `id` and the `name`, given you specify the `optionText` and `optionValue` props:

```jsx
<CheckboxGroupInput source="category" choices={[
    { value: 123, label: 'Programming' },
    { value: 456, label: 'Lifestyle' },
    { value: 789, label: 'Photography' },
]} optionValue="value" optionText="label" />
```

## `labelPlacement`

By default, this inputs renders a checkox and a label for each choice, with the label on the right of the checkbox. You can change this behavior with the `labelPlacement` prop:

```jsx
<CheckboxGroupInput source="options" choices={choices} labelPlacement="bottom" />
```

![labelPlacement bottom](./img/CheckboxGroupInput-labelPlacement.png)

## `optionText`

You can customize the properties to use for the option name (instead of the default `name`) thanks to the `optionText` prop:

```jsx
const choices = [
    { id: 123, full_name: 'Leo Tolstoi' },
    { id: 456, full_name: 'Jane Austen' },
];
<CheckboxGroupInput source="author_id" choices={choices} optionText="full_name" />
```

`optionText` also accepts a function, so you can shape the option text based on the entire choice object:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<CheckboxGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
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

<CheckboxGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
```

## `optionValue`

You can customize the properties to use for the option value (instead of the default `_id`) thanks to the `optionValue` prop:

```jsx
const choices = [
    { _id: 123, name: 'Leo Tolstoi' },
    { _id: 456, name: 'Jane Austen' },
];
<CheckboxGroupInput source="author_id" choices={choices} optionValue="_id" />
```

## `row`

By default, the checkboxes are displayed in a row. You can change that an let react-admin render one choice per row by setting the `row` prop to `false`:

```jsx
<CheckboxGroupInput source="gender" choices={choices} row={false} />
```

![row bottom](./img/CheckboxGroupInput-row.png)

## `translateChoice`

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

## `options`

Use the `options` attribute if you want to override any of MUI's [MUI Checkbox documentation](https://mui.com/api/checkbox/) attributes:

{% raw %}
```jsx
import { FavoriteBorder, Favorite } from '@mui/icons-material';

<CheckboxGroupInput source="category" options={{
    icon: <FavoriteBorder />,
    checkedIcon: <Favorite />
}} />
```
{% endraw %}

![row bottom](./img/CheckboxGroupInput-options.png)

## `sx`: CSS API

The `<CheckboxGroupInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                       | Description                                              |
|---------------------------------|----------------------------------------------------------|
| `& .RaCheckboxGroupInput-label` | Applied to the underlying MUI's `FormLabel` component    |

To override the style of all instances of `<CheckboxGroupInput>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaCheckboxGroupInput` key.
