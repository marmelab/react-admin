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
import { Create, SimpleForm, TextInput, PasswordInput } from 'react-admin';

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <PasswordInput source="password" />
        </SimpleForm>
    </Create>
);
```

**Tip**: Your API should never send the password in any of its responses, because the API backend shouldn't store the password in clear. In particular, the response to the `dataProvider.create()` call should not contain the password passed as input.

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

## Usage in Edit Views

You may want to allow users to *update* a password on an existing record. The usual solution to this is to include a `new_password` input in the Edition form. The API will then check if this field is present in the payload, and update the password accordingly.

```jsx
import { Edit, SimpleForm, TextInput, PasswordInput } from 'react-admin';

const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <PasswordInput source="new_password" />
        </SimpleForm>
    </Edit>
);
```

