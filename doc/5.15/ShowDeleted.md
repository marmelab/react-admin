---
layout: default
title: "The ShowDeleted Component"
---

# `<ShowDeleted>`

The `<ShowDeleted>` component replaces the [`<Show>`](https://marmelab.com/react-admin/Show.html) component when displaying a deleted record.

It has the same properties as `<Show>`, apart from `resource`, `id` and `queryOptions` which are passed from the context and cannot be overridden. See [`<Show>` props documentation](https://marmelab.com/react-admin/Show.html#props) for more info.

It is intended to be used with [`detailComponents`](./DeletedRecordsList.md#detailcomponents) of [`<DeletedRecordsList>`](./DeletedRecordsList.md).

{% raw %}
```tsx
import { Admin, CustomRoutes, SimpleShowLayout, TextField } from 'react-admin';
import { Route } from 'react-router-dom';
import { DeletedRecordsList, ShowDeleted } from '@react-admin/ra-soft-delete';

const ShowDeletedBook = () => (
    <ShowDeleted>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="description" />
        </SimpleShowLayout>
    </ShowDeleted>
);

export const App = () => (
    <Admin>
        ...
        <CustomRoutes>
            <Route path="/deleted" element={
                <DeletedRecordsList detailComponents={{
                    books: ShowDeletedBook,
                }} />
            } />
        </CustomRoutes>
    </Admin>
);
```
{% endraw %}

It is rendered in a dialog opened on click on a row of the `<DeletedRecordsTable>`.

![A dialog showing a deleted record](https://react-admin-ee.marmelab.com/assets/ShowDeleted.png)