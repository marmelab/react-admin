---
layout: default
title: "The SelectInput Component"
---

# `<SelectInput>`

To let users choose a value in a list using a dropdown, use `<SelectInput>`. It renders using [Material UI's `<Select>`](https://mui.com/api/select).

<video controls autoplay playsinline muted loop>
  <source src="./img/select-input.webm" type="video/webm"/>
  <source src="./img/select-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


This input allows editing record fields that are scalar values, e.g. `123`, `'admin'`, etc.

## Usage

In addition to the `source`, `<SelectInput>` requires one prop: the `choices` listing the possible values.

```jsx
import { SelectInput } from 'react-admin';

<SelectInput source="category" choices={[
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

 - [`<AutocompleteInput>`](./AutocompleteInput.md) renders a list of suggestions in an autocomplete input
 - [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md) renders a list of radio buttons

**Tip**: If you need to let users select more than one item in the list, check out the [`<SelectArrayInput>`](./SelectArrayInput.md) component.

## Props

| Prop              | Required | Type                       | Default            | Description                                                                                                                            |
|-------------------|----------|----------------------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `choices`         | Optional | `Object[]`                 | -                  | List of items to show as options. Required unless inside a ReferenceInput.                                                             |
| `create`          | Optional | `Element`                  | `-`                | A React Element to render when users want to create a new choice                                                                       |
| `createLabel`     | Optional | `string`                   | `ra.action.create` | The label for the menu item allowing users to create a new choice. Used when the filter is empty                                       |
| `disableValue`    | Optional | `string`                   | 'disabled'         | The custom field name used in `choices` to disable some choices                                                                        |
| `emptyText`       | Optional | `string`                   | ''                 | The text to display for the empty option                                                                                               |
| `emptyValue`      | Optional | `any`                      | ''                 | The value to use for the empty option                                                                                                  |
| `isLoading`       | Optional | `boolean`                  | `false`            | If `true`, the component will display a loading indicator.                                                                             |
| `onCreate`        | Optional | `Function`                 | `-`                | A function called with the current filter value when users choose to create a new choice.                                              |
| `optionText`      | Optional | `string` &#124; `Function` &#124; `Component` | `undefined` &#124; `record Representation` | Field name of record to display in the suggestion item or function using the choice object as argument |
| `optionValue`     | Optional | `string`                   | `id`               | Field name of record containing the value to use as input value                                                                        |
| `resettable`      | Optional | `boolean`                  | `false`            | If `true`, display a button to reset the changes in this input value                                                                   |
| `translateChoice` | Optional | `boolean`                  | `true`             | Whether the choices should be translated                                                                                               |

`<SelectInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `choices`

An array of objects that represents the choices to show in the dropdown. The objects must have at least two fields: one to use for the option name, and the other to use for the option value. By default, `<SelectInput>` will use the `id` and `name` fields.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People' },
];
<SelectInput source="category" choices={choices} />
```

If the choices have different keys, you can use [`optionText`](#optiontext) and [`optionValue`](#optionvalue) to specify which fields to use for the name and value.

```jsx
const choices = [
    { _id: 'tech', label: 'Tech' },
    { _id: 'lifestyle', label: 'Lifestyle' },
    { _id: 'people', label: 'People' },
];
<SelectInput
    source="category"
    choices={choices}
    optionText="label"
    optionValue="_id"
/>
```

You can render some options as disabled by setting the `disabled` field in some choices:

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', disable: true },
];
<SelectInput source="author_id" choices={choices} />
```

`<SelectInput>` adds an empty option by default, to let users enter an empty value. You can disable this behavior by marking the input as required using the `validate` prop:

```jsx
import { SelectInput, required } from 'react-admin';

<SelectInput source="category" choices={choices} validate={required()} />
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

If you need to *fetch* the options from another resource, you're actually editing a many-to-one or a one-to-one relationship. In this case, wrap the `<SelectInput>` in a [`<ReferenceInput>`](./ReferenceInput.md). You don't need to specify the `choices` prop - the parent component injects it based on the possible values of the related resource.

```jsx
<ReferenceInput label="Author" source="author_id" reference="authors">
    <SelectInput />
