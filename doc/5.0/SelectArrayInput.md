---
layout: default
title: "The SelectArrayInput Component"
---

# `<SelectArrayInput>`

To let users choose several values in a list using a dropdown, use `<SelectArrayInput>`. It renders using [Material UI's `<Select>`](https://mui.com/api/select).

<video controls autoplay playsinline muted loop>
  <source src="./img/select-array-input.webm" type="video/webm"/>
  <source src="./img/select-array-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


This input allows editing values that are arrays of scalar values, e.g. `[123, 456]`. 

**Tip**: React-admin includes other components allowing the edition of such values:

- [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) renders an Autocomplete
- [`<CheckboxGroupInput>`](./CheckboxGroupInput.md) renders a list of checkbox options
- [`<DualListInput>`](./DualListInput.md) renders a list of choices that can be moved from one list to another

## Usage

In addition to the `source`, `<SelectArrayInput>` requires one prop: the `choices` listing the possible values.

```jsx
import { SelectArrayInput } from 'react-admin';

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <SelectArrayInput source="roles" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]} />
        </SimpleForm>
    </Create>
);
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

| Prop              | Required | Type                       | Default            | Description                                                                                                                            |
|-------------------|----------|----------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `choices`         | Optional | `Object[]`                 | -                  | List of items to show as options. Required unless inside a ReferenceArray Input.                                                                                                       |
| `create`          | Optional | `Element`                  | -                  | A React Element to render when users want to create a new choice                                                                       |
| `createLabel`     | Optional | `string`                   | `ra.action. create` | The label for the menu item allowing users to create a new choice. Used when the filter is empty                                       |
| `disableValue`    | Optional | `string`                   | 'disabled'         | The custom field name used in `choices` to disable some choices                                                                        |
| `onCreate`        | Optional | `Function`                 | -                  | A function called with the current filter value when users choose to create a new choice.                                              |
| `options`         | Optional | `Object`                   | -                  | Props to pass to the underlying `<SelectInput>` element                                                                                |
| `optionText`      | Optional | `string` &#124; `Function` | `name`             | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`     | Optional | `string`                   | `id`               | Field name of record containing the value to use as input value                                                                        |
| `translateChoice` | Optional | `boolean`                  | `true`             | Whether the choices should be translated                                                                                               |

`<SelectArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

The list of choices must be an array of objects - one object for each possible choice. In each object, `id` is the value, and the `name` is the label displayed to the user.

```jsx
<SelectArrayInput source="roles" choices={[
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
]} />
```

You can render some options as disabled by setting the `disabled` field in some choices:

```jsx
<SelectArrayInput source="roles" choices={[
    { _id: 'admin', label: 'Admin', disabled: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
]}  />
```

You can also use an array of objects with different properties for the label and value, given you specify the [`optionText`](#optiontext) and [`optionValue`](#optionvalue) props:

```jsx
<SelectArrayInput source="roles" choices={[
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

If you need to *fetch* the options from another resource, you're actually editing a one-to-many or a many-to-many relationship. In this case, wrap the `<SelectArrayInput>` in a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) or a [`<ReferenceManyToManyInput>`](./ReferenceManyToManyInput.md) component. You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <SelectArrayInput />
</ReferenceArrayInput>
```

If you have an *array of values* for the options, turn it into an array of objects with the `id` and `name` properties:

```jsx
const possibleValues = ['programming', 'lifestyle', 'photography'];
const ucfirst = name => name.charAt(0).toUpperCase() + name.slice(1);
const choices = possibleValues.map(value => ({ id: value, name: ucfirst(value) }));

<SelectArrayInput source="roles" choices={choices} />
```

## `create`

To allow users to add new options, pass a React element as the `create` prop. `<SelectArrayInput>` will then render a "Create" option at the bottom of the choices list. When clicked, it will render the create element.

<video controls autoplay playsinline muted loop>
  <source src="./img/select-array-input-create.webm" type="video/webm"/>
  <source src="./img/select-array-input-create.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


In the create component, use the `useCreateSuggestionContext` hook to add a new choice to the list of options.

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
    const { onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState('');

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

## `disableValue`

By default, `<SelectArrayInput>` renders the choices with the field `disabled: true` as disabled.

```jsx
const choices = [
    { _id: 'admin', label: 'Admin', disabled: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
];
<SelectArrayInput source="roles" choices={choices} />
```

If you want to use another field to denote disabled options, set the `disableValue` prop.

```jsx
const choices = [
    { _id: 'admin', label: 'Admin', not_available: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
];
<SelectArrayInput source="roles" choices={choices} disableValue="not_available" />
```

## `onCreate`

Use the `onCreate` prop to allow users to create new options on-the-fly. Its value must be a function. This lets you render a `prompt` to ask users about the new value. You can return either the new choice directly or a Promise resolving to the new choice.

{% raw %}
```js
import { SelectArrayInput, Create, SimpleForm, TextInput } from 'react-admin';

const UserCreate = () => {
    const choices = [
        { id: 'admin', name: 'Admin' },
        { id: 'u001', name: 'Editor' },
        { id: 'u002', name: 'Moderator' },
        { id: 'u003', name: 'Reviewer' },
    ];
    return (
        <Create>
            <SimpleForm>
                <SelectArrayInput
                    source="roles"
                    choices={choices}
                    onCreate={() => {
                        const newRoleName = prompt('Role name');
                        const newRole = { id: newRoleName.toLowerCase(), name: newRoleName };
                        choices.push(newRole);
                        return newRole;
                    }}
                />
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

If a prompt is not enough, you can use [the `create` prop](#create) to render a custom component instead.

## `options`

Use the `options` attribute if you want to override any of Material UI's `<Select>` attributes:

{% raw %}
```jsx
<SelectArrayInput source="category_ids" choices={choices} options={{ defaultOpen: true }} />
```
{% endraw %}

Refer to [Material UI Select documentation](https://mui.com/api/select) for more details.

## `optionText`

You can customize the properties to use for the option name (instead of the default `name`) thanks to the `optionText` prop:

```jsx
const choices = [
    { id: 'admin', label: 'Admin' },
    { id: 'u001', label: 'Editor' },
    { id: 'u002', label: 'Moderator' },
    { id: 'u003', label: 'Reviewer' },
];
<SelectArrayInput source="roles" choices={choices} optionText="label" />
```

`optionText` is especially useful when the choices are records coming from a `<ReferenceArrayInput>` or a `<ReferenceManyToManyInput>`. By default, react-admin uses the [`recordRepresentation`](./Resource.md#recordrepresentation) function to display the record label. But if you set the `optionText` prop, react-admin will use it instead.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <SelectArrayInput optionText="tag" />
</ReferenceArrayInput>
```

`optionText` also accepts a function, so you can shape the option text based on the entire choice object:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;

<SelectArrayInput source="authors" choices={choices} optionText={optionRenderer} />
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

<SelectArrayInput source="authors" choices={choices} optionText={<FullNameField />}/>
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
<SelectArrayInput source="roles" choices={choices} optionValue="_id" />
```

## `sx`: CSS API

The `<SelectArrayInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                     | Description                                                                        |
|-------------------------------|------------------------------------------------------------------------------------|
| `& .RaSelectArrayInput-chip`  | Applied to each Material UI's `Chip` component used as selected item               |
| `& .RaSelectArrayInput-chips` | Applied to the container of Material UI's `Chip` components used as selected items |

To override the style of all instances of `<SelectArrayInput>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaSelectArrayInput` key.

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
<SelectArrayInput source="roles" choices={choices} translateChoice={false}/>
```

## Fetching Choices

If you want to populate the `choices` attribute with a list of related records, you should decorate `<SelectArrayInput>` with [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), and leave the `choices` empty:

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
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
```

**Tip**: As it does not provide autocompletion, `<SelectArrayInput>` might not be suited when the reference resource has a lot of items.

Check [the `<ReferenceArrayInput>` documentation](./ReferenceArrayInput.md) for more details.

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

Use the `create` prop when you want a more polished or complex UI. For example a Material UI `<Dialog>` asking for multiple fields because the choices are from a referenced resource.

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
