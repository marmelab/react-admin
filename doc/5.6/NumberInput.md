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

Upon submission, the `dataProvider` will receive a number, not a string.

## Usage

Use `<NumberInput>` for number values, or for string values that convert to a number. For instance, if your API expects Post records to look like this:

```json
{
    "id": 123,
    "title": "Lorem Ipsum",
    "average_note": 4
}
```

Then you can use a `<NumberInput>` for the `average_note` field:

```jsx
import { Edit, SimpleForm, TextInput, NumberInput, required } from 'react-admin';

export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <NumberInput source="average_note" validate={[required()]} />
        </SimpleForm>
    </Edit>
);
```

`<NumberInput>` works for integer and float values. 

## Props

| Prop   | Required | Type     | Default | Description                                                                                             |
| ------ | -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `max`  | Optional | `number` | ''      | The maximum value to accept for this input                                                              |
| `min`  | Optional | `number` | ''      | The minimum value to accept for this input                                                              |
| `step` | Optional | `number` | `any`   | A stepping interval to use when using up and down arrows to adjust the value, as well as for validation |

`<NumberInput>` also accepts the [common input props](./Inputs.md#common-input-props) (including `parse` and `format`, which you can use to customize the string to number conversion).

## `step`

You can customize the `step` props (which defaults to "any"). For instance, to restrict the value to integers, use a value of 1 for the `step`:

```jsx
<NumberInput source="nb_views" step={1} />
```
