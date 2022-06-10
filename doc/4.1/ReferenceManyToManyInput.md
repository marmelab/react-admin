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

The form displays the events name in a [`<SelectArrayInput>`](./SelectArrayInput.md):

```jsx
import {
    Edit,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';
import { ReferenceManyToManyInput } from '@react-admin/ra-relationships';

export const ArtistEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <ReferenceManyToManyInput
                source="id"
                reference="events"
                through="performances"
                using="artist_id,event_id"
            >
                <SelectArrayInput
                    label="Performances"
                    // Validation must be set on this component
                    validate={required()}
                    optionText="name"
                    fullWidth
                />
            </ReferenceManyToManyInput>
        </SimpleForm>
    </Edit>
);
```

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships#referencemanytomanyinput) for more details.
