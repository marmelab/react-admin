---
layout: default
title: "The SelectInput Component"
---

# `<SelectInput>`

To let users choose a value in a list using a dropdown, use `<SelectInput>`. It renders using [Material ui's `<Select>`](https://material-ui.com/api/select).

![SelectInput](./img/select-input.gif)

Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```jsx
import { SelectInput } from 'react-admin';

<SelectInput source="category" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

## Properties

| Prop              | Required | Type                       | Default            | Description                                                                                                                            |
|-------------------|----------|----------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `allowEmpty`      | Optional | `boolean`                  | `false`            | If true, the first option is an empty one                                                                                              |
| `choices`         | Required | `Object[]`                 | -                  | List of items to show as options                                                                                                       |
| `create`          | Optional | `Element`                  | `-`                | A React Element to render when users want to create a new choice                                                                       |
| `createLabel`     | Optional | `string`                   | `ra.action.create` | The label for the menu item allowing users to create a new choice. Used when the filter is empty                                       |
| `emptyText`       | Optional | `string`                   | ''                 | The text to display for the empty option                                                                                               |
| `onCreate`        | Optional | `Function`                 | `-`                | A function called with the current filter value when users choose to create a new choice.                                              |
| `options`         | Optional | `Object`                   | -                  | Props to pass to the underlying `<SelectInput>` element                                                                                |
| `optionText`      | Optional | `string` &#124; `Function` | `name`             | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`     | Optional | `string`                   | `id`               | Field name of record containing the value to use as input value                                                                        |
| `resettable`      | Optional | `boolean`                  | `false`            | If `true`, display a button to reset the changes in this input value                                                                   |
| `translateChoice` | Optional | `boolean`                  | `true`             | Whether the choices should be translated                                                                                               |

`<SelectInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

You can customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
];
<SelectInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<SelectInput source="author_id" choices={choices} optionText={optionRenderer} />
```

`optionText` also accepts a React Element, that will be cloned and receive the related choice as the `record` prop. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
<SelectInput source="gender" choices={choices} optionText={<FullNameField />}/>
```

Enabling the `allowEmpty` props adds an empty choice (with a default `''` value, which you can overwrite with the `emptyValue` prop) on top of the options. You can furthermore customize the `MenuItem` for the empty choice by using the `emptyText` prop, which can receive either a string or a React Element, which doesn't receive any props.

```jsx
<SelectInput source="category" allowEmpty emptyValue={null} choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
   { id: 'M', name: 'myroot.gender.male' },
   { id: 'F', name: 'myroot.gender.female' },
];
```

However, in some cases, you may not want the choice to be translated. In that case, set the `translateChoice` prop to `false`.

```jsx
<SelectInput source="gender" choices={choices} translateChoice={false}/>
```

Note that `translateChoice` is set to `false` when `<SelectInput>` is a child of `<ReferenceInput>`.

Lastly, use the `options` attribute if you want to override any of Material UI's `<SelectField>` attributes:

{% raw %}
```jsx
<SelectInput source="category" options={{
    maxHeight: 200
}} />
```
{% endraw %}

Refer to [Material UI Select documentation](https://material-ui.com/api/select) for more details.

**Tip**: If you want to populate the `choices` attribute with a list of related records, you should decorate `<SelectInput>` with [`<ReferenceInput>`](./ReferenceInput.md), and leave the `choices` empty:

```jsx
import { SelectInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <SelectInput optionText="last_name" />
</ReferenceInput>
```

If, instead of showing choices as a dropdown list, you prefer to display them as a list of radio buttons, try the [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md). And if the list is too big, prefer the [`<AutocompleteInput>`](./AutocompleteInput.md).

You can make the `SelectInput` component resettable using the `resettable` prop. This will add a reset button which will be displayed only when the field has a value.

![resettable SelectInput](./img/resettable-select-input.png)

You can set disabled values by setting the `disabled` property of one item:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
    { _id: 1, full_name: 'System Administrator', sex: 'F', disabled: true },
];
<SelectInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

You can use a custom field name by setting `disableValue` prop:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
    { _id: 987, full_name: 'Jack Harden', sex: 'M', not_available: true },
];
<SelectInput source="contact_id" choices={choices} optionText="full_name" optionValue="_id" disableValue="not_available" />
```

## Creating New Choices

The `<SelectInput>` can allow users to create a new choice if either the `create` or `onCreate` prop is provided.

Use the `onCreate` prop when you only require users to provide a simple string and a `prompt` is enough. You can return either the new choice directly or a Promise resolving to the new choice.

{% raw %}
```js
import { SelectInput, Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = () => {
    const categories = [
        { name: 'Tech', id: 'tech' },
        { name: 'Lifestyle', id: 'lifestyle' },
    ];
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <SelectInput
                    onCreate={() => {
                        const newCategoryName = prompt('Enter a new category');
                        const newCategory = { id: newCategoryName.toLowerCase(), name: newCategoryName };
                        categories.push(newCategory);
                        return newCategory;
                    }}
                    source="category"
                    choices={categories}
                />
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

Use the `create` prop when you want a more polished or complex UI. For example a Material UI `<Dialog>` asking for multiple fields because the choices are from a referenced resource.

{% raw %}
```jsx
import {
    SelectInput,
    Create,
    ReferenceInput,
    SimpleForm,
    TextInput,
    useCreate,
    useCreateSuggestionContext
} from 'react-admin';

import {
    Box,
    BoxProps,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@material-ui/core';

const PostCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <ReferenceInput source="category_id" reference="categories">
                    <SelectInput create={<CreateCategory />} />
                </ReferenceInput>
            </SimpleForm>
        </Create>
    );
}

const CreateCategory = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate();

    const handleSubmit = event => {
        event.preventDefault();
        create(
          'categories',
          {
              data: {
                  title: value,
              },
          },
          {
              onSuccess: ({ data }) => {
                  setValue('');
                  onCreate(data);
              },
          }
        );
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="New category name"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
```
{% endraw %}

## `sx`: CSS API

The `<SelectInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                | Description                                               |
|--------------------------|-----------------------------------------------------------|
| `& .RaSelectInput-input` | Applied to the underlying `ResettableTextField` component |

To override the style of all instances of `<SelectInput>` using the [material-ui style overrides](https://material-ui.com/customization/globals/#css), use the `RaSelectInput` key.
