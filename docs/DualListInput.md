---
layout: default
title: "The DualListInput Component"
---

# `<DualListInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit array values, one-to-many or many-to-many relationships by moving items from one list to another.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-relationships-duallistinput.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-relationships-duallistinput.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

This input allows editing values that are arrays of scalar values, e.g. `[123, 456]`. 

**Tip**: React-admin includes other components allowing the edition of such values:

- [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) renders an Autocomplete
- [`<SelectArrayInput>`](./SelectArrayInput.md) renders a dropdown list of choices
- [`<CheckboxGroupInput>`](./CheckboxGroupInput.md) renders a list of checkbox options

## Usage

In addition to the `source`, `<DualListInput>` requires one prop: the `choices` listing the possible values.

```jsx
import { Create, SimpleForm } from 'react-admin';
import { DualListInput } from "@react-admin/ra-relationships";

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <DualListInput source="roles" choices={[
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

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships) for more details.

## Props

| Prop                   | Required | Type                                                         | Default                                           | Description                                                                                                                            |
|------------------------|----------|--------------------------------------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `choices`              | Optional | `Object[]`                                                   | -                                                 | List of items to show as options. Required unless inside a ReferenceArray Input.                                                                                                       |
| `addButton`            | Optional | 'outlined' &#124; 'contained' &#124; 'text' &#124; `element` | -                                                 | A Material UI `variant` value for the add button or a React element to replace it.                                                             |
| `addButtonLabel`       | Optional | `string`                                                     | `ra-relationships. duallistinput. select`         | The text or translation key to use as the label for the add button                                                                     |
| `availableItems Label` | Optional | `string`                                                     | `ra-relationships. duallistinput. availableItems` | The text or translation key to use as the label for the list of available choices                                                      |
| `dense`                | Optional | `boolean`                                                    | `false`                                           | Visual density of the list component                                                                                                   |
| `disableValue`         | Optional | `string`                                                     | 'disabled'                                        | The custom field name used in `choices` to disable some choices                                                                        |
| `optionText`           | Optional | `string` &#124; `Function`                                   | `name`                                            | Field name of record to display in the suggestion item or function which accepts the current record as argument (`record => {string}`) |
| `optionValue`          | Optional | `string`                                                     | `id`                                              | Field name of record containing the value to use as input value                                                                        |
| `removeButton`         | Optional | 'outlined' &#124; 'contained' &#124; 'text' &#124; `element` | -                                                 | A Material UI `variant` value for the remove button or a React element to replace it.                                                          |
| `removeButton Label`   | Optional | `string`                                                     | `ra-relationships duallistinput. unselect`        | The text or translation key to use as the label for the remove button                                                                  |
| `selectedItems Label`  | Optional | `string`                                                     | `ra-relationships. duallistinput. selectedItems`  | The text or translation key to use as the label for the list of selected choices                                                       |
| `translateChoice`      | Optional | `boolean`                                                    | `true`                                            | Whether the choices should be translated                                                                                               |

`<DualListInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

The list of choices must be an array of objects - one object for each possible choice. In each object, `id` is the value, and the `name` is the label displayed to the user.

```jsx
<DualListInput source="roles" choices={[
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
]} />
```

You can render some options as disabled by setting the `disabled` field in some choices:

```jsx
<DualListInput source="roles" choices={[
    { _id: 'admin', label: 'Admin', disabled: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
]}  />
```

