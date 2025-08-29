---
title: "useInput"
storybook_path: ra-core-form-useinput--basic
---

This hook lets you build custom inputs for react-admin. It's a wrapper around [react-hook-form's `useController`](https://react-hook-form.com/docs/usecontroller).

React-admin adds functionality to react-hook-form:

- handling of custom event emitters like `onChange`,
- support for an array of validators,
- detection of required fields to add an asterisk to the field label,
- parse and format to translate record values to form values and vice-versa.

## Usage

`useInput` expects at least a `source`, and returns an object with the following properties:

```jsx
{ id, field, fieldState, formState, isRequired }
```

For instance, to build a custom input for a `title` field:

```jsx
import { useInput } from 'ra-core';

const TitleInput = ({ source, label }) => {
    const { id, field, fieldState } = useInput({ source });
    return (
        <label htmlFor={id}>
            {label}
            <input id={id} {...field} />
            {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
        </label>
    );
};
```

## Props

| Prop           | Required | Type                           | Default          | Description                                                       |
| -------------- | -------- | ------------------------------ | ---------------- | ----------------------------------------------------------------- |
| `source`       | Required | `string`                       | -                | The name of the field in the record                               |
| `defaultValue` | Optional | `any`                          | -                | The default value of the input                                    |
| `readOnly`     | Optional | `boolean`                      | `false`          | If true, the input is in read-only mode.                          |
| `disabled`     | Optional | `boolean`                      | `false`          | If true, the input is disabled.                                   |
| `format`       | Optional | `Function`                     | -                | A function to format the value from the record to the input value |
| `helperText`   | Optional | `string`                       | -                | Text to be displayed under the input                              |
| `label`        | Optional | `string`                       | -                | Input label.                                                      |
| `parse`        | Optional | `Function`                     | -                | A function to parse the value from the input to the record value  |
| `validate`     | Optional | `Function` &#124; `Function[]` | -                | A function or an array of functions to validate the input value   |
| `id`           | Optional | `string`                       | `auto-generated` | The id of the input                                               |
| `onChange`     | Optional | `Function`                     | -                | A function to call when the input value changes                   |
| `onBlur`       | Optional | `Function`                     | -                | A function to call when the input is blurred                      |

Additional props are passed to [react-hook-form's `useController` hook](https://react-hook-form.com/docs/usecontroller).

## `defaultValue`

Value of the input if the record has no value for the `source`.

```tsx
<Form record={{ id: 123, title: 'Lorem ipsum' }}>
    <NumberInput source="age" defaultValue={18} /> {/* input initially renders with value 18 */}
    <TextInput source="title" defaultValue="Hello, World!" /> {/* input initially renders with value "Lorem ipsum" */}
</Form>
```

React-admin will ignore these default values if the Form already defines [a form-wide `defaultValues`](./Form.md#defaultvalues):

```tsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';

export const PostCreate = () => (
    <CreateBase>
        <Form defaultValues={{
            title: 'My first post',
            body: 'This is my first post',
            nb_views: 123,
        }}>
            <TextInput source="title" />
            <TextInput source="body" multiline />
            {/* input initially renders with value 123 (form > input) */}
            <NumberInput source="nb_views" defaultValue={0} />
        </Form>
    </CreateBase>
);
```

**Tip**: `defaultValue` cannot use a function as value. For default values computed at render time, set the `defaultValues` at the form level.

```jsx
import { CreateBase, Form } from 'ra-core';
import uuid from 'uuid';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';

const postDefaultValue = () => ({ id: uuid(), created_at: new Date(), nb_views: 0 });

export const PostCreate = () => (
    <CreateBase>
        <Form defaultValues={postDefaultValue}>
            <TextInput source="title" />
            <TextInput source="body" multiline />
            <NumberInput source="nb_views" />
        </Form>
    </CreateBase>
);
```

## `readOnly`

The `readOnly` prop set to true should make the element not mutable, meaning the user can not edit the control.

```tsx
<TextInput source="title" readOnly />
```

Contrary to disabled controls, read-only controls are still focusable and are submitted with the form.

**Tip:** `readOnly` is actually not interpreted by `useInput`. It's up to the input component to handle this prop.

## `disabled`

The `disabled` prop set to true makes the element not mutable, focusable, or even submitted with the form.

```tsx
<TextInput source="title" disabled />
```

Contrary to read-only controls, disabled controls can not receive focus and are not submitted with the form.

**Warning:** Note that `disabled` inputs are **not** included in the form values, and hence may trigger `warnWhenUnsavedChanges` if the input previously had a value in the record.

**Tip:** To include the input in the form values, you can use `readOnly` instead of `disabled`.

## `format`

The `format` prop accepts a callback taking the value from the form state, and returning the input value (which should be a string).

```
form state value --> format --> form input value (string)
```

```tsx
{/* Unit Price is stored in cents, i.e. 123 means 1.23 */}
<NumberInput 
    source="unit_price"
    format={v => String(v * 100)}
    parse={v => parseFloat(v) / 100}
/>
```

`format` often comes in pair with [`parse`](#parse) to transform the input value before storing it in the form state. See the [Transforming Input Value](#transforming-input-value-tofrom-record) section for more details.

**Tip:** By default, react-admin inputs have the following `format` function, which turns any `null` or `undefined` value into an empty string. This is to avoid warnings about controlled/uncontrolled input components:

```ts
const defaultFormat = (value: any) => value == null ? '' : value;
```

## `helperText`

Most inputs accept a `helperText` prop to display a text below the input.

```tsx
<BooleanInput
    source="has_newsletter"
    helperText="User has opted in to the newsletter"
/>
```

Set `helperText` to `false` to remove the empty line below the input.

**Tip:** `helperText` is actually not interpreted by `useInput`. It's up to the input component to handle this prop.

**Tip:** It's a good idea to have your component also support [translation keys](./Translation.md#translation-keys) in `helperText`.

## `label`

The input label.

`label` is actually not interpreted by `useInput`. It's up to the input component to handle this prop.

It's a good idea to have your component support [translation keys](../i18n/Translation.md#translation-keys) in `label`, and hiding label when `label={false}`.

When omitted, you can use the humanized `source` property as default label.

**Tip**: Use the `<FieldTitle>` component to help you implement this logic.

```tsx
<TextInput source="title" /> {/* input label is "Title" */}
<TextInput source="title" label="Post title" /> {/* input label is "Post title" */}
<TextInput source="title" label={false} /> {/* input has no label */}
```

## `parse`

The `parse` prop accepts a callback taking the value from the input (which is a string), and returning the value to put in the form state.

```
form input value (string) ---> parse ---> form state value
```

```tsx
{/* Unit Price is stored in cents, i.e. 123 means 1.23 */}
<NumberInput 
    source="unit_price"
    format={v => String(v * 100)}
    parse={v => parseFloat(v) / 100}
/>
```

`parse` often comes in pair with [`format`](#format) to transform the form value before passing it to the input. See the [Transforming Input Value](#transforming-input-value-tofrom-record) section for more details.

**Tip:** By default, react-admin inputs have the following `parse` function, which transforms any empty string into `null`:

```js
const defaultParse = (value: string) => value === '' ? null : value;
```

## `source`

Specifies the field of the record that the input should edit.

```tsx
<Form record={{ id: 123, title: 'Hello, world!' }}>
    <TextInput source="title" /> {/* default value is "Hello, world!" */}
</Form>
```

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

```json
{
    "id": 1234,
    "title": "War and Peace",
    "author": {
        "firstName": "Leo",
        "lastName": "Tolstoi"
    }
}
```

Then you can display a text input to edit the author's first name as follows:

```tsx
<TextInput source="author.firstName" />
```

## `validate`

A function or an array of functions to validate the input value.

Validator functions should return `undefined` if the value is valid, or a string describing the error if it's invalid.

```tsx
const validateAge = (value: number) => {
    if (value < 18) {
        return 'Must be over 18';
    }
    return undefined;
}

<NumberInput source="age" validate={validate} />
```

**Tip**: If your admin has [multi-language support](../i18n/Translation.md), validator functions should return message *identifiers* rather than messages themselves. React-admin automatically passes these identifiers to the translation function:

```tsx
// in validators/required.js
const required = () => (value: any) =>
    value
        ? undefined
        : 'myroot.validation.required';
```

React-admin comes with a set of built-in validators:

* `required(message)` if the field is mandatory,
* `minValue(min, message)` to specify a minimum value for integers,
* `maxValue(max, message)` to specify a maximum value for integers,
* `minLength(min, message)` to specify a minimum length for strings,
* `maxLength(max, message)` to specify a maximum length for strings,
* `number(message)` to check that the input is a valid number,
* `email(message)` to check that the input is a valid email address,
* `regex(pattern, message)` to validate that the input matches a regex,
* `choices(list, message)` to validate that the input is within a given list,

These are validator factories, so you need to call the function to get the validator.

```tsx
<NumberInput source="age" validate={required()} />
```

You can use an array of validators to apply different validation rules to the same input.

```tsx
<NumberInput source="age" validate={[required(), validateAge]} />
```

**Note**: You can’t use both input-level validation and [form-level validation](../create-edit/Form.md#validate) - this is a `react-hook-form` limitation.

Check [the Validation chapter for details](../create-edit/Validation.md).

## Example with Native Input

```jsx
// in LatLongInput.js
import { useInput, required } from 'ra-core';

const BoundedInput = (props) => {
    const { onChange, onBlur, label, helperText, ...rest } = props;
    const {
        field,
        fieldState: { invalid, error },
        isRequired
    } = useInput({
        // Pass the event handlers to the hook but not the component as the field property already has them.
        // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
        onChange,
        onBlur,
        ...rest,
    });

    return (
        <div>
            <label htmlFor={field.name}>
                {label}
                {isRequired && <span aria-hidden="true"> *</span>}
            </label>
            <input
                id={field.name}
                {...field}
                aria-invalid={invalid}
                aria-errormessage={`${field.name}-error`}
                {...rest}
            />
            {invalid && error?.message ? (
                <span id={`${field.name}-error`} role="alert">
                    {error.message}
                </span>
            ) : helperText !== false ? (
                <span className="helper-text">
                    {helperText}
                </span>
            ) : null}
        </div>
    );
};

const LatLngInput = props => {
    const { source, ...rest } = props;

    return (
        <span>
            <BoundedInput source="lat" label="Latitude" validate={required()} {...rest} />
            &nbsp;
            <BoundedInput source="lng" label="Longitude" validate={required()} {...rest} />
        </span>
    );
};
```

## Example with Native Select

```jsx
// in SexInput.js
import { useInput } from 'ra-core';

const SexInput = props => {
    const { field, isRequired } = useInput(props);

    return (
        <div>
            <label htmlFor={field.name}>
                Sex
                {isRequired && <span aria-hidden="true"> *</span>}
            </label>
            <select
                id={field.name}
                {...field}
                aria-required={isRequired}
            >
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>
        </div>
    );
};
export default SexInput;
```

**Tip**: `useInput` accepts all arguments that you can pass to `useController`. Besides, components using `useInput` accept props like `format` and `parse`, to convert values from the form to the input, and vice-versa:

```jsx
const parse = value => {/* ... */};
const format = value => {/* ... */};

const PersonEdit = () => (
    <EditBase>
        <Form>
            <SexInput
                source="sex"
                format={formValue => formValue === 0 ? 'M' : 'F'}
                parse={inputValue => inputValue === 'M' ? 0 : 1}
            />
        </Form>
    </EditBase>
);
```

## Important note about formState

[react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

This pattern should be followed when writing a custom input with `useInput()`.

```jsx
const { formState: { isSubmitted }} = useInput(props); // ✅

const { formState } = useInput(props);
const submitted = formState.isSubmitted; // ❌
```

## Transforming Input Value to/from Record

The data format returned by the input component may not be what your API desires. You can use the `parse` and `format` functions to transform the input value when saving to and loading from the record.

Mnemonic for the two functions:

- `parse()`: input -> record
- `format()`: record -> input

Let's look at a simple example. Say the user would like to input values of 0-100 to a percentage field but your API (hence record) expects 0-1.0. You can use simple `parse()` and `format()` functions to archive the transform:

```tsx
<NumberInput
    source="percent"
    format={v => v * 100}
    parse={v => parseFloat(v) / 100}
    label="Formatted number"
/>
```

Another classical use-case is with handling dates. Imagine you have a `<DateInput>` that stores and returns a string. If you would like to store a JavaScript Date object in your record instead, you can do something like this:

```tsx
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateParseRegex = /(\d{4})-(\d{2})-(\d{2})/;

const convertDateToString = (value: string | Date) => {
    // value is a `Date` object
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const pad = '00';
    const yyyy = value.getFullYear().toString();
    const MM = (value.getMonth() + 1).toString();
    const dd = value.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateFormatter = (value: string | Date) => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') return '';
    if (value instanceof Date) return convertDateToString(value);
    // Valid dates should not be converted
    if (dateFormatRegex.test(value)) return value;

    return convertDateToString(new Date(value));
};

const dateParser = value => {
    //value is a string of "YYYY-MM-DD" format
    const match = dateParseRegex.exec(value);
    if (match === null || match.length === 0) return;
    const d = new Date(parseInt(match[1]), parseInt(match[2], 10) - 1, parseInt(match[3]));
    if (isNaN(d.getDate())) return;
    return d;
};


<DateInput source="isodate" format={dateFormatter} parse={dateParser} defaultValue={new Date()} />
```

**Tip:** A common usage for this feature is to deal with empty values. Indeed, HTML form inputs always return strings, even for numbers and booleans, however most backends expect a value like `null`. This is why, by default, all react-admin inputs will store the value `null` when the HTML input value is `''`. 

**Tip**: If you need to do this globally, including for custom input components that do not use the `useInput` hook, have a look at [the `sanitizeEmptyValues` prop of the `<Form>` component](../create-edit/Form.md#sanitizeemptyvalues).

## Empty Values

React-admin Form components initialize the input based on the current [`RecordContext`](../common/useRecordContext.md) values. If the `RecordContext` is empty or the matching property for this input is empty, the input will be empty.
If a record property is not `undefined`, it is not considered empty:

- An empty string is a valid value
- `0` is a valid value
- `null` is a valid value
- An empty array is a valid value

In all those cases, the value will not be considered empty and the [default value](#defaultvalue) won't be applied.

