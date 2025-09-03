---
layout: default
title: "The Scheduler Component"
---

# `<Scheduler>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component, part of [`ra-scheduler`](https://react-admin-ee.marmelab.com/documentation/ra-search), is a full-featured scheduler for managing tasks, assignments, events, scheduling constraints and dependencies, completion, recurring events, property booking, skill matrix, nested events, etc.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-scheduler.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It supports drag and drop, infinite scroll, zoom, custom layout and styling, collapsible columns, localization, grouping and filtering and export to pdf. 

This packages integrates react-admin with [Bryntum Scheduler](https://bryntum.com/products/scheduler/), a modern and high-performance scheduling UI component. As it leverages react-admin's data provider, it is backend agnostic.

Test it live in the [Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-scheduler).

## Usage

`<Scheduler>` is an all-in one component. Use it as the `list` prop of a react-admin [`<Resource>`](https://marmelab.com/react-admin/Resource.html):

{% raw %}
```tsx
// in ./src/App.tsx
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { EventList } from './events/EventList';

export const MyAdmin = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="events" list={EventList} />
    </Admin>
);

// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { endOfDay, startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        endDate={endOfDay(new Date())}
    />
);
```
{% endraw %}

`<Scheduler>` renders a [Bryntum Scheduler](https://bryntum.com/products/scheduler/) and integrates it with the `dataProvider` and [`@react-admin/ra-form-layout` dialogs](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createdialog-editdialog--showdialog).

It uses all the available horizontal and vertical space in the layout's content section.

## Props

In addition to the props accepted by [Bryntum Scheduler](https://www.bryntum.com/products/scheduler/docs/guide/Scheduler/quick-start/react/), `<Scheduler>` accepts the following props:

| Prop                | Required | Type      | Default                                        | Description                                                                                                    |
|---------------------| -------- | --------- |------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `actions`           | Optional | ReactNode |                                                | A component displayed on top of the scheduler, usually to display a toolbar with action buttons                |
| `converters`        | Optional | object    |                                                | An object containing converters from dataProvider records to Bryntum models and vice-versa                     |
| `CreateDialogProps` | Optional | object    |                                                | Props to pass to the `<CreateDialog>` used to create new events                                                |
| `EditDialogProps`   | Optional | object    |                                                | Props to pass to the `<EditDialog>` used to edit existing events                                               |
| `eventCreate`       | Optional | ReactNode |                                                | The form used to create new events                                                                             |
| `eventEdit`         | Optional | ReactNode |                                                | The form used to edit existing events                                                                          |
| `mutationOptions`   | Optional | object    |                                                | The mutation options sent when updating _Events_ via drag/drop or resize and _Resources_ via the inline editor |
| `resources`         | Optional | object    | `{ resources: "resources", events: "events" }` | The resources names to use for _Events_ and _Resources_                                                        |
| `queryOptions`      | Optional | object    |                                                | The query options sent when fetching _Events_ and _Resources_                                                  |
| `sx`                | Optional | object    |                                                | The sx prop passed down to the wrapping `<div>` element                                                        |
| `title`             | Optional | object    |                                                | The title to display in the `<AppBar>`                                                                         |

## `actions`

A component displayed on top of the scheduler, usually to display a toolbar with action buttons. By default, it renders a toolbar with navigation buttons to go to the previous or next day.
You can provide your own actions by passing a component to the `actions` prop, for instance to use the provided navigation buttons for week or month navigation:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler, SchedulerWeeksNavigationButtons } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfWeek } from 'date-fns';

const EventListActions = () => (
    <TopToolbar>
        <SchedulerWeeksNavigationButtons />
    </TopToolbar>
);

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="weekAndDay"
        startDate={startOfWeek(new Date())}
        actions={<EventListActions />}
    />
);
```
{% endraw %}

## `converters`

An object that contains function converting dataProvider records to Bryntum models and vice-versa:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        converters={{
            toBryntumEvent?: (record: RaRecord) => ({
                id: record.id,
                name: record.name,
                resourceId: record.resource_id,
                eventColor: record.color,
                startDate: new Date(record.start_at),
                endDate: new Date(record.end_at),
            });
            toBryntumResource?: (record: RaRecord) => ({
                id: record.id,
                name: record.name,
            }),
            toEvent?: (model: EventModel) => ({
                id: model.id,
                name: model.name,
                resource_id: model.resourceId,
                start_at: model.startDate,
                end_at: model.endDate,
                color: record.eventColor,
            }),
            toResource?: (model: ResourceModel) => ({
                id: model.id,
                name: model.name,
            }),
        }}
    />
);
```
{% endraw %}

## `CreateDialogProps`

The props to pass to the [`<CreateDialog>`](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createdialog-editdialog--showdialog) used to create new events:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => {
    return (
        <Scheduler
            columns={[{ text: 'Name', field: 'name', width: 130 }]}
            viewPreset="hourAndDay"
            startDate={startOfDay(new Date())}
            CreateDialogProps={{
                title: "Create a new event"
            }}
        />
    );
};
```
{% endraw %}

## `EditDialogProps`

The props to pass to the [`<EditDialog>`](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createdialog-editdialog--showdialog) used to create new events:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => {
    return (
        <Scheduler
            columns={[{ text: 'Name', field: 'name', width: 130 }]}
            viewPreset="hourAndDay"
            startDate={startOfDay(new Date())}
            EditDialogProps={{
                title: <EventEditTitle />
            }}
        />
    );
};

const EventEditTitle = () => {
    const record = useRecordContext();
    return record ? <span>Edit {record?.name}</span> : null;
};
```
{% endraw %}

## `eventCreate`

`<Scheduler>` includes a default form for events creation and edition with the basic fields. You can provide a custom form component to create new events with the `eventCreate` prop:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';
import {
    AutocompleteInput,
    DateTimeInput,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        eventCreate={<CustomEventForm />}
    />
);

const CustomEventForm = () => (
    <SimpleForm>
        <TextInput source="name" validate={required()} />
        <ReferenceInput source="resourceId" reference="resources">
            <AutocompleteInput validate={required()} />
        </ReferenceInput>
        <DateTimeInput source="startDate" validate={required()} />
        <DateTimeInput source="endDate" validate={required()} />
        <SelectInput source="eventColor" choices={colors} />
    </SimpleForm>
);

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
```
{% endraw %}

## `eventEdit`

`<Scheduler>` includes a default form for events creation and edition with the basic fields. You can provide a custom form component to edit existing events with the `eventEdit` prop:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';
import {
    AutocompleteInput,
    DateTimeInput,
    ReferenceInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput
} from 'react-admin';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        eventEdit={<CustomEventForm />}
    />
);

const CustomEventForm = () => (
    <SimpleForm>
        <TextInput source="name" validate={required()} />
        <ReferenceInput source="resourceId" reference="resources">
            <AutocompleteInput validate={required()} />
        </ReferenceInput>
        <DateTimeInput source="startDate" validate={required()} />
        <DateTimeInput source="endDate" validate={required()} />
        <SelectInput source="eventColor" choices={colors} />
    </SimpleForm>
);

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
```
{% endraw %}


## `mutationOptions`

[Bryntum Scheduler](https://bryntum.com/products/scheduler/) allows users to modify events by resizing or drag/dropping them and resources by double clicking them. If you need to pass additional data for those updates, use the `mutationOptions` prop:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        mutationOptions={{ meta: { option: 'value' }}}
    />
);
```
{% endraw %}

## `resources`

By default, `<Scheduler>` uses:
- the resource from the current `ResourceContext` or "events" if no `ResourceContext` is available (for instance in a dashboard) as the default resource name for the scheduler _Events_
- "resources" as the default resource name for the scheduler _Resources_

If you want to use another name, set the `resources` prop:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        resources={{
            events: "tasks",
            resources: "employees"
        }}
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
    />
);
```
{% endraw %}

## `queryOptions`

The query options when fetching _Events_ or _Resources_:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        queryOptions={{ meta: { option: 'value' }}}
    />
);
```
{% endraw %}

## `sx`

The `sx` prop passed down to the wrapping `<div>` element:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        sx={{
            '& .b-grid-header': {
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            '& .b-sch-header-timeaxis-cell': {
                color: 'white',
            },
        }}
    />
);
```
{% endraw %}

