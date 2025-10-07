---
layout: default
title: "<ArrayInputBase>"
---

`<ArrayInputBase>` allows editing of embedded arrays, like the `items` field in the following `order` record:

```json
{
    "id": 1,
    "date": "2022-08-30",
    "customer": "John Doe",
    "items": [
        {
            "name": "Office Jeans",
            "price": 45.99,
            "quantity": 1,
        },
        {
            "name": "Black Elegance Jeans",
            "price": 69.99,
            "quantity": 2,
        },
        {
            "name": "Slim Fit Jeans",
            "price": 55.99,
            "quantity": 1,
        },
    ],
}
```

## Usage

`<ArrayInputBase>` expects a single child, which must be a *form iterator* component. A form iterator is a component rendering a field array (the object returned by react-hook-form's [`useFieldArray`](https://react-hook-form.com/docs/usefieldarray)). You can build such component using [the `<SimpleFormIteratorBase>`](./SimpleFormIteratorBase.md).

```tsx
import { ArrayInputBase, EditBase, Form } from 'ra-core';
import { MyFormIterator } from './MyFormIterator';
import { DateInput } from './DateInput';
import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';

export const OrderEdit = () => (
    <EditBase>
        <Form>
            <DateInput source="date" />
            <div>
                <div>Items:</div>
                <ArrayInputBase source="items">
                    <MyFormIterator>
                        <TextInput source="name" />
                        <NumberInput source="price" />
                        <NumberInput source="quantity" />
                    </MyFormIterator>
                </ArrayInputBase>
            </div>
            <button type="submit">Save</button>
        </Form>
    </EditBase>
)
```

**Note**: Setting [`shouldUnregister`](https://react-hook-form.com/docs/useform#shouldUnregister) on a form should be avoided when using `<ArrayInputBase>` (which internally uses `useFieldArray`) as the unregister function gets called after input unmount/remount and reorder. This limitation is mentioned in the react-hook-form [documentation](https://react-hook-form.com/docs/usecontroller#props). If you are in such a situation, you can use the [`transform`](./EditBase.md#transform) prop to manually clean the submitted values.

## Props

| Prop            | Required | Type                      | Default | Description                                                                                                                                                         |
|-----------------| -------- |---------------------------| ------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source`        | Required | `string`                  | -       | Name of the entity property to use for the input value                                                                                                              |
| `defaultValue`  | Optional | `any`                     | -       | Default value of the input.                                                                                                                                         |
| `validate`      | Optional | `Function` &#124; `array` | -       | Validation rules for the current property. See the [Validation Documentation](./Validation.md#per-input-validation-built-in-field-validators) for details.          |

## Global validation

If you are using an `<ArrayInputBase>` inside a form with global validation, you need to shape the errors object returned by the `validate` function like an array too.

For instance, to display the following errors:

![ArrayInput global validation](./img/ArrayInput-global-validation.png)

You need to return an errors object shaped like this:

```js
        {
            authors: [
                {},
                {
                    name: 'A name is required', 
                    role: 'ra.validation.required' // translation keys are supported too
                },
            ],
        }
```

**Tip:** You can find a sample `validate` function that handles arrays in the [Form Validation documentation](./Validation.md#global-validation).

## Disabling The Input

`<ArrayInputBase>` does not support the `disabled` and `readOnly` props.

If you need to disable the input, make sure the children are either `disabled` and `readOnly`:

```jsx
import { ArrayInputBase, EditBase, Form } from 'ra-core';
import { MyFormIterator } from './MyFormIterator';
import { DateInput } from './DateInput';
import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';

const OrderEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="customer" />
            <DateInput source="date" />
            <div>
                <div>Items:</div>
                <ArrayInputBase source="items">
                    <MyFormIterator inline disabled>
                        <TextInput source="name" readOnly/>
                        <NumberInput source="price" readOnly />
                        <NumberInput source="quantity" readOnly />
                    </MyFormIterator>
                </ArrayInputBase>
            </div>
            <button type="submit">Save</button>
        </Form>
    </EditBase>
);
```

## Changing An Item's Value Programmatically

You can leverage `react-hook-form`'s [`setValue`](https://react-hook-form.com/docs/useform/setvalue) method to change an item's value programmatically.

However you need to know the `name` under which the input was registered in the form, and this name is dynamically generated depending on the index of the item in the array.

To get the name of the input for a given index, you can leverage the `SourceContext` created by react-admin, which can be accessed using the `useSourceContext` hook.

This context provides a `getSource` function that returns the effective `source` for an input in the current context, which you can use as input name for `setValue`.

Here is an example where we leverage `getSource` and `setValue` to change the role of an user to 'admin' when the 'Make Admin' button is clicked:

{% raw %}

```tsx
import { ArrayInputBase, useSourceContext } from 'ra-core';
import { useFormContext } from 'react-hook-form';
import { MyFormIterator } from './MyFormIterator';

const MakeAdminButton = () => {
    const sourceContext = useSourceContext();
    const { setValue } = useFormContext();

    const onClick = () => {
        // sourceContext.getSource('role') will for instance return
        // 'users.0.role'
        setValue(sourceContext.getSource('role'), 'admin');
    };

    return (
        <button onClick={onClick}>
            Make admin
        </button>
    );
};

const UserArray = () => (
    <ArrayInputBase source="users">
        <MyFormIterator inline>
            <TextInput source="name" helperText={false} />
            <TextInput source="role" helperText={false} />
            <MakeAdminButton />
        </MyFormIterator>
    </ArrayInputBase>
);
```

{% endraw %}

**Tip:** If you only need the item's index, you can leverage the [`useSimpleFormIteratorItem` hook](./SimpleFormIterator.md#getting-the-element-index) instead.