---
layout: default
title: "The DateTimeInput Component"
---

# `<DateTimeInput>`

An input for editing dates with time. `<DateTimeInput>` renders an `<input type="datetime-local" >` element, that most browsers display as [date and time picker](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local).

<video controls autoplay playsinline muted loop>
  <source src="./img/date-time-input.webm" type="video/webm"/>
  <source src="./img/date-time-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The appearance depends on the browser, and falls back to a text input on safari. The date formatting in this input depends on the user's locale.

React-admin also proposes a [DateTimeInput styled with Material UI](#material-ui) documented at the end of this page.

## Usage

```jsx
import { DateTimeInput } from 'react-admin';

<DateTimeInput source="published_at" />
```

The input value must be a valid date string, i.e. a string understood by JavasSript's [`Date.parse()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse), or a `Date` object. Strings with [the ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) 'yyyy-MM-ddThh:mm' are the most common (e.g. `'2022-04-30T12:30'`). The field value may contain a timezone offset, e.g. `'2022-04-30T12:30+02:00'`. If no timezone is specified, the browser's timezone is used.

After modification by the user, the value is stored as a `Date` object, using the browser's timezone. When transformed to JSON, the date is serialized as a string in the ISO 8601 format ('yyyy-MM-ddThh:mm').

**Tip**: For a Material UI styled `<DateTimeInput>` component, check out [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)

## Props

`<DateTimeInput>` accepts the [common input props](./Inputs.md#common-input-props).

## Custom `format` and `parse`

Internally, `<DateTimeInput>` renders an [`<input type="datetime-local">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local).

If you need to implement your own `format` and `parse` functions, make sure the **format** function actually formats the input into [a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#local_date_and_time_strings).

## Material UI

[React-admin Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> proposes an alternative `<DateTimeInput>` styled with Material UI. 

![DateTimeInput with Material UI](./img/DateTimeInput-MUI.png)

This input also allows to specify the date format and the locale used. It is based on the [MUI X Date/Time pickers](https://mui.com/x/react-date-pickers/getting-started/).

### Usage

```tsx
import { DateTimeInput } from '@react-admin/ra-form-layout';
import { Edit, SimpleForm } from 'react-admin';

export const EventEdit = () => (
    <Edit>
        <SimpleForm>
            <DateTimeInput source="event_date" />
        </SimpleForm>
    </Edit>
);
```

`<DateTimeInput>` will accept either a `Date` object or any string that can be parsed into a `Date` as value. It will return a `Date` object, or `null` if the date is invalid.

**Tip:** You can use the `parse` prop to change the format of the returned value. See [Parsing the date/time as an ISO string](#parsing-the-datetime-as-an-iso-string) for an example.

### Props

| Prop         | Required | Type              | Default                                | Description                                                                                                                                                                                  |
| ------------ | -------- | ----------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fullWidth`  | -        | boolean           | -                                      | If `false`, the input will not expand to fill the form width                                                                                                                                      |
| `helperText` | -        | string            | -                                      | Text to be displayed under the input                                                                                                                                                         |
| `mask`       | -        | string            | -                                      | Alias for the MUI [`format`](https://mui.com/x/api/date-pickers/date-picker/#DatePicker-prop-format) prop. Format of the date/time when rendered in the input. Defaults to localized format. |
| `parse`      | -        | Function          | `value => value === '' ? null : value` | Callback taking the input value, and returning the value you want stored in the form state.                                                                                                  |
| `validate`   | -        | Function or Array | -                                      | Validation rules for the input. See the [Validation Documentation](https://marmelab.com/react-admin/Validation.html#per-input-validation-built-in-field-validators) for details.             |

Except for the `format` prop (renamed `mask`), `<DateTimeInput>` accepts the same props as the [MUI X Date/Time pickers](https://mui.com/x/api/date-pickers/). They also accept the common input props.

### Providing your own `LocalizationProvider`

MUI X Pickers need to be wrapped in a [LocalizationProvider](https://mui.com/components/pickers/#localization) to work properly. `<DateTimeInput>` already includes a default `<LocalizationProvider>` using the `date-fns` adapter and the `enUS` locale.

You can change the locale and the date format globally by wrapping the `<Admin>` with your own `<LocalizationProvider>`.

Here is how to set up the pickers to use the `fr` locale:

```tsx
import { Admin, Resource } from 'react-admin';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale/fr';
import { EventEdit } from './events';

export const App = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Admin>
            <Resource name="events" edit={EventEdit} />
        </Admin>
    </LocalizationProvider>
);
```

**Note:** React Admin only supports the `date-fns` adapter for now.

### Parsing the date/time as an ISO string

By default, `<DateTimeInput>` stores the date/time as a `Date` object in the form state. If you wish to store the date/time as an ISO string instead (or any other format), you can use the `parse` prop.

```tsx
<DateTimeInput
    source="published"
    parse={(date: Date) => (date ? date.toISOString() : null)}
/>
```
