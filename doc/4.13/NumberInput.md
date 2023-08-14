---
layout: default
title: "The NumberInput Component"
---

# `<NumberInput>`

`<NumberInput>` translates to an HTML `<input type="number">`, and converts the user input to a number.

<video controls autoplay playsinline muted loop>
  <source src="./img/number-input.webm" type="video/webm"/>
  <source src="./img/number-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

```jsx
import { NumberInput } from 'react-admin';

<NumberInput source="nb_views" />
```

`<NumberInput>` converts the input value to a number (integer or float) *on blur*. This is because if the input updates the form value on every keystroke, it will prevent users from entering certain float values. For instance, to enter the number `1.02`, a user would type `1.0`, that JavaScript converts to the number `1`.

If you need the form value to update on change instead of on blur (for instance to update another input based on the number input value), you can build your own number input using `<TextInput>`, and the `format` and `parse` props. But be aware that this only works for integer values. 

## Props

| Prop   | Required | Type     | Default | Description                                                                                             |
| ------ | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `max`  | Optional | `number` | ''      | The maximum value to accept for this input                                                              |
| `min`  | Optional | `number` | ''      | The minimum value to accept for this input                                                              |
| `step` | Optional | `number` | `any`   | A stepping interval to use when using up and down arrows to adjust the value, as well as for validation |

`<NumberInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `step`

You can customize the `step` props (which defaults to "any"). For instance, to restrict the value to integers, use a value of 1 for the `step`:

```jsx
<NumberInput source="nb_views" step={1} />
```

## Usage In Filter Form

The [Filter Button/Form combo](https://marmelab.com/react-admin/FilteringTutorial.html#the-filter-buttonform-combo) changes the filter value as the user types. But, as explained earlier in this page, `<NumberInput>` converts the input value to a number on blur.

This means that using `<NumberInput>` in a filter form will not work as expected. The filter will only change when the user presses the Enter key, which differs from the other input types.

In a filter form, you should use a `<TextInput type="number">` instead:

```jsx
import { TextInput } from 'react-admin';

const convertStringToNumber = value => {
    const float = parseFloat(value);
    return isNaN(float) ? null : float;
};

const productFilters = [
    <TextInput label="Stock less than" source="stock_lte" type="number" parse={convertStringToNumber} />,
];

export const ProductList = () => (
    <List filters={productFilters}>
        ...
    </List>
);
```
