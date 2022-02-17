---
layout: default
title: "The TextField Component"
---

# `<TextField>`

The simplest of all fields, `<TextField>` simply displays the record property as plain text.

```jsx
import { TextField } from 'react-admin';

<TextField label="Author Name" source="name" />
```

**Tip**: If you want to display data from more than one field, check out the [`<FunctionField>`](./FunctionField.md), which accepts a `render` function:

```jsx
import { FunctionField } from 'react-admin';

<FunctionField
    label="Name"
    render={record => `${record.first_name} ${record.last_name}`}
/>;
```