</ReferenceInput>
```

See [Selecting a foreign key](#selecting-a-foreign-key) below for more information.

If you have an *array of values* for the options, turn it into an array of objects with the `id` and `name` properties:

```jsx
const possibleValues = ['tech', 'lifestyle', 'people'];
const ucfirst = name => name.charAt(0).toUpperCase() + name.slice(1);
const choices = possibleValues.map(value => ({ id: value, name: ucfirst(value) }));

<SelectInput source="category" choices={choices} />
```

## `create`

To allow users to add new options, pass a React element as the `create` prop. `<SelectInput>` will then render a menu item at the bottom of the list, which will render the passed element when clicked.

{% raw %}
```jsx
import { CreateCategory } from './CreateCategory';

const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <ReferenceInput source="category_id" reference="categories">
                <SelectInput create={<CreateCategory />} />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

// in ./CreateCategory.js
import { useCreate, useCreateSuggestionContext } from 'react-admin';
import {
    Box,
    BoxProps,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';

const CreateCategory = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [create] = useCreate();
    const [value, setValue] = React.useState(filter || '');

    const handleSubmit = event => {
        event.preventDefault();
        create(
          'categories',
          { data: { title: value } },
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

If you just need to ask users for a single string to create the new option, you can use [the `onCreate` prop](#oncreate) instead.

## `disableValue`

By default, `<SelectInput>` renders the choices with the field `disabled: true` as disabled.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', disabled: true },
];
<SelectInput source="category" choices={choices} />
```

If you want to use another field to denote disabled options, set the `disableValue` prop.

```jsx
const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People', not_available: true },
];
<SelectInput source="category" choices={choices} disableValue="not_available" />
```

## `emptyText`

If the input isn't required (using `validate={required()}`), users can select an empty choice with an empty text `''` as label.

You can override that label with the `emptyText` prop.

```jsx
<SelectInput source="category" choices={choices} emptyText="No category selected" />
```

The `emptyText` prop accepts either a string or a React Element.

And if you want to hide that empty choice, make the input required.

```jsx
<SelectInput source="category"  choices={choices} validate={required()} />
```

## `emptyValue`

If the input isn't required (using `validate={required()}`), users can select an empty choice. The default value for that empty choice is the empty string (`''`), or `null` if the input is inside a [`<ReferenceInput>`](./ReferenceInput.md).

You can override this value with the `emptyValue` prop.

```jsx
<SelectInput source="category" choices={choices} emptyValue={0} />
```

**Tip**: While you can set `emptyValue` to a non-string value (e.g. `0`), you cannot use `null` or `undefined`, as it would turn the `<SelectInput>` into an [uncontrolled component](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components). If you need the empty choice to be stored as `null` or `undefined`, use [the `parse` prop](./Inputs.md#parse) to convert the default empty value ('') to `null` or `undefined`, or use [the `sanitizeEmptyValues` prop](./SimpleForm.md#sanitizeemptyvalues) on the Form component.

## `isLoading`

When [fetching choices from a remote API](#fetching-choices), the `<SelectInput>` can't be used until the choices are fetched. To let the user know, you can pass the `isLoading` prop to `<SelectInput>`. This displays a loading indicator while the choices are being fetched.

```jsx
import { useGetList, SelectInput } from 'react-admin';

const UserCountry = () => {
    const { data, isLoading } = useGetList('countries');
    // data is an array of { id: 123, code: 'FR', name: 'France' }
    return (
        <SelectInput
            source="country"
            choices={data}
            optionText="name"
            optionValue="code"
            isLoading={isLoading}
        />
    );
}
```

## `onCreate`

Use the `onCreate` prop to allow users to create new options on-the-fly. Its value must be a function. This lets you render a `prompt` to ask users about the new value. You can return either the new choice directly or a Promise resolving to the new choice.

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

If a prompt is not enough, you can use [the `create` prop](#create) to render a custom component instead.

## `optionText`

By default, `<SelectInput>` uses the `name` property as the text content of each option.

```jsx
import { SelectInput } from 'react-admin';

<SelectInput
    source="category"
    choices={[
        { id: 'tech', name: 'Tech' },
        { id: 'lifestyle', name: 'Lifestyle' },
        { id: 'people', name: 'People' },
    ]}
/>
// renders HTML similar to
// <select>
//     <option value="tech">Tech</option>
//     <option value="lifestyle">Lifestyle</option>
//     <option value="people">People</option>
// </select>
```

If your `choices` don't have a `name` property, or if you want to use another property, you can use the `optionText` prop to specify which property to use:

```jsx
<SelectInput
    source="category"
    optionText="label"
    choices={[
        { id: 'tech', label: 'Tech' },
        { id: 'lifestyle', label: 'Lifestyle' },
        { id: 'people', label: 'People' },
    ]}
/>
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

<SelectInput source="author_id" choices={choices} optionText={<FullNameField />}/>
```

`optionText` is also useful when the choices are records [fetched from another resource](#fetching-choices), and `<SelectInput>` is a child of a [`<ReferenceInput>`](./ReferenceInput.md).

```jsx
import { SelectInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <SelectInput />
</ReferenceInput>
```

In that case, react-admin uses the [`recordRepresentation`](./Resource.md#recordrepresentation) of the related resource to display the record label. In the example above, `<SelectInput>` uses the resource representation of the `authors` resource, which is the `name` property.

But if you set the `optionText` prop, react-admin uses it instead of relying on `recordRepresentation`.

```jsx
import { SelectInput, ReferenceInput } from 'react-admin';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <SelectInput optionText="last_name" />
</ReferenceInput>
```

## `optionValue`

You can customize the property to use for the option value (instead of the default `id`) thanks to the `optionValue` prop:

```jsx
const choices = [
    { _id: 'tech', name: 'Tech' },
    { _id: 'lifestyle', name: 'Lifestyle' },
    { _id: 'people', name: 'People' },
];
<SelectInput source="category" choices={choices} optionValue="_id" />
```

## `resettable`

You can make the `SelectInput` component resettable using the `resettable` prop. This will add a reset button which will be displayed only when the field has a value.

```jsx
<SelectInput source="category" choices={choices} resettable />
```

![resettable SelectInput](./img/resettable-select-input.png)

## `sx`: CSS API

The `<SelectInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                | Description                                               |
|--------------------------|-----------------------------------------------------------|
| `& .RaSelectInput-input` | Applied to the underlying `ResettableTextField` component |

To override the style of all instances of `<SelectInput>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaSelectInput` key.

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
<SelectInput source="gender" choices={choices} translateChoice={false}/>
```

Note that `translateChoice` is set to `false` when `<SelectInput>` is a child of `<ReferenceInput>`.

## Fetching Choices

You can use [`useGetList`](./useGetList.md) to fetch choices. For example, to fetch a list of countries for a user profile:

```jsx
import { useGetList, SelectInput } from 'react-admin';

const CountryInput = () => {
    const { data, isLoading } = useGetList('countries');
    // data is an array of { id: 123, code: 'FR', name: 'France' }
    return (
        <SelectInput
            source="country"
            choices={data}
            optionText="name"
            optionValue="code"
            isLoading={isLoading}
        />
    );
}
```

The `isLoading` prop is used to display a loading indicator while the data is being fetched.

However, most of the time, if you need to populate a `<SelectInput>` with choices fetched from another resource, it's because you are trying to set a foreign key. In that case, you should use [`<ReferenceInput>`](./ReferenceInput.md) to fetch the choices instead (see next section).

## Selecting a Foreign Key

If you use `<SelectInput>` to set a foreign key for a many-to-one or a one-to-one relationship, you'll have to [fetch choices](#fetching-choices), as explained in the previous section. You'll also have to fetch the record corresponding to the current value of the foreign key, as it may not be in the list of choices.

For example, if a `contact` has one `company` via the `company_id` foreign key, a contact form can let users select a company as follows:

```jsx
import { useGetList, useGetOne, SelectInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

const CompanyInput = () => {
    // fetch possible companies
    const { data: choices, isLoading: isLoadingChoices } = useGetList('companies');
    // companies are like { id: 123, name: 'Acme' }
    // get the current value of the foreign key
    const companyId = useWatch({ name: 'company_id'})
    // fetch the current company
    const { data: currentCompany, isLoading: isLoadingCurrentCompany } = useGetOne('companies', { id: companyId });
    // if the current company is not in the list of possible companies, add it
    const choicesWithCurrentCompany = choices
        ? choices.find(choice => choice.id === companyId)
            ? choices
            : [...choices, currentCompany]
        : [];
    return (
        <SelectInput
            label="Company"
            source="company_id"
            choices={choicesWithCurrentCompany}
            optionText="name"
            disabled={isLoading}
        />
    );
}
```

As this is a common task, react-admin provides a shortcut to do the same in a declarative way: [`<ReferenceInput>`](./ReferenceInput.md):

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

const CompanyInput = () => (
    <ReferenceInput reference="companies" source="company_id">
        <SelectInput
            label="Company"
            source="company_id"
            optionText="name"
        />
    </ReferenceInput>
);
```

`<ReferenceInput>` is a headless component that:

 - fetches a list of records with `dataProvider.getList()` and `dataProvider.getOne()`, using the `reference` prop for the resource,
 - puts the result of the fetch in the `ChoiceContext` as the `choices` prop, as well as the `isLoading` state,
 - and renders its child component

When rendered as a child of `<ReferenceInput>`, `<SelectInput>` reads that `ChoiceContext` to populate its own `choices` and `isLoading` props.

In fact, you can simplify the code even further:

- `<ReferenceInput>` puts all its props inside the `ChoiceContext`, including `source`, so `<SelectInput>` doesn't need to repeat it.
- You can also put the `label` prop on the `<ReferenceInput>` rather than `<SelectInput>` so that it looks just like [`<ReferenceField>`](./ReferenceField.md) (for easier memorization).
- `<SelectInput>` uses the [`recordRepresentation`](./Resource.md#recordrepresentation) to determine how to represent the related choices. In the example above, the `companies` resource uses `name` as its `recordRepresentation`, so `<SelectInput>` will default to `optionText="name"`.

The code for the `<CompanyInput>` component can be reduced to:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

const CompanyInput = () => (
    <ReferenceInput reference="companies" source="company_id" label="Company">
        <SelectInput />
    </ReferenceInput>
);
```

This is the recommended approach for using `<SelectInput>` to select a foreign key. This not only signifies that the input is a `<SelectInput>` but also highlights its function in fetching choices from another resource, ultimately enhancing the code's readability.

**Tip**: `<ReferenceInput>` is much more powerful than the initial snippet. It optimizes and caches API calls, enables refetching of both API calls with a single command, and stores supplementary data in the `<ChoicesContext>`. `<ReferenceInput>` can provide choices to `<SelectInput>`, but also to [`<AutocompleteInput>`](./AutocompleteInput.md) and [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md). For further information, refer to [the `<ReferenceInput>` documentation](./ReferenceInput.md).

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
} from '@mui/material';

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

## Tree Structure

If the choices form a hierarchy or a tree, use the [`<TreeInput>`](./TreeInput.md) component instead of `<SelectInput>`. It renders a collapsible tree structure, and lets users select a value by clicking on a node.

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { TreeInput } from '@react-admin/ra-tree';

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <TreeInput source="category" treeData={[
                { id: 1, title: 'Clothing', isRoot: true, children: [2, 6] },
                { id: 2, title: 'Men', children: [3] },
                { id: 3, title: 'Suits', children: [4, 5] },
                { id: 4, title: 'Slacks', children: [] },
                { id: 5, title: 'Jackets', children: [] },
                { id: 6, title: 'Women', children: [7, 10, 11] },
                { id: 7, title: 'Dresses', children: [8, 9] },
                { id: 8, title: 'Evening Gowns', children: [] },
                { id: 9, title: 'Sun Dresses', children: [] },
                { id: 10, title: 'Skirts', children: [] },
                { id: 11, title: 'Blouses', children: [] },
            ]} />
        </SimpleForm>
    </Edit>
);
```
