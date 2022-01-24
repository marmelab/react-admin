---
layout: default
title: "The FunctionField Component"
---

# `<FunctionField>`

If you need a special function to render a field, `<FunctionField>` is the perfect match. It passes the `record` to a `render` function supplied by the developer. For instance, to display the full name of a `user` record based on `first_name` and `last_name` properties:

```jsx
import { FunctionField } from 'react-admin';

<FunctionField label="Name" render={record => `${record.first_name} ${record.last_name}`} />
```

## Properties

| Prop     | Required | Type     | Default | Description                                                                |
| -------- | -------- | -------- | ------- | -------------------------------------------------------------------------- |
| `render` | Required | function | -       | A function returning a string (or an element) to display based on a record |

`<FunctionField>` also accepts the [common field props](./Fields.md#common-field-props).

**Tip**: Technically, you can omit the `source` and `sortBy` properties for the `<FunctionField>` since you provide the render function. However, providing a `source` or a `sortBy` will allow the `Datagrid` to make the column sortable, since when a user clicks on a column, the `Datagrid` uses these properties to sort. Should you provide both, `sortBy` will override `source` for sorting the column.

**Tip**: If you want to combine two existing Field components, check  [the `<WrapperField>` component](./WrapperField.md) instead.
