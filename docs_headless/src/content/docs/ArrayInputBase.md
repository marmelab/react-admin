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
                <div>Tags:</div>
                <ArrayInputBase source="tags">
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

**Note**: Setting [`shouldUnregister`](https://react-hook-form.com/docs/useform#shouldUnregister) on a form should be avoided when using `<ArrayInputBase>` (which internally uses `useFieldArray`) as the unregister function gets called after input unmount/remount and reorder. This limitation is mentioned in the react-hook-form [documentation](https://react-hook-form.com/docs/usecontroller#props). If you are in such a situation, you can use the [`transform`](./EditBase.html#transform) prop to manually clean the submitted values.

## Props

| Prop            | Required | Type                      | Default | Description                                                                                                                                                         |
|-----------------| -------- |---------------------------| ------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source`        | Required | `string`                  | -       | Name of the entity property to use for the input value                                                                                                              |
| `defaultValue`  | Optional | `any`                     | -       | Default value of the input.                                                                                                                                         |
| `readOnly`      | Optional | `boolean`                 | `false`       | If true, the input is in read-only mode.                                                                                                                                     |
| `disabled`      | Optional | `boolean`                 | `false`       | If true, the input is disabled.                                                                                                                                     |
| `validate`      | Optional | `Function` &#124; `array` | -       | Validation rules for the current property. See the [Validation Documentation](./Validation.md#per-input-validation-built-in-field-validators) for details.          |