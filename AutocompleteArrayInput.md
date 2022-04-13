---
layout: default
title: "The AutocompleteArrayInput Component"
---

# `<AutocompleteArrayInput>`

To let users choose multiple values in a list using a dropdown with autocompletion, use `<AutocompleteArrayInput>`.
It renders using MUI [Autocomplete](https://mui.com/components/autocomplete/).

![AutocompleteArrayInput](./img/autocomplete-array-input.gif)

Set the `choices` attribute to determine the options list (with `id`, `name` tuples).

```jsx
import { AutocompleteArrayInput } from 'react-admin';

<AutocompleteArrayInput source="tags" choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

## Properties

| Prop                      | Required | Type                       | Default                 | Description                                                                                                                                                                                                                                                                                                 |
|---------------------------|----------|----------------------------|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `create`                  | Optional | `Element`                  | `-`                     | A React Element to render when users want to create a new choice                                                                                                                                                                                                                                            |
| `createLabel`             | Optional | `string`                   | `ra.action.create`      | The label for the menu item allowing users to create a new choice. Used when the filter is empty                                                                                                                                                                                                            |
| `createItemLabel`         | Optional | `string`                   | `ra.action.create_item` | The label for the menu item allowing users to create a new choice. Used when the filter is not empty                                                                                                                                                                                                        |
| `debounce`                | Optional | `number`                   | `250`                   | The delay to wait before calling the setFilter function injected when used in a ReferenceInput.                                                                                                                                                                                                             |
| `choices`                 | Required | `Object[]`                 | -                       | List of items to auto-suggest                                                                                                                                                                                                                                                                                |
| `inputText`               | Optional | `Function`                 | `-`                     | Required if `optionText` is a custom Component, this function must return the text displayed for the current selection.                                                                                                                                                                                     |
| `matchSuggestion`         | Optional | `Function`                 | -                       | Required if `optionText` is a React element. Function returning a boolean indicating whether a choice matches the filter. `(filter, choice) => boolean`                                                                                                                                                     |
| `onCreate`                | Optional | `Function`                 | `-`                     | A function called with the current filter value when users choose to create a new choice.                                                                                                                                                                                                                   |
| `optionValue`             | Optional | `string`                   | `id`                    | Field name of record containing the value to use as input value                                                                                                                                                                                                                                             |
| `optionText`              | Optional | `string` &#124; `Function` | `name`                  | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`)                                                                                                                                                                      |
| `setFilter`               | Optional | `Function`                 | `null`                  | A callback to inform the `searchText` has changed and new `choices` can be retrieved based on this `searchText`. Signature `searchText => void`. This function is automatically setup when using `ReferenceInput`.                                                                                          |
| `shouldRenderSuggestions` | Optional | `Function`                 | `() => true`            | A function that returns a `boolean` to determine whether or not suggestions are rendered. Use this when working with large collections of data to improve performance and user experience. This function is passed into the underlying react-autosuggest component. Ex.`(value) => value.trim().length > 2` |
| `source`                  | Required | `string`                   | -                       | Name of field to edit, its type should match the type retrieved from `optionValue`                                                                                                                                                                                                                          |
| `suggestionLimit`         | Optional | `number`                   | `null`                  | Limits the numbers of suggestions that are shown in the dropdown list                                                                                                                                                                                                                                       |

`<AutocompleteArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

`<AutocompleteArrayInput>` is designed to for fields containing an array of scalar values, e.g.:

```json
{
  "id": 123,
  "tags": ["lifestyle", "photography"]
}
```

When working with a field that contains an array of *objects*, use `parse` and `format` to turn the value into an array of scalar values.

So for instance, for editing the `tags` field of records looking like the following:

```json
{
  "id": 123,
  "tags": [
      { "id": "lifestyle" },
      { "id": "photography" }
   ] 
}
```

You should use the following syntax:

```jsx
import { AutocompleteArrayInput } from 'react-admin';