You can also use an array of objects with different properties for the label and value, given you specify the [`optionText`](#optiontext) and [`optionValue`](#optionvalue) props:

```jsx
<DualListInput source="roles" choices={[
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

If you need to *fetch* the options from another resource, you're actually editing a one-to-many or a many-to-many relationship. In this case, wrap the `<DualListInput>` in a [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) or a [`<ReferenceManyToManyInput>`](./ReferenceManyToManyInput.md) component. You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <DualListInput />
</ReferenceArrayInput>
```

If you have an *array of values* for the options, turn it into an array of objects with the `id` and `name` properties:

```jsx
const possibleValues = ['programming', 'lifestyle', 'photography'];
const ucfirst = name => name.charAt(0).toUpperCase() + name.slice(1);
const choices = possibleValues.map(value => ({ id: value, name: ucfirst(value) }));

<DualListInput source="roles" choices={choices} />
```

## `disableValue`

By default, `<DualListInput>` renders the choices with the field `disabled` as disabled.

```jsx
const choices = [
    { _id: 'admin', label: 'Admin', disabled: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
];
<DualListInput source="roles" choices={choices} />
```

If you want to use another field to denote disabled options, set the `disableValue` prop.

```jsx
const choices = [
    { _id: 'admin', label: 'Admin', not_available: true },
    { _id: 'u001', label: 'Editor' },
    { _id: 'u002', label: 'Moderator' },
    { _id: 'u003', label: 'Reviewer' },
];
<DualListInput source="roles" choices={choices} disableValue="not_available" />
```

## `optionText`

You can customize the properties to use for the option name (instead of the default `name`) thanks to the `optionText` prop:

```jsx
const choices = [
    { id: 'admin', label: 'Admin' },
    { id: 'u001', label: 'Editor' },
    { id: 'u002', label: 'Moderator' },
    { id: 'u003', label: 'Reviewer' },
];
<DualListInput source="roles" choices={choices} optionText="label" />
```

`optionText` is especially useful when the choices are records coming from a `<ReferenceArrayInput>` or a `<ReferenceManyToManyInput>`. By default, react-admin uses the [`recordRepresentation`](./Resource.md#recordrepresentation) function to display the record label. But if you set the `optionText` prop, react-admin will use it instead.

```jsx
<ReferenceArrayInput source="tag_ids" reference="tags">
    <DualListInput optionText="tag" />
</ReferenceArrayInput>
```

`optionText` also accepts a function, so you can shape the option text based on the entire choice object:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;

<DualListInput source="authors" choices={choices} optionText={optionRenderer} />
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

<DualListInput source="authors" choices={choices} optionText={<FullNameField />}/>
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
<DualListInput source="roles" choices={choices} optionValue="_id" />
```

## `sx`: CSS API

The `<DualListInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                          | Description                      |
|------------------------------------|----------------------------------|
| `& .RaDualListInput-main`          | Applied to the main container    |
| `& .RaDualListInput-label`         | Applied to the label             |
| `& .RaDualListInput-actions`       | Applied to the buttons container |
| `& .RaDualListInput-button`        | Applied to each button           |
| `& .RaDualListInput-addButton`     | Applied to the add button        |
| `& .RaDualListInput-removeButton`  | Applied to the remove button     |
| `& .RaDualListInput-list`          | Applied to each list             |
| `& .RaDualListInput-listHeader`    | Applied to each list header      |
| `& .RaDualListInput-selectedList`  | Applied to the selected list     |
| `& .RaDualListInput-availableList` | Applied to the available list    |

To override the style of all instances of `<DualListInput>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaDualListInput` key.


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

However, in some cases, you may not want the choice to be translated. Set the `translateChoice` prop to `false` for that purpose.

```jsx
<DualListInput source="roles" choices={choices} translateChoice={false}/>
```

Note that `translateChoice` is set to `false` when `<DualListInput>` is a child of `<ReferenceArrayInput>`.

## Using in a ReferenceArrayInput

If you want to populate the `choices` attribute with a list of related records, you should decorate `<DualListInput>` with [`<ReferenceArrayInput>`](./ReferenceArrayInput.md), and leave the `choices` empty:

```jsx
import {
    Create,
    DateInput,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin';
import { DualListInput } from "@react-admin/ra-relationships";

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput multiline source="body" />
            <DateInput source="published_at" />
            <ReferenceArrayInput reference="tags" source="tags">
                <DualListInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
```

**Tip**: As it does not provide autocompletion, `<DualListInput>` might not be suited when the reference resource has a lot of items.
