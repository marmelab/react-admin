---
layout: default
title: "The Calendar Component"
---

# `<Calendar>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component, part of [the `ra-calendar` module](https://marmelab.com/ra-enterprise/modules/ra-calendar), renders a list of events as a calendar. 

![the `<Calendar>` component](https://marmelab.com/ra-enterprise/modules/assets/ra-calendar.gif)

The user interface offers everything you expect:

- month, week, day views
- list view
- drag and resize events
- whole-day events
- creating an event by clicking in the calendar
- edition of event title, and metadata
- events spanning on multiple days
- recurring events
- background events
- theming
- locales and timezones
- resource time grid (e.g. rooms) (requires additional licence from Full Calendar)

## Usage

Use `<Calendar>` as a child of `<List>`:

```jsx
import { Calendar, getFilterValuesFromInterval } from '@react-admin/ra-calendar';
import { List } from 'react-admin';

const EventList = () => (
    <List
        filterDefaultValues={getFilterValuesFromInterval()}
        perPage={1000}
        pagination={false}
    >
        <Calendar />
    </List>
);
```

The `ra-calendar` module also offers a full replacement for the `<List>` component, complete with show and edit views for events, called `<CompleteCalendar>`:

```jsx
import React from 'react';
import {
    Admin,
    Resource,
    SimpleForm,
    TextInput,
    DateTimeInput,
} from 'react-admin';
import { CompleteCalendar } from '@react-admin/ra-calendar';

import dataProvider from './dataProvider';

const EventList = () => (
    <CompleteCalendar>
        <SimpleForm>
            <TextInput source="title" autoFocus />
            <DateTimeInput source="start" />
            <DateTimeInput source="end" />
        </SimpleForm>
    </CompleteCalendar>
);

export const Basic = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="events" list={EventList} />
    </Admin>
);
```

Check [the `ra-calendar` documentation](https://marmelab.com/ra-enterprise/modules/ra-calendar) for more details.