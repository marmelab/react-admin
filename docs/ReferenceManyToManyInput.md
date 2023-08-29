---
layout: default
title: "The ReferenceManyToManyInput Component"
---

# `<ReferenceManyToManyInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to create, edit or remove relationships between two resources sharing an associative table. The changes in the associative table are sent to the dataProvider when the user submits the form, so that they can cancel the changes before submission.

<video controls autoplay playsinline muted loop width="100%">
  <source src="./img/reference-many-to-many-input.webm" type="video/webm" />
  <source src="./img/reference-many-to-many-input.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

In this example, `bands.id` matches `performances.band_id`, and `performances.venue_id` matches `venues.id`:

```
┌─────────┐       ┌──────────────┐      ┌───────────────┐
│ bands   │       │ performances │      │ venues        │
│---------│       │--------------│      │---------------│
│ id      │───┐   │ id           │   ┌──│ id            │
│ name    │   └──╼│ band_id      │   │  │ name          │
│         │       │ venue_id     │╾──┘  │ location      │
│         │       │ date         │      │               │
└─────────┘       └──────────────┘      └───────────────┘
```

The form displays the venues name in a [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md):

```jsx
import React from 'react';
import {
    AutocompleteArrayInput,
    Edit,
    SimpleForm,
    TextInput,
} from 'react-admin';
import { ReferenceManyToManyInput } from '@react-admin/ra-relationships';

export const BandEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceManyToManyInput
                reference="venues"
                through="performances"
                using="band_id,venue_id"
            >
                <AutocompleteArrayInput
                    label="Performances"
                    optionText="name"
                />
            </ReferenceManyToManyInput>
        </SimpleForm>
    </Edit>
);
```

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships#referencemanytomanyinput) for more details.
