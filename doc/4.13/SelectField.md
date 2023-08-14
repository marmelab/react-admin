---
layout: default
title: "The SelectField Component"
---

# `<SelectField>`

When you need to display an enumerated field, `<SelectField>` maps the value to a string.

## Usage

For instance, if the `gender` field can take values "M" and "F", here is how to display it as either "Male" or "Female":

```jsx
import { SelectField } from 'react-admin';

<SelectField source="gender" choices={[
   { id: 'M', name: 'Male' },
   { id: 'F', name: 'Female' },
]} />
```

## Props

| Prop              | Required | Type                          | Default | Description                                                                                                                                  |
| ----------------- | -------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `choices`         | Required | `Object[]`                    | -       | List of items to show as options                                                                                                             |
| `optionText`      | Optional | `string | Function | Element` | 'name'  | Name of the field to use to display the matching choice, or function returning that field name, or a React element to render for that choice |
| `optionValue`     | Optional | `string`                      | 'id'    | Name of the field to compare to the value to find the matching choice                                                                        |
| `translateChoice` | Optional | `boolean`                     | `true`  | Whether or not the choice text should be translated                                                                                          |

`<SelectField>` also accepts the [common field props](./Fields.md#common-field-props).

## `choices`

An array of objects with two keys:

- `id` to map the field value
- `name` for the string to display

```jsx
const languages = [
  { id: "ab", name: "Abkhaz" },
  { id: "aa", name: "Afar" },
  { id: "af", name: "Afrikaans" },
  { id: "ak", name: "Akan" },
  { id: "sq", name: "Albanian" },
  { id: "am", name: "Amharic" },
  { id: "ar", name: "Arabic" },
  // ...
];

<SelectField source="language" choices={languages} />
```

You can customize the properties to use for the lookup value and text, thanks to the [`optionValue`](#optionvalue) and [`optionText`](#optiontext) attributes.

```jsx
const languages = [
  { id: "ab", name: "Abkhaz", nativeName:"аҧсуа" },
  { id: "aa", name: "Afar", nativeName:"Afaraf" },
  { id: "af", name: "Afrikaans", nativeName:"Afrikaans" },
  { id: "ak", name: "Akan", nativeName:"Akan" },
  { id: "sq", name: "Albanian", nativeName:"Shqip" },
  { id: "am", name: "Amharic", nativeName:"አማርኛ" },
  { id: "ar", name: "Arabic", nativeName:"العربية" },
  // ...
];

<SelectField source="language" choices={languages} optionText="nativeName" />
```

**Tip**: If you need to fetch the choices, you probably need a [`<ReferenceField>`](./ReferenceField.md) instead.

## `optionText`

You can customize the property to use for the lookup text instead of `name` using the `optionText` prop.

```jsx
const currencies = [
   // ...
   {
      id: 'USD',
      name: 'US Dollar',
      namePlural: 'US dollars',
      symbol: '$',
      symbolNative: '$',
   },
   {
      id: 'RUB',
      name: 'Russian Ruble',
      namePlural: 'Russian rubles',
      symbol: 'RUB',
      symbolNative: '₽.',
   },
   // ...
];
<SelectField source="currency" choices={choices} optionText="symbol" />
```

`optionText` also accepts a function, so you can shape the option text at will:

```jsx
const authors = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
<SelectField source="author" choices={authors} optionText={optionRenderer} />
```

`optionText` also accepts a React Element. React-admin renders it once per choice, within a [`RecordContext`](./useRecordContext.md) containing the related choice. You can use Field components there.

```jsx
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];
const FullNameField = () => {
   const record = useRecordContext();
   return record ? (
      <Chip>{record.first_name} {record.last_name}</Chip>
   ) : null;
};

<SelectField source="author_id" choices={choices} optionText={<FullNameField />}/>
```

## `optionValue`

You can customize the property to use for the lookup value instead of `id` using the `optionValue` prop.

```jsx
const countries = [ 
  { name: 'Afghanistan', code: 'AF'}, 
  { name: 'Åland Islands', code: 'AX'}, 
  { name: 'Albania', code: 'AL'}, 
  { name: 'Algeria', code: 'DZ'},
  // ...
];
<SelectField source="country" choices={choices} optionValue="code" />
```

## `translateChoice`

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
