---
layout: default
title: "The ReferenceManyToManyInput Component"
---

# `<ReferenceManyToManyInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to create, edit or remove relationships between two resources sharing an associative table. The changes in the associative table are sent to the dataProvider when the user submits the form, so that they can cancel the changes before submission.

In this example, `artists.id` matches `performances.artist_id`, and `performances.event_id` matches `events.id`:

```
┌────────────┐       ┌──────────────┐      ┌────────┐
│ artists    │       │ performances │      │ events │
│------------│       │--------------│      │--------│
│ id         │───┐   │ id           │      │ id     │
│ first_name │   └──╼│ artist_id    │   ┌──│ name   │
│ last_name  │       │ event_id     │╾──┘  │        │
└────────────┘       └──────────────┘      └────────┘
```

The form displays the events name in a `<SelectArrayInput>`:

```jsx
import * as React from 'react';
import { Edit, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { ReferenceManyToManyInput, useReferenceManyToManyUpdate } from '@react-admin/ra-many-to-many';

/**
 * Decorate <SimpleForm> to override the default save function.
 * This is necessary to save changes in the associative table
 * only on submission.
 */
const ArtistEditForm = props => {
    const save = useReferenceManyToManyUpdate({
        record: props.record,
        redirect: props.redirect || 'list',
        reference: 'events',
        resource: props.resource,
        source: 'id',
        through: 'performances',
        undoable: props.undoable,
        using: 'artist_id,event_id',
    });

    return <SimpleForm {...props} save={save} />;
};

const ArtistEdit = () => (
    <Edit>
        <ArtistEditForm>
            <TextInput disabled source="id" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <ReferenceManyToManyInput
                source="id"
                reference="events"
                through="performances"
                using="artist_id,event_id"
                fullWidth
                label="Performances"
            >
                <SelectArrayInput optionText="name" />
            </ReferenceManyToManyInput>
        </ArtistEditForm>
    </Edit>
);

export default ArtistEdit;
```

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships#referencemanytomanyinput) for more details.
