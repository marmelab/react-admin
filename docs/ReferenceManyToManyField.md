---
layout: default
title: "The ReferenceManyToManyField Component"
---

# `<ReferenceManyToManyField>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component fetches a list of referenced records by lookup in an associative table, and passes the records down to its child component, which must be an iterator component.

!["ReferenceManyToManyField example showing band's venues"](./img/reference-many-to-many-field.png)

For instance, here is how to fetch the venues related to a band record by matching `band.id` to `performances.band_id`, then matching `performances.venue_id` to `venue.id`, and then display the venue name for each, in a `<ChipField>`:

```jsx
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    SingleFieldList,
    ChipField,
} from 'react-admin';
import { ReferenceManyToManyField } from '@react-admin/ra-relationships';

export const BandShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <ReferenceManyToManyField
                reference="venues"
                through="performances"
                using="band_id,venue_id"
            >
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceManyToManyField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

This example uses the following schema:

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

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships#referencemanytomanyfield) for more details.
