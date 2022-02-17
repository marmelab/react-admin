---
layout: default
title: "The SelectField Component"
---

# `<SelectField>`


When you need to display an enumerated field, `<SelectField>` maps the value to a string.

For instance, if the `gender` field can take values "M" and "F", here is how to display it as either "Male" or "Female":

```jsx
import { SelectField } from 'react-admin';

<SelectField source="gender" choices={[
   { id: 'M', name: 'Male' },
   { id: 'F', name: 'Female' },
]} />
```

## Properties

| Prop              | Required | Type                          | Default | Description                                                                                                                                  |
| ----------------- | -------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`         | Required | `Object[]`                    | -       | List of items to show as options                                                                                                             |
| `optionText`      | Optional | `string | Function | Element` | 'name'  | Name of the field to use to display the matching choice, or function returning that field name, or a React element to render for that choice |
| `optionValue`     | Optional | `string`                      | 'id'    | Name of the field to compare to the value to find the matching choice                                                                        |
| `translateChoice` | Optional | `boolean`                     | `true`  | Whether or not the choice text should be translated                                                                                          |

`<SelectField>` also accepts the [common field props](./Fields.md#common-field-props).

## Usage

By default, the option is built by:

- finding a choice where the `id` property equals the field value
- using the `name` property as the option text

You can also customize the properties to use for the lookup value and text, thanks to the `optionValue` and `optionText` attributes.

```jsx
const choices = [
   { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
   { _id: 456, full_name: 'Jane Austen', sex: 'F' },
];
<SelectField source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<SelectField source="author_id" choices={choices} optionText={optionRenderer} />
```

`optionText` also accepts a React Element, that will be cloned and receive the related choice as the `record` prop. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const FullNameField = ({ record }) => <Chip>{record.first_name} {record.last_name}</Chip>;
<SelectField source="author_id" choices={choices} optionText={<FullNameField />}/>
```

The current choice is translated by default, so you can use translation identifiers as choices:

```js
const choices = [
   { id: 'M', name: 'myroot.gender.male' },
   { id: 'F', name: 'myroot.gender.female' },
];
```

However, in some cases (e.g. inside a `<ReferenceField>`), you may not want the choice to be translated. In that case, set the `translateChoice` prop to `false`.

```jsx
<SelectField source="gender" choices={choices} translateChoice={false}/>
```

**Tip**: `<SelectField>` sets `translateChoice` to `true` by default.
