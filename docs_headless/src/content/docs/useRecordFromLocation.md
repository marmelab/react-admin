---
title: "useRecordFromLocation"
---

Return a record that was passed through either [the location query or the location state](https://reactrouter.com/6.28.0/start/concepts#locations).

You may use it to know whether the form values of the current create or edit view have been overridden from the location as supported by the [`CreateBase`](./CreateBase.md#prefilling-the-form) and [`EditBase`](./EditBase.md#prefilling-the-form) components.

## Usage

```tsx
// in src/posts/PostEdit.tsx
import * as React from 'react';
import { EditBase, Form, useRecordFromLocation } from 'ra-core';
import { TextInput } from '../components';

export const PostEdit = () => {
    const recordFromLocation = useRecordFromLocation();
    return (
        <EditBase>
            {recordFromLocation && (
                <div 
                    style={{
                        padding: '12px 16px',
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #2196f3',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        color: '#0d47a1'
                    }}
                >
                    The record has been modified.
                </div>
            )}
            <Form>
                <TextInput source="title" />
            </Form>
        </EditBase>
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