<AutocompleteArrayInput 
    source="tags"
    parse={value =>
        value && value.map(v => ({ id: v }))
    }
    format={value => value && value.map(v => v.id)}
    choices={[
        { id: 'programming', name: 'Programming' },
        { id: 'lifestyle', name: 'Lifestyle' },
        { id: 'photography', name: 'Photography' },
    ]}
/>
```

You can customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```jsx
const choices = [
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
];
<AutocompleteArrayInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<AutocompleteArrayInput source="author_id" choices={choices} optionText={optionRenderer} />
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
<AutocompleteArrayInput source="gender" choices={choices} translateChoice={false}/>
```

When dealing with a large amount of `choices` you may need to limit the number of suggestions that are rendered in order to maintain usable performance. The `shouldRenderSuggestions` is an optional prop that allows you to set conditions on when to render suggestions. An easy way to improve performance would be to skip rendering until the user has entered 2 or 3 characters in the search box. This lowers the result set significantly, and might be all you need (depending on your data set).
Ex. `<AutocompleteArrayInput shouldRenderSuggestions={(val) => { return val.trim().length > 2 }} />` would not render any suggestions until the 3rd character has been entered. This prop is passed to the underlying `react-autosuggest` component and is documented [here](https://github.com/moroshko/react-autosuggest#should-render-suggestions-prop).

Lastly, `<AutocompleteArrayInput>` renders a [MUI `<Autocomplete>` component](https://mui.com/components/autocomplete/) and accepts the `<Autocomplete>` props:

{% raw %}
```jsx
<AutocompleteArrayInput source="category" limitTags={2} />
```
{% endraw %}

**Tip**: Like many other inputs, `<AutocompleteArrayInput>` accept a `fullWidth` prop.

**Tip**: If you want to populate the `choices` attribute with a list of related records, you should decorate `<AutocompleteArrayInput>` with [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), and leave the `choices` empty:

```jsx
import { AutocompleteArrayInput, ReferenceArrayInput } from 'react-admin';

<ReferenceArrayInput label="Tags" reference="tags" source="tags">
    <AutocompleteArrayInput />
</ReferenceArrayInput>
```

**Tip**: `<ReferenceArrayInput>` is a stateless component, so it only allows to *filter* the list of choices, not to *extend* it. If you need to populate the list of choices based on the result from a `fetch` call (and if [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) doesn't cover your need), you'll have to [write your own Input component](./Inputs.md#writing-your-own-input-component) based on [material-ui-chip-input](https://github.com/TeamWertarbyte/material-ui-chip-input).

**Tip**: React-admin's `<AutocompleteInput>` has only a capital A, while MUI's `<AutoComplete>` has a capital A and a capital C. Don't mix up the components!

## Creating New Choices

The `<AutocompleteArrayInput>` can allow users to create a new choice if either the `create` or `onCreate` prop is provided.

Use the `onCreate` prop when you only require users to provide a simple string and a `prompt` is enough. You can return either the new choice directly or a Promise resolving to the new choice.

{% raw %}
```js
import { AutocompleteArrayInput, Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = () => {
    const tags = [
        { name: 'Tech', id: 'tech' },
        { name: 'Lifestyle', id: 'lifestyle' },
    ];
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <AutocompleteArrayInput
                    onCreate={() => {
                        const newTagName = prompt('Enter a new tag');
                        const newTag = { id: newTagName.toLowerCase(), name: newTagName };
                        tags.push(newTag);
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

Use the `create` prop when you want a more polished or complex UI. For example a MUI `<Dialog>` asking for multiple fields because the choices are from a referenced resource.

{% raw %}
```jsx
import {
    AutocompleteArrayInput,
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
                    <AutocompleteArrayInput create={<CreateTag />} />
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

This component doesn't apply any custom styles on top of [MUI `<Autocomplete>` component](https://mui.com/components/autocomplete/). Refer to their documentation to know its CSS API.
