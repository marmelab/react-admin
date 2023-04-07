---
layout: default
title: "The AutocompleteArrayInput Component"
---

# `<AutocompleteArrayInput>`

To let users choose multiple values in a list using a dropdown with autocompletion, use `<AutocompleteArrayInput>`.
It renders using MUI [Autocomplete](https://mui.com/components/autocomplete/).

<video controls autoplay muted loop>
  <source src="./img/autocomplete-array-input.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>


This input allows editing values that are arrays of scalar values, e.g. `[123, 456]`. 

**Tip**: React-admin includes other components allowing the edition of such values:

- [`<SelectArrayInput>`](./SelectArrayInput.md) renders a dropdown list of choices
- [`<CheckboxGroupInput>`](./CheckboxGroupInput.md) renders a list of checkbox options
- [`<DualListInput>`](./DualListInput.md) renders a list of choices that can be moved from one list to another

**Tip**: `<AutocompleteArrayInput>` is a stateless component, so it only allows to *filter* the list of choices, not to *extend* it. If you need to populate the list of choices based on the result from a `fetch` call (and if [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) doesn't cover your need), you'll have to [write your own Input component](./Inputs.md#writing-your-own-input-component) based on MUI `<Autocomplete>` component.

## Usage

In addition to the `source`, `<AutocompleteArrayInput>` requires one prop: the `choices` listing the possible values.

```jsx
import { AutocompleteArrayInput } from 'react-admin';

<AutocompleteArrayInput source="roles" choices={[
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
]} />
```

By default, the possible choices are built from the `choices` prop, using:
  - the `id` field as the option value,
  - the `name` field as the option text

The form value for the source must be an array of the selected values, e.g.

```js
{
    id: 123,
    name: 'John Doe',
    roles: ['u001', 'u003'],
}
```

## Props

| Prop                       | Required | Type                  | Default                  | Description                                                                                                                                                                                                                                                                                                      |
|----------------------------|----------|-----------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `choices`                  | Required | `Object[]`            | -                        | List of choices                                                   |
| `create`                   | Optional | `Element`             | `-`                      | A React Element to render when users want to create a new choice                                                                       |
| `createLabel`              | Optional | `string`              | `ra.action. create`       | The label for the menu item allowing users to create a new choice. Used when the filter is empty                                       |
| `createItemLabel`          | Optional | `string`              | `ra.action .create_item` | The label for the menu item allowing users to create a new choice. Used when the filter is not empty                                                    |
| `debounce`                 | Optional | `number`              | `250`                    | The delay to wait before calling the setFilter function injected when used in a ReferenceArray Input.                                                         |
| `emptyText`                | Optional | `string`              | `''`                     | The text to use for the empty element                                                                                                                   |
| `emptyValue`               | Optional | `any`                 | `''`                     | The value to use for the empty element                                                                                                                  |
| `filterToQuery`            | Optional | `string` => `Object`  | `q => ({ q })`           | How to transform the searchText into a parameter for the data provider                                                                                  |
| `inputText`                | Optional | `Function`            | `-`                      | Required if `optionText` is a custom Component, this function must return the text displayed for the current selection.                                 |
| `matchSuggestion`          | Optional | `Function`            | `-`                      | Required if `optionText` is a React element. Function returning a boolean indicating whether a choice matches the filter. `(filter, choice) => boolean` |
| `onCreate`                 | Optional | `Function`            | `-`                      | A function called with the current filter value when users choose to create a new choice.                                                               |
| `optionText`               | Optional | `string` &#124; `Function` &#124; `Component` | `name` | Field name of record to display in the suggestion item or function which accepts the correct record as argument (`(record)=> {string}`)           |
| `optionValue`              | Optional | `string`              | `id`                     | Field name of record containing the value to use as input value                                                                                         |
| `setFilter`                | Optional | `Function`            | `null`                   | A callback to inform the `searchText` has changed and new `choices` can be retrieved based on this `searchText`. Signature `searchText => void`. This function is automatically set up when using `ReferenceArray Input`. |
| `shouldRender Suggestions` | Optional | `Function`            | `() => true`             | A function that returns a `boolean` to determine whether or not suggestions are rendered.  |
| `suggestionLimit`          | Optional | `number`              | `null`                   | Limits the numbers of suggestions that are shown in the dropdown list                                                                                   |
| `translateChoice` | Optional | `boolean`                  | `true`             | Whether the choices should be translated                                                                                               |


`<AutocompleteArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

The list of choices must be an array of objects - one object for each possible choice. In each object, `id` is the value, and the `name` is the label displayed to the user.

```jsx
<AutocompleteArrayInput source="roles" choices={[
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
]} />
```

You can also use an array of objects with different properties for the label and value, given you specify the [`optionText`](#optiontext) and [`optionValue`](#optionvalue) props:

```jsx
<AutocompleteArrayInput source="roles" choices={[
    { _id: 'admin', label: 'Admin' },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
]} optionValue="_id" optionText="label" />
```

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
    { id: 'admin', name: 'myroot.roles.admin' },
    { id: 'u001', name: 'myroot.roles.u001' },
    { id: 'u002', name: 'myroot.roles.u002' },
    { id: 'u003', name: 'myroot.roles.u003' },
];
```

You can opt-out of this translation by setting [the `translateChoice` prop](#translatechoice) to `false`.

If you need to *fetch* the options from another resource, you're actually editing a one-to-many or a many-to-many relationship. In this case, wrap the `<AutocompleteArrayInput>` in a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) or a [`<ReferenceManyToManyInput>`](./ReferenceManyToManyInput.md) component. You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <AutocompleteArrayInput />
</ReferenceArrayInput>
```

If you have an *array of values* for the options, turn it into an array of objects with the `id` and `name` properties:

```jsx
const possibleValues = ['programming', 'lifestyle', 'photography'];
const ucfirst = name => name.charAt(0).toUpperCase() + name.slice(1);
const choices = possibleValues.map(value => ({ id: value, name: ucfirst(value) }));

<AutocompleteArrayInput source="roles" choices={choices} />
```

## `create`

To allow users to add new options, pass a React element as the `create` prop. `<AutocompleteArrayInput>` will then render a "Create" option at the bottom of the choices list. When clicked, it will render the create element.

<video controls autoplay muted loop>
  <source src="./img/autocomplete-array-input-create.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>


{% raw %}
```jsx
import { CreateRole } from './CreateRole';

const choices = [
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
];

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <SelectArrayInput
                source="roles"
                choices={choices}
                create={<CreateRole />}
            />
        </SimpleForm>
    </Create>
);

// in ./CreateRole.js
import { useCreateSuggestionContext } from 'react-admin';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';

const CreateRole = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');

    const handleSubmit = event => {
        event.preventDefault();
        const newOption = { id: value, name: value };
        choices.push(newOption);
        setValue('');
        onCreate(newOption);
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Role name"
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

If you just need to ask users for a single string to create the new option, you can use [the `onCreate` prop](#oncreate) instead.

If you're in a `<ReferenceArrayInput>` or `<ReferenceManyToManyInput>`, the `handleSubmit` will need to create a new record in the related resource. Check the [Creating New Choices](#creating-new-choices) for an example. 

## `debounce`

When used inside a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), `<AutocompleteArrayInput>` will call `dataProvider.getList()` with the current input value as filter after a delay of 250ms. This is to avoid calling the API too often while users are typing their query.

This delay can be customized by setting the `debounce` prop.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <AutocompleteArrayInput debounce={500} />
</ReferenceArrayInput>
```

## `emptyText`

If the input isn't required (using `validate={required()}`), and you need a choice to represent the empty value, set `emptyText` prop and a choice will be added at the top, with its value as label.

```jsx
<AutocompleteArrayInput source="roles" choices={choices} emptyText="No role" />
```

The `emptyText` prop accepts either a string or a React Element.

And if you want to hide that empty choice, make the input required. 

```jsx
<AutocompleteArrayInput source="roles" choices={choices} validate={required()} />
```

## `emptyValue`

If the input isn't required (using `validate={required()}`), users can select an empty choice. The default value for that empty choice is the empty string (`''`), or `null` if the input is inside a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md).

You can override this value with the `emptyValue` prop.

```jsx
<AutocompleteArrayInput source="roles" choices={choices} emptyValue={0} />
```

**Tip**: While you can set `emptyValue` to a non-string value (e.g. `0`), you cannot use `null` or `undefined`, as it would turn the `<AutocompleteArrayInput>` into an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html). If you need the empty choice to be stored as `null` or `undefined`, use [the `parse` prop](./Inputs.md#parse) to convert the default empty value ('') to `null` or `undefined`, or use [the `sanitizeEmptyValues` prop](./SimpleForm.md#sanitizeemptyvalues) on the Form component. 

## `filterToQuery`

When used inside a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), whenever users type a string in the autocomplete input, `<AutocompleteArrayInput>` calls `dataProvider.getList()` using the string as filter, to return a filtered list of possible options from the reference resource. This filter is built using the `filterToQuery` prop.

By default, the filter is built using the `q` parameter. This means that if the user types the string 'lorem', the filter will be `{ q: 'lorem' }`.

You can customize the filter by setting the `filterToQuery` prop. It should be a function that returns a filter object. 

```jsx
const filterToQuery = searchText => ({ name_ilike: `%${searchText}%` });

<ReferenceArrayInput source="tag_ids" reference="tags">
    <AutocompleteArrayInput filterToQuery={filterToQuery} />
</ReferenceArrayInput>
```

## `onCreate`

Use the `onCreate` prop to allow users to create new options on-the-fly. Its value must be a function. This lets you render a `prompt` to ask users about the new value. You can return either the new choice directly or a Promise resolving to the new choice.

{% raw %}
```js
import { AutocompleteArrayInput, Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = () => {
    const categories = [
        { name: 'Tech', id: 'tech' },
        { name: 'Lifestyle', id: 'lifestyle' },
    ];
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <AutocompleteArrayInput
                    onCreate={() => {
                        const newCategoryName = prompt('Enter a new category');
                        const newCategory = { id: newCategoryName.toLowerCase(), name: newCategoryName };
                        categories.push(newCategory);
                        return newCategory;
                    }}
                    source="category_ids"
                    choices={categories}
                />
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

If a prompt is not enough, you can use [the `create` prop](#create) to render a custom component instead.

## `optionText`

You can customize the properties to use for the option name (instead of the default `name`) thanks to the `optionText` prop:

```jsx
const choices = [
    { id: 'admin', label: 'Admin' },
    { id: 'u001', label: 'Editor' },
    { id: 'u002', label: 'Moderator' },
    { id: 'u003', label: 'Reviewer' },
];
<AutocompleteArrayInput source="roles" choices={choices} optionText="label" />
```

`optionText` is especially useful when the choices are records coming from a `<ReferenceArrayInput>` or a `<ReferenceManyToManyInput>`. By default, react-admin uses the [`recordRepresentation`](./Resource.md#recordrepresentation) function to display the record label. But if you set the `optionText` prop, react-admin will use it instead.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <AutocompleteArrayInput optionText="tag" />
</ReferenceArrayInput>
```

`optionText` also accepts a function, so you can shape the option text based on the entire choice object:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;

<AutocompleteArrayInput source="authors" choices={choices} optionText={optionRenderer} />
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

<AutocompleteArrayInput source="authors" choices={choices} optionText={<FullNameField />}/>
```

## `optionValue`

You can customize the properties to use for the option value (instead of the default `id`) thanks to the `optionValue` prop:

```jsx
const choices = [
    { _id: 'admin', name: 'Admin' },
    { _id: 'u001', name: 'Editor' },
    { _id: 'u002', name: 'Moderator' },
    { _id: 'u003', name: 'Reviewer' },
];
<AutocompleteArrayInput source="roles" choices={choices} optionValue="_id" />
```

## `shouldRenderSuggestions`

When dealing with a large amount of `choices` you may need to limit the number of suggestions that are rendered in order to maintain acceptable performance. `shouldRenderSuggestions` is an optional prop that allows you to set conditions on when to render suggestions. An easy way to improve performance would be to skip rendering until the user has entered 2 or 3 characters in the search box. This lowers the result set significantly and might be all you need (depending on your data set).

```jsx
<AutocompleteArrayInput 
    source="roles"
    choices={choices}
    shouldRenderSuggestions={(val) => { return val.trim().length > 2 }}
/>
```

## `suggestionLimit`

The `choices` prop can be very large, and rendering all of them would be very slow. To limit the number of suggestions displayed at any time, set the `suggestionLimit` prop:

```jsx
<AutocompleteArrayInput
    source="roles"
    choices={choices}
    suggestionLimit={10}
/>
```

If you're using `<AutocompleteArrayInput>` inside a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), limit the number of choices returned by the API instead, using the `perPage` prop of the `<ReferenceArrayInput>`.

```jsx
<ReferenceArrayInput source="category_ids" reference="categories" perPage={10}>
    <AutocompleteArrayInput />
</ReferenceArrayInput>
```

## `sx`: CSS API

The `<AutocompleteArrayInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)).

`<AutocompleteArrayInput>` renders an [`<AutocompleteInput>`](./AutocompleteInput.md) and reuses its styles. To override the style of all instances of `<AutocompleteInput>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaAutocompleteInput` key.

Refer to the [MUI `<Autocomplete>` component](https://mui.com/components/autocomplete/) to know its CSS API.

## `translateChoice`

The choices are translated by default, so you can use translation identifiers as choices:

```jsx
const choices = [
    { id: 'admin', name: 'myroot.roles.admin' },
    { id: 'u001', name: 'myroot.roles.u001' },
    { id: 'u002', name: 'myroot.roles.u002' },
    { id: 'u003', name: 'myroot.roles.u003' },
];
```

However, in some cases (e.g. inside a `<ReferenceArrayInput>`), you may not want the choice to be translated.
In that case, set the `translateChoice` prop to `false`.

```jsx
<AutocompleteArrayInput source="roles" choices={choices} translateChoice={false}/>
```

## Additional Props

`<AutocompleteArrayInput>` renders a [MUI `<Autocomplete>` component](https://mui.com/components/autocomplete/) and accepts the `<Autocomplete>` props:

{% raw %}
```jsx
<AutocompleteArrayInput source="category" limitTags={2} />
```
{% endraw %}

**Tip**: Like many other inputs, `<AutocompleteArrayInput>` accept a `fullWidth` prop.

**Tip**: To use the `disableCloseOnSelect` prop, you must also set `blurOnSelect={false}`, since this is enabled by default.

## Using In A ReferenceArrayInput

If you want to populate the `choices` attribute with a list of related records, you should decorate `<AutocompleteArrayInput>` with [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), and leave the `choices` empty:

```jsx
import { AutocompleteArrayInput, ReferenceArrayInput } from 'react-admin';

<ReferenceArrayInput label="Tags" reference="tags" source="tags">
    <AutocompleteArrayInput />
</ReferenceArrayInput>
```

## Working With Object Values

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

## Using A Custom Element For Options

You can pass a custom element as [`optionText`](#optiontext) to have `<AutocompleteArrayInput>` render each suggestion in a custom way.

`<AutocompleteArrayInput>` will render the custom option element inside a [`<RecordContext>`](./useRecordContext.md), using the related choice as the `record` prop. You can use Field components there.

However, as the underlying MUI `<Autocomplete>` component requires that the current selection is a string, you must also pass a function as the `inputText` prop. This function should return a text representation of the current selection. You should also pass a `matchSuggestion` function to filter the choices based on the current selection.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi', avatar:'/penguin' },
   { id: 456, first_name: 'Jane', last_name: 'Austen', avatar:'/panda' },
];
const OptionRenderer = () => {
    const record = useRecordContext();
    return (
        <span>
            <img src={record.avatar} />
            {record.first_name} {record.last_name}
        </span>
    );
};
const inputText = choice => `${choice.first_name} ${choice.last_name}`;
const matchSuggestion = (filter, choice) => {
    return (
        choice.first_name.toLowerCase().includes(filter.toLowerCase())
        || choice.last_name.toLowerCase().includes(filter.toLowerCase())
    );
};

<AutocompleteArrayInput
    source="author_ids"
    choices={choices}
    optionText={<OptionRenderer />}
    inputText={inputText}
    matchSuggestion={matchSuggestion}
/>
```

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
                onSuccess: (data) => {
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

