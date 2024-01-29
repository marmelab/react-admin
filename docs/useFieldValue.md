---
layout: default
title: "useFieldValue"
---

# `useFieldValue`

A hook that gets the value of a field of the current record. It gets the current record from the context or use the one provided as a prof. It supports deep sources such as `name.fr`.

## Usage

Here is an example `TextField` component:

```jsx
import * as React from 'react';
+import { useFieldValue } from 'react-admin';

const TextField = ({ source }) => {
    const value = useFieldValue(props);
    return record ? <span>{value}</span> : null;
}
```

## Options

### `source`

The name of the property on the record object that contains the value to display. Can be a deep path.

### `record`

The record from which to read the value. Read from the `RecordContext` by default.
