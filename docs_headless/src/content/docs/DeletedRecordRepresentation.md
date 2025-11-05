---
title: "<DeletedRecordRepresentation>"
---

A component that renders the record representation of a deleted record.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import { CoreAdmin, CustomRoutes, WithRecord } from 'react-admin';
import { Route } from 'react-router-dom';
import { DeletedRecordsListBase, ShowDeletedBase, type DeletedRecordType } from '@react-admin/ra-core-ee';

export const App = () => (
    <CoreAdmin>
        ...
        <CustomRoutes>
            <Route
                path="/deleted"
                element={
                    <DeletedRecordsListBase>
                        <WithListContext
                            render={({ isPending, data }) => isPending ? null : (
                                <ul>
                                    {data.map(record => (
                                        <li key={record.id}>
                                            <div><strong>{record.resource}</strong></div>
                                            <DeletedRecordRepresentation record={record} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />
                    </DeletedRecordsListBase>
                }
            />
        </CustomRoutes>
    </CoreAdmin>
);
```

## Props

| Prop       | Required | Type       | Default | Description                                                                           |
|------------|----------|------------|---------|---------------------------------------------------------------------------------------|
| `record`   | Optional | `RaRecord` |         | The deleted record. If not provided, the record from closest `RecordContext` is used. |
