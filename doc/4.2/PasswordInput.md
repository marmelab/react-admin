---
layout: default
title: "The PasswordInput Component"
---

# `<PasswordInput>`

`<PasswordInput>` works like the [`<TextInput>`](./TextInput.md) but overwrites its `type` prop to `password` or `text` in accordance with a visibility button, hidden by default.

```jsx
import { PasswordInput } from 'react-admin';
<PasswordInput source="password" />
```

![Password Input](./img/password-input.png)

It is possible to change the default behavior and display the value by default via the `initiallyVisible` prop:

```jsx
import { PasswordInput } from 'react-admin';
<PasswordInput source="password" initiallyVisible />
```

![Password Input (visible)](./img/password-input-visible.png)

**Tip**: It is possible to set the [`autocomplete` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) by injecting an input props:

{% raw %}
```jsx
<PasswordInput source="password" inputProps={{ autocomplete: 'current-password' }} />
```
{% endraw %}
