---
layout: default
title: "The useRecordFromLocation Hook"
---

# `useRecordFromLocation`

Return a record that was passed through either [the location query or the location state](https://reactrouter.com/6.28.0/start/concepts#locations).

You may use it to know whether the form values of the current create or edit view have been overridden from the location as supported by the [`Create`](./Create.md#prefilling-the-form) and [`Edit`](./Edit.md#prefilling-the-form) components.

## Usage

```tsx
// in src/posts/PostEdit.tsx
import * as React from 'react';
import { Alert } from '@mui/material';
import { Edit, SimpleForm, TextInput, useRecordFromLocation } from 'react-admin';

export const PostEdit = () => {
    const recordFromLocation = useRecordFromLocation();
    return (
        <Edit>
            {recordFromLocation
                ? (
                    <Alert variant="filled" severity="info">
                        The record has been modified.
                    </Alert>
                )
                : null
            }
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Edit>
    );
}
```

## Options

Here are all the options you can set on the `useRecordFromLocation` hook:

| Prop           | Required | Type       | Default    | Description                                                                      |
| -------------- | -------- | ---------- | ---------- | -------------------------------------------------------------------------------- |
| `searchSource` |          | `string`   | `'source'` | The name of the location search parameter that may contains a stringified record |
| `stateSource`  |          | `string`   | `'record'` | The name of the location state parameter that may contains a stringified record  |

## `searchSource`

The name of the [location search](https://reactrouter.com/6.28.0/start/concepts#locations) parameter that may contains a stringified record. Defaults to `source`.

## `stateSource`

The name of the [location state](https://reactrouter.com/6.28.0/start/concepts#locations) parameter that may contains a stringified record. Defaults to `record`.
