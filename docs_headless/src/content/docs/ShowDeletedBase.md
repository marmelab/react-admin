---
title: "<ShowDeletedBase>"
---

The `<ShowDeletedBase>` component replaces the [`<ShowBase>`](./ShowBase.md) component when displaying a deleted record.

It provides the same `ShowContext` as `<ShowBase>` so that you can use the same children components.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import { CoreAdmin, CustomRoutes, WithRecord } from 'ra-core';
import { Route } from 'react-router-dom';
import { DeletedRecordsListBase, DeletedRecordRepresentation, ShowDeletedBase, type DeletedRecordType } from '@react-admin/ra-core-ee';

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
                                            <DeletedItem record={record} />
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

const DeletedItem = ({ record }: { record: DeletedRecordType }) => {
    const [showDetails, setShowDetails] = React.useState(false);
    return (
        <>
            <div><strong>{record.resource}</strong></div>
            <DeletedRecordRepresentation record={record} />
            <div>
                <button onClick={() => setShowDetails(true)}>Details</button>
            </div>
            {showDetails ? (
                <ShowDeletedBase record={record}>
                    <WithRecord render={record => <p>{record.title}</p>} />
                    <WithRecord render={record => <p>{record.description}</p>} />
                    <button onClick={() => setShowDetails(false)}>Close</button>
                </ShowDeletedBase>
            ) : null}
        </>
    )
}
```

## Props

| Prop       | Required | Type       | Default | Description                                                                           |
|------------|----------|------------|---------|---------------------------------------------------------------------------------------|
| `children` | Required | `Element`  |         | The component used to render the deleted record.                                      |
| `record`   | Optional | `RaRecord` |         | The deleted record. If not provided, the record from closest `RecordContext` is used. |
