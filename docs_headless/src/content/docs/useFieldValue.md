---
title: "useFieldValue"
---

A hook that gets the value of a field of the current record. It gets the current record from the context or use the one provided as a prop. It supports deep sources such as `name.fr`.

## Usage

Here is an example `TextField` component:

```tsx
// In TextField.tsx
import * as React from 'react';
import { useFieldValue } from 'ra-core';

export const TextField = (props) => {
    const value = useFieldValue(props);
    return <span>{value}</span>;
}

// In PostShow.tsx
import { ShowBase } from 'ra-core';
import { TextField } from './TextField.tsx';

export const PostShow = () => (
    <ShowBase>
        <div>
            <TextField source="author.name" label="Author" />
        </div>
    </ShowBase>
);
```

## Params

### `source`

The name of the property on the record object that contains the value to display. Can be a deep path.

```tsx
import * as React from 'react';
import { useFieldValue } from 'ra-core';

export const CustomerCard = () => {
    const firstName = useFieldValue({ source: 'firstName' });
    const lastName = useFieldValue({ source: 'lastName' });
    return <span>{lastName} {firstName}</span>;
}
```

### `record`

The record from which to read the value. Read from the `RecordContext` by default.


```tsx
import * as React from 'react';
import { useFieldValue, useGetOne } from 'ra-core';

export const CustomerCard = ({ id }: { id: string }) => {
    const { data } = useGetOne('customer', { id });
    const firstName = useFieldValue({ source: 'firstName', record: data });
    const lastName = useFieldValue({ source: 'lastName', record: data });
    return <span>{lastName} {firstName}</span>;
}
```

### `defaultValue`

The value to return when the record does not have a value for the specified `source`.

```tsx
import * as React from 'react';
import { useFieldValue } from 'ra-core';

export const CustomerStatus = () => {
    const status = useFieldValue({ source: 'status', defaultValue: 'active' });
    return <span>{status}</span>;
}
```
