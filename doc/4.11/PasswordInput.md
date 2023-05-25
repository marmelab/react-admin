---
layout: default
title: "The PasswordInput Component"
---

# `<PasswordInput>`

`<PasswordInput>` works like the [`<TextInput>`](./TextInput.md) but overwrites its `type` prop to `password` or `text` in accordance with a visibility button, hidden by default.

![Password Input](./img/password-input.png)

## Usage

Use it like a [`<TextInput>`](./TextInput.md):

```jsx
import { PasswordInput } from 'react-admin';

<PasswordInput source="password" />
```

## Props

| Prop   | Required | Type     | Default | Description   |
| ------ | -------- | -------- | ------- | ------------- |
| `initiallyVisible` | Optional | `boolean` | `false` | Whether the password should initially be shown |

`<PasswordInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `initiallyVisible`

It is possible to change the default behavior and display the value by default via the `initiallyVisible` prop:

```jsx
import { PasswordInput } from 'react-admin';
<PasswordInput source="password" initiallyVisible />
```

![Password Input (visible)](./img/password-input-visible.png)

## Disabling Autocomplete

Set the [`autocomplete` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by injecting an input props:

{% raw %}
```jsx
<PasswordInput source="password" inputProps={{ autocomplete: 'current-password' }} />
```
{% endraw %}
