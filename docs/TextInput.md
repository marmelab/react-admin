---
layout: default
title: "The TextInput Component"
---

# `<TextInput>`

`<TextInput>` is the most common input. It is used for texts, emails, URL or passwords. In translates to an HTML `<input>` tag.

![TextInput](./img/text-input.gif)

```jsx
import { TextInput } from 'react-admin';

<TextInput source="title" />
```

## Properties

| Prop         | Required | Type      | Default | Description                                                          |
| ------------ | -------- | --------- | ------- | -------------------------------------------------------------------- |
| `multiline`  | Optional | `boolean` | `false` | If `true`, the input height expands as the text wraps over several lines |
| `resettable` | Optional | `boolean` | `false` | If `true`, display a button to reset the changes in this input value |
| `type`       | Optional | `string`  | `text`  | Type attribute passed to the `<input>` element                       |

`<TextInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

You can choose a specific input type using the `type` attribute, for instance `text` (the default), `email`, `url`, or `password`:

```jsx
<TextInput label="Email Address" source="email" type="email" />
```

You can make the `<TextInput>` expandable using the `multiline` prop for multiline text values. It renders as an auto expandable textarea.

```jsx
<TextInput multiline source="body" />
```

You can make the `<TextInput>` component resettable using the `resettable` prop. This will add a reset button which will be displayed only when the field has a value and is focused.

```jsx
import { TextInput } from 'react-admin';

<TextInput source="title" resettable />
```

![resettable TextInput](./img/resettable-text-input.gif)

**Warning**: Do not use `type="number"`, or you'll receive a string as value (this is a [known React bug](https://github.com/facebook/react/issues/1425)). Instead, use [`<NumberInput>`](./NumberInput.md).
