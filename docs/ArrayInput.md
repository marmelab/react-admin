---
layout: default
title: "The ArrayInput Component"
---

# `<ArrayInput>`

To edit arrays of data embedded inside a record, `<ArrayInput>` creates a list of sub-forms.

<video controls autoplay playsinline muted loop>
  <source src="./img/array-input.webm" type="video/webm"/>
  <source src="./img/array-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


`<ArrayInput>` allows editing of embedded arrays, like the `items` field in the following `order` record:

```js
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

`<ArrayInput>` expects a single child, which must be a *form iterator* component. A form iterator is a component rendering a field array (the object returned by react-hook-form's [`useFieldArray`](https://react-hook-form.com/docs/usefieldarray)). For instance, [the `<SimpleFormIterator>` component](./SimpleFormIterator.md) displays an array of react-admin Inputs in an unordered list (`<ul>`), one sub-form by list item (`<li>`). It also provides controls for adding and removing a sub-record.

```jsx
import { 
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    ArrayInput,
    NumberInput,
    SimpleFormIterator
} from 'react-admin';

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="customer" />
            <DateInput source="date" />
            <ArrayInput source="items">
                <SimpleFormIterator inline>
                    <TextInput source="name" helperText={false} />
                    <NumberInput source="price" helperText={false} />
                    <NumberInput source="quantity" helperText={false} />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

Check [the `<SimpleFormIterator>` documentation](./SimpleFormIterator.md) for details about how to customize the sub form layout.

## Props

`<ArrayInput>` accepts the [common input props](./Inputs.md#common-input-props) (except `format` and `parse`).

## Global validation

If you are using an `<ArrayInput>` inside a form with global validation, you need to shape the errors object returned by the `validate` function like an array too.

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
