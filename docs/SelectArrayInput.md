---
layout: default
title: "The SelectArrayInput Component"
---

# `<SelectArrayInput>`

To let users choose several values in a list using a dropdown, use `<SelectArrayInput>`. It renders using [MUI's `<Select>`](https://mui.com/api/select).

![SelectArrayInput](./img/select-array-input.gif)

## Properties

| Prop              | Required | Type                       | Default            | Description                                                                                                                            |
|-------------------|----------|----------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
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

`<SelectArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```jsx
import { SelectArrayInput } from 'react-admin';

<SelectArrayInput label="Tags" source="categories" choices={[
    { id: 'music', name: 'Music' },
    { id: 'photography', name: 'Photo' },
    { id: 'programming', name: 'Code' },
    { id: 'tech', name: 'Technology' },
    { id: 'sport', name: 'Sport' },
]} />
```

You can also customize the properties to use for the option name and value,
thanks to the `optionText` and `optionValue` attributes.

```jsx
const choices = [
   { _id: '1', name: 'Book', plural_name: 'Books' },
   { _id: '2', name: 'Video', plural_name: 'Videos' },
   { _id: '3', name: 'Audio', plural_name: 'Audios' },
];
<SelectArrayInput source="categories" choices={choices} optionText="plural_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: '1', name: 'Book', quantity: 23 },
   { id: '2', name: 'Video', quantity: 56 },
   { id: '3', name: 'Audio', quantity: 12 },
];
const optionRenderer = choice => `${choice.name} (${choice.quantity})`;
<SelectArrayInput source="categories" choices={choices} optionText={optionRenderer} />
```

The choices are translated by default, so you can use translation identifiers as choices:

```js
const choices = [
   { id: 'books', name: 'myroot.category.books' },
   { id: 'sport', name: 'myroot.category.sport' },
];
```

You can render any item as disabled by setting its `disabled` property to `true`:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
    { _id: 1, full_name: 'System Administrator', sex: 'F', disabled: true },
];
<SelectArrayInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

You can use a custom field name by setting the `disableValue` prop:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
    { _id: 987, full_name: 'Jack Harden', sex: 'M', not_available: true },
];
<SelectArrayInput source="contact_id" choices={choices} optionText="full_name" optionValue="_id" disableValue="not_available" />
```

Lastly, use the `options` attribute if you want to override any of the `<Select>` attributes:

{% raw %}
```jsx
<SelectArrayInput source="category" options={{ autoWidth: true }} />
```
{% endraw %}

Refer to [the Select documentation](https://mui.com/api/select) for more details.

The `SelectArrayInput` component **cannot** be used inside a `ReferenceInput` but can be used inside a `ReferenceArrayInput`.

```jsx
import * as React from "react";
import {
    ChipField,
    Create,
    DateInput,
    ReferenceArrayInput,
    SelectArrayInput,
    TextInput,
} from 'react-admin';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput multiline source="body" />
            <DateInput source="published_at" />

            <ReferenceArrayInput reference="tags" source="tags">
                <SelectArrayInput>
                    <ChipField source="name" />
                </SelectArrayInput>
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
```

**Tip**: As it does not provide autocompletion, the `SelectArrayInput` might not be suited when the referenced resource has a lot of items.

`<SelectArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Creating New Choices

The `<SelectArrayInput>` can allow users to create a new choice if either the `create` or `onCreate` prop is provided.

Use the `onCreate` prop when you only require users to provide a simple string and a `prompt` is enough. You can return either the new choice directly or a Promise resolving to the new choice.

{% raw %}
```js
import { SelectArrayInput, Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = () => {
    const tags = [
        { name: 'Tech', id: 'tech' },
        { name: 'Lifestyle', id: 'lifestyle' },
    ];
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <SelectArrayInput
                    onCreate={() => {
                        const newTagName = prompt('Enter a new tag');
                        const newTag = { id: newTagName.toLowerCase(), name: newTagName };
                        categories.push(newTag);
                        return newTag;
                    }}
                    source="tags"
                    choices={tags}
                />
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

Use the `create` prop when you want a more polished or complex UI. For example a MUI  `<Dialog>` asking for multiple fields because the choices are from a referenced resource.

{% raw %}
```jsx
import {
    SelectArrayInput,
    Create,
    ReferenceArrayInput,
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
} from '@mui/material';

const PostCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <ReferenceArrayInput source="tags" reference="tags">
                    <SelectArrayInput create={<CreateTag />} />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
}

const CreateTag = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate();

    const handleSubmit = event => {
        event.preventDefault();
        create(
          'tags',
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
                        label="New tag"
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

The `<SelectArrayInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI  components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                     | Description                                                                        |
|-------------------------------|------------------------------------------------------------------------------------|
| `&.RaSelectArrayInput-root`   | Applied to the root element                                                        |
| `& .RaSelectArrayInput-chip`  | Applied to each MUI 's `Chip` component used as selected item               |
| `& .RaSelectArrayInput-chips` | Applied to the container of MUI 's `Chip` components used as selected items |

To override the style of all instances of `<SelectArrayInput>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaSelectArrayInput` key.