## `title`

The title to display in the `<AppBar>`:

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

export const EventList = () => (
    <Scheduler
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        title="Today planning"
    />
);
```
{% endraw %}

## `<SchedulerDaysNavigationButtons>`

A component that displays navigation buttons to move through days in a `<Scheduler>` that displays data day by day.

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler, SchedulerDaysNavigationButtons } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfDay } from 'date-fns';

const EventListActions = () => (
    <TopToolbar>
        <SchedulerDaysNavigationButtons />
    </TopToolbar>
);

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="hourAndDay"
        startDate={startOfDay(new Date())}
        actions={<EventListActions />}
    />
);
```
{% endraw %}

## `<SchedulerWeeksNavigationButtons>`

A component that displays navigation buttons to move through weeks in a `<Scheduler>` that displays data week by week.

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler, SchedulerWeeksNavigationButtons } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfWeek } from 'date-fns';

const EventListActions = () => (
    <TopToolbar>
        <SchedulerWeeksNavigationButtons />
    </TopToolbar>
);

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="weekAndDay"
        startDate={startOfWeek(new Date())}
        actions={<EventListActions />}
    />
);
```
{% endraw %}

## `<SchedulerMonthsNavigationButtons>`

A component that displays navigation buttons to move through months in a `<Scheduler>` that displays data month by month.

{% raw %}
```tsx
// in ./src/events/EventList.tsx
import { Scheduler, SchedulerMonthsNavigationButtons } from '@react-admin/ra-scheduler';
import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';
import { startOfMonth } from 'date-fns';

const EventListActions = () => (
    <TopToolbar>
        <SchedulerMonthsNavigationButtons />
    </TopToolbar>
);

export const EventList = () => (
    <Scheduler
        columns={[{ text: 'Name', field: 'name', width: 130 }]}
        viewPreset="monthAndYear"
        startDate={startOfMonth(new Date())}
        actions={<EventListActions />}
    />
);
```
{% endraw %}
